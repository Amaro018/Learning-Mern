import { InferSchemaType, model, Schema } from "mongoose";

const projectsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, { timestamps: true });

type Project = InferSchemaType<typeof projectsSchema>

export default model<Project>("Projects", projectsSchema);