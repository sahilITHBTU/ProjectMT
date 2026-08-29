import { ProjectModel } from "../models/projects.models.js";
import { ApiError } from "../utils/api-errors.js";
import UserModel from "../models/user.models.js";
import { TaskModel } from "../models/task.models.js";
import { SubTaskModel } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const createSubTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { taskId } = req.params;

  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subTask = await SubTaskModel.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subTask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  const canManageContent = [
    userRolesEnum.ADMIN,
    userRolesEnum.PROJECT_ADMIN,
  ].includes(req.user?.role);

  if (title !== undefined && !canManageContent) {
    throw new ApiError(
      403,
      "You do not have permission to edit this subtask's title",
    );
  }

  const subTask = await SubTaskModel.findByIdAndUpdate(
    subTaskId,
    {
      ...(title !== undefined && canManageContent && { title }),
      ...(isCompleted !== undefined && { isCompleted }),
    },
    { new: true },
  );

  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const subTask = await SubTaskModel.findByIdAndDelete(subTaskId);
  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "Subtask deleted successfully"));
});

export { createSubTask, updateSubTask, deleteSubTask };
