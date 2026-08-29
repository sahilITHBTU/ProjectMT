import mongoose from "mongoose";
import { TaskModel } from "../models/task.models.js";
import { TaskCommentModel } from "../models/taskComment.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getTaskComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const comments = await TaskCommentModel.find({ task: taskId })
    .populate("createdBy", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Task notes fetched successfully"));
});

const createTaskComment = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { content } = req.body;

  const comment = await TaskCommentModel.create({
    task: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Note added successfully"));
});

export { getTaskComments, createTaskComment };
