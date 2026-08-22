import mongoose from "mongoose";
import { ProjectMemberModel } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js"

const ValidateProjectPermission = (role = [])=>{
   return asyncHandler(async(req,res,next)=>{
     const{projectId} = req.params;

     if(!projectId){
        throw new ApiError(400,"Project id is missing");
     }

     const project = await ProjectMemberModel.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user : new mongoose.Types.ObjectId(req.user._id)
     })

     if (!project) {
       throw new ApiError(400, "Project  not found");
     }
     const givenRole = project?.role;
     req.user.role = givenRole;
    if(!role.includes(givenRole)){
        throw new ApiError(404,"you dont have permission to perform this action")
    }
    next();
    })
}

export { ValidateProjectPermission };