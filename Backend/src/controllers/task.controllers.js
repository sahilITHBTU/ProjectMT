import { ProjectModel } from "../models/projects.models.js";
import { ApiError } from "../utils/api-errors.js";
import UserModel from "../models/user.models.js";
import { TaskModel } from "../models/task.models.js";
import { SubTaskModel } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, userRolesEnum } from "../utils/constants.js";

const getTask = asyncHandler(async(req,res)=>{
const { title, description, assignedTo, assignedBy, status, attachemants } = req.body;
const{projectId} = req.params;

const project = await ProjectModel.findById(projectId);
if(!project){
    throw new ApiError(400,"Project not found")
}
});
const files = req.file || [];
files.map((file)=>{
    return{
        url:`${process.env.SERVER_URL}/images/${file.originalname}`
    }
})
const createTask = asyncHandler(async (req, res) => {
  //1
});
const getTaskById = asyncHandler(async (req, res) => {
  //1
});
const updateTask = asyncHandler(async (req, res) => {
  //1
});
const deleteTask = asyncHandler(async (req, res) => {
  //1
});

export{
    getTask,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
}