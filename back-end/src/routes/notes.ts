import express from "express";

import * as noteController from "../controllers/notes";

const router = express.Router();

router.get("/", noteController.getNotes);

router.get("/:noteId", noteController.getNote);

router.post("/", noteController.createNote);

router.patch("/:noteId", noteController.updateNote)

router.delete("/:noteId", noteController.deleteNote)

export default router;