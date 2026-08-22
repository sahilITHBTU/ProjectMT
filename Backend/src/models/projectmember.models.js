import mongoose, { Schema } from "mongoose";
import {AvailableUserRole,userRolesEnum} from "../utils/constants.js";

const ProjectMemberSchema = new mongoose.Schema({
 user:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true,
 },
 project:{
    type:Schema.Types.ObjectId,
    ref:"project",
    required:true
 },
 role:{
    type:String,
    enum:AvailableUserRole,
    default:userRolesEnum.MEMBER
 }
},{timestamps:true})

const ProjectMemberModel = mongoose.model("projectmember",ProjectMemberSchema)
export {ProjectMemberModel}