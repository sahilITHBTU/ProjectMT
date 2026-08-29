import { ProjectModel } from "../models/projects.models.js";
import { ApiError } from "../utils/api-errors.js";
import { NoteModel } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await NoteModel.find({ project: projectId })
    .populate("createdBy", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const createNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { projectId } = req.params;

  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const note = await NoteModel.create({
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await NoteModel.findById(noteId).populate(
    "createdBy",
    "username fullName avatar",
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;

  const note = await NoteModel.findByIdAndUpdate(
    noteId,
    { content },
    { new: true },
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await NoteModel.findByIdAndDelete(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note deleted successfully"));
});

export { getNotes, createNote, getNoteById, updateNote, deleteNote };
