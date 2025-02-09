import { InferSchemaType, model, Schema } from "mongoose";

const materialsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
});

const projectsSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        materials: [materialsSchema], // Embedding the materials inside projects
    },
    { timestamps: true }
);

type Project = InferSchemaType<typeof projectsSchema>;

export default model<Project>("Projects", projectsSchema);
