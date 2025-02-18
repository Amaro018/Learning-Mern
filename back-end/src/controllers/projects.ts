import { RequestHandler } from "express";
import ProjectModel from "../models/projects";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import env from "../util/validateEnv";
type MulterFile = Express.Multer.File;

cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_KEY,
    api_secret: env.CLOUD_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "projects",
            format: file.mimetype.split("/")[1],
            public_id: file.originalname.split(".")[0]
        };
    }
});

const upload = multer({ storage });

export const getProjects: RequestHandler = async (req, res, next) => {
    try {
        const projects = await ProjectModel.find().exec();
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }    
};

export const getProject: RequestHandler = async (req, res, next) => {
    const { projectId } = req.params;
    
    try {
        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project ID");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }    
};

interface Material {
    name: string;
    images: string[];
    description: string;
    size: string;
    color: string;
    quantity: number;
}


// export const createProject: RequestHandler<unknown, unknown, CreateProjectBody> = async (req, res, next) => {
//     try {
//         assertIsDefined(req.session.userId);
//         const { title, description, materials } = req.body;
//         const files = req.files as MulterFile[];
//         const imageUrls = files ? files.map(file => file.path) : [];

//         if (!title) {
//             throw createHttpError(400, "Title is required");
//         }

//         const newProject = await ProjectModel.create({
//             title,
//             description,
//             images: imageUrls,
//             userId: req.session.userId,
//             materials
//         });

//         res.status(201).json(newProject);
//     } catch (error) {
//         next(error);
//     }
// };

interface CreateProjectBody {
    title: string;
    description?: string;
    images?: string[];
    materials?: Material[];
}

export const createProject: RequestHandler<unknown, unknown, CreateProjectBody> = async (req, res, next) => {
    console.log('Received body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);

    try {
        assertIsDefined(req.session.userId);
        const files = req.files as MulterFile[];
        const { title, description, materials } = req.body;
        console.log("Received body:", req.body);

        if (!title) {
            throw createHttpError(400, "Title is required");
        }

        const parsedMaterials = typeof materials === "string" ? JSON.parse(materials) : materials;
        const imageUrls = files ? files.map(file => (file as any).path) : [];

        const newProject = await ProjectModel.create({
            title,
            description,
            images: imageUrls,
            userId: req.session.userId,
            materials: parsedMaterials,
        });

        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
};




interface UpdateProjectParams {
    projectId: string;
}

interface UpdateProjectBody {
    title?: string;
    images?: string[];
    description?: string;
    materials?: Material[];
}

export const updateProject: RequestHandler<UpdateProjectParams, unknown, UpdateProjectBody, unknown> = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const { projectId } = req.params;
        const { title, description } = req.body;

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project ID");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!project.userId.equals(req.session.userId)) {
            throw createHttpError(403, "Unauthorized");
        }

        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);
    } catch (error) {
        next(error);
    }    
};

export const deleteProject: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const { projectId } = req.params;

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project ID");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!project.userId.equals(req.session.userId)) {
            throw createHttpError(403, "Unauthorized");
        }

        await project.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
