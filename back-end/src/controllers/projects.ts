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
        const authenticatedUserId = req.session.userId;
        assertIsDefined(authenticatedUserId);

        const { projectId } = req.params;
        const { title, description, materials } = req.body;
        const files = req.files as Express.Multer.File[] | undefined;

        console.log("Received update request for project:", projectId);
        console.log("Received files:", files);

        // Validate ObjectId
        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project ID");
        }

        // Fetch project
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        // Check user authorization
        if (!project.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You do not have permission to update this project");
        }

        // Update title and description
        if (title) project.title = title;
        if (description) project.description = description;

        // Update materials
        if (materials !== undefined) {
            try {
                project.materials = typeof materials === "string" ? JSON.parse(materials) : materials;
                project.markModified("materials");
            } catch (error) {
                next(error);
            }
        }

        // Append new images instead of replacing
        if (files && files.length > 0) {
            const imageUrls = files.map(file => file.path);
            project.images = [...project.images, ...imageUrls];
            project.markModified("images");
        }

        console.log("Final Project Data Before Save:", project);

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);
    } catch (error) {
        next(error);
    }
};



export const deleteProject: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { projectId } = req.params;
    try {
        assertIsDefined(authenticatedUserId);
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
