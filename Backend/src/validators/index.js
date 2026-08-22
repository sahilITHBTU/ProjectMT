import {body} from"express-validator"
import { AvailableUserRole } from "../utils/constants.js";
const userRegisterValidator =()=>{
 return [
   body("email")
     .trim()
     .notEmpty()
     .withMessage("Email is required")
     .isEmail()
     .withMessage("email is not vaild"),

   body("username")
       .trim()
       .notEmpty()
       .withMessage("username is required")
       .isLowercase()
       .withMessage("Username must be in lowercase")
       .isLength({min:3})
       .withMessage("Username must be at least 3 charcaters long"),
    
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({min:8})
      .withMessage("password at least 8 character"),

    body("fullName")
      .optional()
      .trim()

 ];
}

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("email is not vaild"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("password at least 8 character"),

    body("fullName").optional().trim(),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("email is not vaild"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long"),
  ];
};

const createProjectValidator = () =>{
  return [
    body("name")
     .notEmpty()
     .withMessage("Name is required"),
    body("description").optional()

    
  ]
}

const AddMemeberTOProject = ()=>{
  return[
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid")

  ]
}
export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  AddMemeberTOProject,
};
