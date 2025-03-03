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
  api_secret: env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "projects",
      format: file.mimetype.split("/")[1],
      public_id: file.originalname.split(".")[0],
    };
  },
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

export const createProject: RequestHandler<
  unknown,
  unknown,
  CreateProjectBody
> = async (req, res, next) => {
  console.log("Received bodyss:", req.body);
  console.log("Content-Typssse:", req.headers["content-type"]);

  try {
    assertIsDefined(req.userId);
    const files = req.files as MulterFile[];
    const { title, description, materials } = req.body;
    console.log("Received body:", req.body);
    console.log("Received files:", files);

    if (!title) {
      throw createHttpError(400, "Title is required");
    }

    const parsedMaterials =
      typeof materials === "string" ? JSON.parse(materials) : materials;
    const imageUrls = files ? files.map((file) => (file as any).path) : [];

    const newProject = await ProjectModel.create({
      title,
      description,
      images: imageUrls,
      userId: req.userId,
      materials: parsedMaterials,
    });

    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
};

interface UpdateProjectBody {
  projectId?: string;
  title?: string;
  description?: string;
  images?: string[];
  materials?: string | string[];
}

// ✅ FIX: Use correct types in `RequestHandler`
export const updateProject: RequestHandler<
  unknown,
  unknown,
  UpdateProjectBody
> = async (req, res, next) => {
  console.log("Received body:", req.body);
  const { projectId } = req.body;
  const authenticatedUserId = req.userId;
  try {
    assertIsDefined(authenticatedUserId);
    const project = await ProjectModel.findById(projectId).exec();
    if (!project) {
      throw createHttpError(404, "Project not found");
    }

    const { title, description, materials } = req.body;
    const images = (req.files as Express.Multer.File[]) || [];

    if (!title || !description) {
      throw createHttpError(400, "Title and description are required");
    }

    project.title = title;
    project.description = description;

    if (materials) {
      const parsedMaterials =
        typeof materials === "string" ? JSON.parse(materials) : materials;
      project.materials = parsedMaterials;
    }

    if (images.length > 0) {
      const imageUrls = images.map((image) => image.path);
      project.images = imageUrls;
    }

    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.userId;
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

    if (!project.userId.equals(req.userId)) {
      throw createHttpError(403, "Unauthorized");
    }

    await project.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
