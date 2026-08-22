import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus,TaskStatusEnum } from "../utils/constants";
import { assign } from "nodemailer/lib/shared";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  project: {
    type: Schema.Types.ObjectId,
    ref: "project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  status:{
    type:String,
    enum:AvailableTaskStatus,
    default:TaskStatusEnum.TODO
  },
  attachemants:{
    type:[{
        url:String,
        mimetypes:String,
        size:Number
    }],
    default:[]
  },
  
},{timestamps:true});

const TaskModel = mongoose.model("task",TaskSchema)
export{TaskModel}