import mongoose from "mongoose";
import { ProjectMemberModel } from "../models/projectmember.models.js";
import { TaskModel } from "../models/task.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

const ValidateProjectPermission = (role = []) => {
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "Project id is missing");
    }

    const project = await ProjectMemberModel.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new ApiError(400, "Project  not found");
    }
    const givenRole = project?.role;
    req.user.role = givenRole;
    if (!role.includes(givenRole)) {
      throw new ApiError(
        404,
        "you dont have permission to perform this action",
      );
    }
    next();
  });
};

const ValidateTaskAssignee = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task id is missing");
  }

  const task = await TaskModel.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (
    !task.assignedTo ||
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "Only the member this task is assigned to can perform this action",
    );
  }

  req.task = task;
  next();
});

export { ValidateProjectPermission, ValidateTaskAssignee };
