import mongoose, { Schema } from "mongoose";

const TaskCommentSchema = new mongoose.Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const TaskCommentModel = mongoose.model("taskcomment", TaskCommentSchema);
export { TaskCommentModel };
