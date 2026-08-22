import mongoose, { Schema } from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required:true
  },
},{timestamps:true});

const ProjectModel = mongoose.model("project",ProjectSchema);

export{ProjectModel};