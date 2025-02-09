import { RequestHandler } from "express";
import NoteModel from "../models/notes";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }    
};

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note ID");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You do not have permission to access this note");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }    
};

interface CreateNoteBody {
    title: string;
    description?: string;
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { title, description } = req.body;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Title is required");
        }

        const newNote = await NoteModel.create({
            title,
            description,
            userId: authenticatedUserId, // Assign userId to the note
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }    
};

interface UpdateNoteParams {
    noteId: string;
}

interface UpdateNoteBody {
    title?: string;
    description?: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { noteId } = req.params;
    const { title, description } = req.body;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note ID");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You do not have permission to update this note");
        }

        if (title !== undefined) note.title = title;
        if (description !== undefined) note.description = description;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }    
};

export const deleteNote: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const { noteId } = req.params;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note ID");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You do not have permission to delete this note");
        }

        await note.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
