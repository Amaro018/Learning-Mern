// import express from "express";

// import * as projectController from "../controllers/projects";

// const router = express.Router();

// router.get("/", projectController.getProjects);

// router.get("/:projectId", projectController.getProject);

// router.post("/", projectController.createProject);

// router.patch("/:projectId", projectController.updateProject)

// router.delete("/:projectId", projectController.deleteProject)

// export default router;
import express from "express";
import * as projectController from "../controllers/projects";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", projectController.getProjects);
router.get("/:projectId", projectController.getProject);

// Handle multiple image uploads
router.post("/", upload.array("images", 10), projectController.createProject);

router.patch("/:projectId", upload.array("images", 10), projectController.updateProject);

router.delete("/:projectId", projectController.deleteProject);

export default router;
