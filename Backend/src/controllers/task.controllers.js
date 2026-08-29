import { ProjectModel } from "../models/projects.models.js";
import { ApiError } from "../utils/api-errors.js";
import UserModel from "../models/user.models.js";
import { TaskModel } from "../models/task.models.js";
import { SubTaskModel } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await TaskModel.find({ project: projectId })
    .populate("assignedTo", "username fullName avatar")
    .populate("assignedBy", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];
  const attachemants = files.map((file) => ({
    url: `${req.protocol}://${req.get("host")}/images/${file.filename}`,
    mimetypes: file.mimetype,
    size: file.size,
  }));

  const task = await TaskModel.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo || undefined,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    status,
    attachemants,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await TaskModel.findById(taskId)
    .populate("assignedTo", "username fullName avatar")
    .populate("assignedBy", "username fullName avatar");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtasks = await SubTaskModel.find({ task: taskId }).populate(
    "createdBy",
    "username fullName avatar",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...task.toObject(), subtasks },
        "Task fetched successfully",
      ),
    );
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;

  const files = req.files || [];
  const newAttachemants = files.map((file) => ({
    url: `${req.protocol}://${req.get("host")}/images/${file.filename}`,
    mimetypes: file.mimetype,
    size: file.size,
  }));

  const updatePayload = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(assignedTo !== undefined && { assignedTo }),
    ...(status !== undefined && { status }),
  };

  if (newAttachemants.length > 0) {
    const existingTask = await TaskModel.findById(taskId);
    if (!existingTask) {
      throw new ApiError(404, "Task not found");
    }
    updatePayload.attachemants = [
      ...existingTask.attachemants,
      ...newAttachemants,
    ];
  }

  const task = await TaskModel.findByIdAndUpdate(taskId, updatePayload, {
    new: true,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});


const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const task = await TaskModel.findByIdAndUpdate(
    taskId,
    { status },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

const updateTaskProgress = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { progress } = req.body;

  const task = await TaskModel.findByIdAndUpdate(
    taskId,
    { progress },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task progress updated successfully"));
});

const addTaskAttachments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const files = req.files || [];
  if (files.length === 0) {
    throw new ApiError(400, "At least one attachment is required");
  }

  const newAttachemants = files.map((file) => ({
    url: `${req.protocol}://${req.get("host")}/images/${file.filename}`,
    mimetypes: file.mimetype,
    size: file.size,
  }));

  const existingTask = await TaskModel.findById(taskId);
  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  const task = await TaskModel.findByIdAndUpdate(
    taskId,
    { attachemants: [...existingTask.attachemants, ...newAttachemants] },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Attachment uploaded successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await TaskModel.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await SubTaskModel.deleteMany({ task: taskId });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

export {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskProgress,
  addTaskAttachments,
};
