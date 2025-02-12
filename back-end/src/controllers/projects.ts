import { RequestHandler } from "express";
import ProjectModel from "../models/projects";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";





export const getProjects: RequestHandler = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default: page 1, 10 results
        const projects = await ProjectModel.find()
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .exec();
        
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};


export const getProject: RequestHandler = async (req, res, next) => {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid note ID");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Note not found");
        }

        if (!project.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You do not have permission to access this note");
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }    
};

interface Material {
    title: string;
    description: string;
    size: string;
    color: string;
    quantity: number;
}
interface CreateProjectBody {
    title: string;
    description?: string;
    userId: string;
    materials?: Material[];
}
export const createProject: RequestHandler<unknown, unknown, CreateProjectBody> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { title, description, materials } = req.body;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Title is required");
        }

        const newProject = await ProjectModel.create({
            title,
            description,
            userId: authenticatedUserId,
            materials
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
    description?: string;
    materials?: Material[];
}

export const updateProject: RequestHandler<UpdateProjectParams, unknown, UpdateProjectBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { projectId } = req.params;
    const { title, description } = req.body;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid note ID");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Note not found");
        }

        if (!project.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You do not have permission to update this note");
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
    const authenticatedUserId = req.session.userId;
    const { projectId } = req.params;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid note ID");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Note not found");
        }

        if (!project.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You do not have permission to delete this note");
        }

        await project.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
