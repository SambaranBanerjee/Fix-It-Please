import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the problem"],
            trim: true,
        },
        // Mapped to the multi-select dropdown in form
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

// This check is essential in Next.js to prevent "OverwriteModelError" during hot reloads
const Entry = mongoose.models.Entry || mongoose.model("Entry", entrySchema);

export default Entry;