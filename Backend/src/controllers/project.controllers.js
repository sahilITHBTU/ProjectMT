import { ProjectModel } from "../models/projects.models.js";
import { ApiError } from "../utils/api-errors.js";
import UserModel from "../models/user.models.js";
import { ProjectMemberModel } from "../models/projectmember.models.js";
import { PendingInvitationModel } from "../models/pendingInvitation.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailVerficationMailgenContent,
  ForgotPasswordMailgenContent,
  sendEmail,
} from "../utils/mail.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;


const dispatchInvitationEmail = ({ email, projectName, invitationToken }) => {
  console.log(
    `[mock email] Invitation dispatched to ${email} for project "${projectName}". ` +
      `Accept link token: ${invitationToken} (expires in 7 days).`,
  );
  return true;
};
const GetProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMemberModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmember",
            },
          },
          {
            $addFields: {
              memberCount: { $size: "$projectmember" },
            },
          },
        ],
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        _id: "$project._id",
        name: "$project.name",
        description: "$project.description",
        membersCount: "$project.memberCount",
        createdAt: "$project.createdAt",
        createdBy: "$project.createdBy",
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects Fetched successfully"));
});

const GetProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const projectWithRole = {
    ...project.toObject(),
    role: req.user?.role ?? null,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, projectWithRole, "Project fetched successfully"),
    );
});

const CreateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const Project = await ProjectModel.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });
  await ProjectMemberModel.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(Project._id),
    role: userRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, Project, "Project Created successfully"));
});

const UpdateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await ProjectModel.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project Not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project Updated successfully"));
});

const DeleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await ProjectModel.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project Not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted successfully"));
});

const AddMemberToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user does not exit");
  }

  await ProjectMemberModel.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );
  return res
    .status(201)
    .json(new ApiResponse(200, "Project member added successfully"));
});


const InviteMemberToProject = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { projectId } = req.params;

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await UserModel.findOne({ email: normalizedEmail });

  if (existingUser) {
    const alreadyMember = await ProjectMemberModel.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(existingUser._id),
    });

    if (!alreadyMember) {
      await ProjectMemberModel.create({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(existingUser._id),
        role: userRolesEnum.MEMBER,
      });
    }

    await PendingInvitationModel.deleteOne({
      project: new mongoose.Types.ObjectId(projectId),
      email: normalizedEmail,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { status: "joined" }, "User added directly"));
  }

  const invitationToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SEVEN_DAYS_MS);

  await PendingInvitationModel.findOneAndUpdate(
    { project: new mongoose.Types.ObjectId(projectId), email: normalizedEmail },
    {
      project: new mongoose.Types.ObjectId(projectId),
      email: normalizedEmail,
      invitedBy: new mongoose.Types.ObjectId(req.user._id),
      role: userRolesEnum.MEMBER,
      invitationToken,
      expiresAt,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  dispatchInvitationEmail({
    email: normalizedEmail,
    projectName: project.name,
    invitationToken,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { status: "invited" },
        "Invitation email dispatched",
      ),
    );
});

const GetProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const projectMemebrs = await ProjectMemberModel.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdBy: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, projectMemebrs, "Project Members fetched"));
});

const UpdateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const { newRole } = req.body;
  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(404, "Invalid Role");
  }

  let projectmember = await ProjectMemberModel.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });
  if (!projectmember) {
    throw new ApiError(404, "Project memeber not found");
  }
  const ProjectMember = await ProjectMemberModel.findByIdAndUpdate(
    projectmember._id,
    {
      role: newRole,
    },
    { new: true },
  );
  if (!ProjectMember) {
    throw new ApiError(404, "Project memeber not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ProjectMember,
        "Project Member role updated successfully",
      ),
    );
});

const DeleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  let projectmember = await ProjectMemberModel.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });
  if (!projectmember) {
    throw new ApiError(404, "Project memeber not found");
  }
  const ProjectMember = await ProjectMemberModel.findByIdAndDelete(
    projectmember._id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        ProjectMember,
        "Project Member deleted successfully",
      ),
    );
});

export {
  GetProjects,
  GetProjectById,
  CreateProject,
  UpdateProject,
  DeleteProject,
  AddMemberToProject,
  InviteMemberToProject,
  GetProjectMember,
  UpdateMemberRole,
  DeleteMember,
};
