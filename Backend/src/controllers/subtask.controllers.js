import { ProjectModel } from "../models/projects.models.js";
import { ApiError } from "../utils/api-errors.js";
import UserModel from "../models/user.models.js";

import { SubTaskModel } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const getSubTask = asyncHandler(async (req, res) => {
  //1
});
const createSubTask = asyncHandler(async (req, res) => {
  //1
});
const getSubTaskById = asyncHandler(async (req, res) => {
  //1
});
const updateSubTask = asyncHandler(async (req, res) => {
  //1
});
const deleteSubTask = asyncHandler(async (req, res) => {
  //1
});

export{
    getSubTask,
    createSubTask,
    getSubTaskById,
    updateSubTask,
    deleteSubTask
}