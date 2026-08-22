import UserModel from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken"

const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "unauthrized request");
  }

  try {
    const decodeedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decodeedToken?._id).select(
      "-password -refreshToken -emailVerficationToken -emailVerficationExpiry ",
    );
    if (!user) {
      throw new ApiError(401, "Invalid accessToken");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid accessToken");
  }
});

export { verifyJwt };