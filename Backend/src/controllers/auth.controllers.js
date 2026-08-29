import UserModel from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailVerficationMailgenContent,
  ForgotPasswordMailgenContent,
  sendEmail,
} from "../utils/mail.js";
import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("JWT Generation Detailed Error:", error);
    throw new ApiError(
      500,
      "something went gone wrong while genrating accessToken ",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existedUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "user with email or user with username already exist",
    );
  }
  const user = await UserModel.create({
    email,
    password,
    username,
    isEmailVerfied: false,
  });

  const { unHasedToken, hasedToken, TokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerficationToken = hasedToken;
  user.emailVerficationExpiry = TokenExpiry;

  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user?.email,
    subject: "Please verfiy your email",
    mailgenContent: emailVerficationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHasedToken}`,
    ),
  });
  const createdUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -emailVerficationToken -emailVerficationExpiry ",
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering a user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "user registered successfully and verification email has been sent on your email",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, " email is required");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user does not exits");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -emailVerficationToken -emailVerficationExpiry ",
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfuly",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      returnDocument: "after",
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "Email verification token is missing");
  }

  const hashedToken = createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await UserModel.findOne({ emailVerficationToken: hashedToken });

  if (!user) {
    if (req.body.email) {
      const existingUser = await UserModel.findOne({ email: req.body.email });
      if (existingUser?.isEmailVerfied) {
        throw new ApiError(400, "This user account is already verified");
      }
    }
    throw new ApiError(400, "Token is invalid");
  }

  if (
    user.emailVerficationExpiry &&
    user.emailVerficationExpiry <= Date.now()
  ) {
    throw new ApiError(400, "Token has expired");
  }

  user.emailVerficationToken = undefined;
  user.emailVerficationExpiry = undefined;
  user.isEmailVerfied = true;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isEmailVerfied: true },
        "Email verified successfully",
      ),
    );
});

const resendEmailverification = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "user does not exit");
  }

  if (user.isEmailVerfied) {
    throw new ApiError(404, "Email is already verfied");
  }

  const { unHasedToken, hasedToken, TokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerficationToken = hasedToken;
  user.emailVerficationExpiry = TokenExpiry;

  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user?.email,
    subject: "Please verfiy your email",
    mailgenContent: emailVerficationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHasedToken}`,
    ),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email Id"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const IncomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!IncomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access");
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh Token");
  }

  const user = await UserModel.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "invalid refresh Token");
  }

  if (IncomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, " refresh token expired");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  const { accessToken, refreshToken: newrefreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newrefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newrefreshToken },
        "Access token and refresh token ",
      ),
    );
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exit with this email id", []);
  }
  const { unHasedToken, hasedToken, TokenExpiry } =
    user.generateTemporaryToken();
  user.forgotPasswordToken = hasedToken;
  user.forgotPasswordExpiry = TokenExpiry;

  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: ForgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHasedToken}`,
    ),
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your registered email",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hasedToken = createHash("sha256").update(resetToken).digest("hex");

  const user = await UserModel.findOne({
    forgotPasswordToken: hasedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, "Token is in valid or expired");
  }

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old password and new password are required");
  }
  const user = await UserModel.findById(req.user?._id);
  const isPasswordVaild = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordVaild) {
    throw new ApiError(400, "invalid old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar image is required");
  }

  const user = await UserModel.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

 
 
  const oldLocalPath = user.avatar?.localPath;
  if (oldLocalPath) {
    fs.unlink(path.resolve(oldLocalPath), () => {});
  }

  user.avatar = {
    url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    localPath: `public/images/${req.file.filename}`,
  };

  await user.save({ validateBeforeSave: false });

  const updatedUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -emailVerficationToken -emailVerficationExpiry -forgotPasswordToken -forgotPasswordExpiry",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailverification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetPassword,
  changeCurrentPassword,
  updateAvatar,
};
