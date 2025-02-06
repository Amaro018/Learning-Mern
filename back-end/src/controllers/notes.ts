
import { RequestHandler } from "express";
import NoteModel from "../models/notes";
import createHttpError from "http-errors";
import mongoose, { mongo } from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }    
}

export const getNote: RequestHandler = async (req, res, next) => {

    const noteId = req.params.noteId;

    try {

        if(!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "invalid note id")
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note) {
            throw createHttpError(404, "Note not found");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }    
}

interface CreateNoteBody {
    title: string;
    description?: string;
}


export const createNote: RequestHandler<unknown, unknown, CreateNoteBody> = async (req, res, next) => {

    const title = req.body.title;
    const description = req.body.description;

    try {

        if(!title) {
            throw createHttpError(400, "Title is required");
        }
       const newNote = await NoteModel.create({title: title, description: description});
       res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }    
}

interface UpdateNoteParams {
    noteId: string;
}

interface UpdateNoteBody {
    title?: string;
    description: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {

    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newDescription = req.body.description;

    try {

        if(!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "invalid note id")
        }

        
        if(!newTitle) {
            throw createHttpError(404, "Note must have a title");
        }
        
        const note = await NoteModel.findById(noteId).exec();

        if(!note) {
            throw createHttpError(404, "Note not found");
        }

        note.title = newTitle;
        note.description = newDescription;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }    
}


export const deleteNote: RequestHandler = async (req, res, next) => {

    const noteId = req.params.noteId;

    try {

        if(!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "invalid note id")
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note) {
            throw createHttpError(404, "Note not found");
        }

        await note.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}