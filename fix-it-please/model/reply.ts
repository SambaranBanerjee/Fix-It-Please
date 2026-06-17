import mongoose, { Schema, models } from "mongoose";

const ReplySchema = new Schema(
  {
    entryId: {
      type: Schema.Types.ObjectId,
      ref: "Entry",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 2000,
    },

    // Optional: enables replies to other replies later.
    parentReplyId: {
      type: Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ReplySchema.index({ entryId: 1, createdAt: -1 });

const Reply = models.Reply || mongoose.model("Reply", ReplySchema);

export default Reply;