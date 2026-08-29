import { body } from "express-validator";
import { AvailableUserRole, AvailableTaskStatus } from "../utils/constants.js";
const userRegisterValidator = () => {
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
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 charcaters long"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("password at least 8 character"),

    body("fullName").optional().trim(),
  ];
};

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

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const AddMemeberTOProject = () => {
  return [
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
      .withMessage("Role is invalid"),
  ];
};
const inviteMemberValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid")
      .normalizeEmail(),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("assignedTo").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage("Status is invalid"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("description").optional().trim(),
    body("assignedTo").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage("Status is invalid"),
  ];
};

const createSubTaskValidator = () => {
  return [body("title").trim().notEmpty().withMessage("Title is required")];
};

const updateSubTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be boolean"),
  ];
};

const updateTaskStatusValidator = () => {
  return [
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required")
      .isIn(AvailableTaskStatus)
      .withMessage("Status is invalid"),
  ];
};

const updateTaskProgressValidator = () => {
  return [
    body("progress")
      .notEmpty()
      .withMessage("Progress is required")
      .isInt({ min: 0, max: 100 })
      .withMessage("Progress must be a number between 0 and 100"),
  ];
};

const createTaskCommentValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ max: 1000 })
      .withMessage("Note must be under 1000 characters"),
  ];
};

const createNoteValidator = () => {
  return [body("content").trim().notEmpty().withMessage("Content is required")];
};

const updateNoteValidator = () => {
  return [body("content").trim().notEmpty().withMessage("Content is required")];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  AddMemeberTOProject,
  inviteMemberValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
  createNoteValidator,
  updateNoteValidator,
  updateTaskStatusValidator,
  updateTaskProgressValidator,
  createTaskCommentValidator,
};
