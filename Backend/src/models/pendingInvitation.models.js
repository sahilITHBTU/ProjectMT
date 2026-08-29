import mongoose, { Schema } from "mongoose";


const PendingInvitationSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      default: "member",
    },

    invitationToken: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

PendingInvitationSchema.index({ project: 1, email: 1 }, { unique: true });

PendingInvitationSchema.index({ invitationToken: 1 }, { unique: true });

PendingInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingInvitationModel = mongoose.model(
  "pendinginvitation",
  PendingInvitationSchema,
);

export { PendingInvitationModel };
