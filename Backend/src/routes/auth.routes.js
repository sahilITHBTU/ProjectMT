import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetPassword,
  getCurrentUser,
  changeCurrentPassword,
  resendEmailverification,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
} from "../validators/index.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
const router = Router();

//unprotected routes
router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),validate,loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken)
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetPassword);



//protected routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/current-user").post(verifyJwt, getCurrentUser);
router.route("/change-password").post(verifyJwt,userChangeCurrentPasswordValidator,validate,changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJwt,resendEmailverification)

export default router;
