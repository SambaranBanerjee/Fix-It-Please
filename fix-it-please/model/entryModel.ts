import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the problem"],
            trim: true,
        },
        type: {
            type: [String], 
            required: [true, "Please select at least one language or bug type"],
            default: []
        },
        solution: {
            type: String,
            required: [true, "Please provide the solution or code snippet"],
        }
    },
    {
        timestamps: true, 
    }
);

const Entry = mongoose.models.Entry || mongoose.model("Entry", entrySchema);

export default Entry;