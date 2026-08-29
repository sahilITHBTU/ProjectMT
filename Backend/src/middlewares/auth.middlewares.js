import UserModel from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken"

 const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decodedToken?._id).select(
      "-password",
    );
    if (!user) {
      
      return res.status(401).json({ message: "Invalid Access Token" });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.log(
      "💥 CRITICAL ERROR caught in verifyJwt catch block:",
      error.message,
    );
    return res
      .status(401)
      .json({ error: error?.message || "Invalid access token" });
  }
};

export {verifyJwt}