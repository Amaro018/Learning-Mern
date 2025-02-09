import { InferSchemaType, model, Schema } from "mongoose";

const materialsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    size: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    }
}, { timestamps: true });

type Materials = InferSchemaType<typeof materialsSchema>

export default model<Materials>("Projects", materialsSchema);