import mongoose, { Schema } from "mongoose";

const NoteSchema = new mongoose.Schema({
 project:{
    type:Schema.Types.ObjectId,
    ref:"project",
    required:true
 },
 createdBy:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true,
 },
 content:{
    type:String,
    required:true,
 }
},)

const NoteModel = mongoose.model("note",NoteSchema)
export {NoteModel}