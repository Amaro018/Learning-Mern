import { InferSchemaType, model, Schema } from "mongoose";

const notesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

}, { timestamps: true });

type Note = InferSchemaType<typeof notesSchema>

export default model<Note>("Note", notesSchema);