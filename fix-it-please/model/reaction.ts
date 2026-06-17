import mongoose, { Schema, models } from "mongoose";

const ReactionSchema = new Schema(
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

    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can have only one reaction per entry.
ReactionSchema.index(
  { entryId: 1, userId: 1 },
  { unique: true }
);

const Reaction =
  models.Reaction || mongoose.model("Reaction", ReactionSchema);

export default Reaction;