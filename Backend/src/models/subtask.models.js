import mongoose, { Schema } from "mongoose";

const SubTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref:"task",
    required: true,
    
  },
  isCompleted: {
 type:Boolean,
 default:false
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true
  }
},{timestamps:true});

const SubTaskModel = mongoose.model("subtask",SubTaskSchema);
export{SubTaskModel}