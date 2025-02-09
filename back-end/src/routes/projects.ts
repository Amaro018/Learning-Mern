import express from "express";

import * as projectController from "../controllers/projects";

const router = express.Router();

router.get("/", projectController.getProjects);

router.get("/:projectId", projectController.getProject);

router.post("/", projectController.createProject);

router.patch("/:projectId", projectController.updateProject)

router.delete("/:projectId", projectController.deleteProject)

export default router;