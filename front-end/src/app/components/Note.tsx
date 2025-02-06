"use client";
import { useState, useEffect } from "react";
import { Note as NoteModel } from "../models/note";
import * as NotesApi from "../network/notes_api";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Define the type for form state
interface NoteForm {
  title: string;
  description: string;
}

export default function Note() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NoteForm>({ title: "", description: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const newNote = await NotesApi.createNote(form);
      setNotes((prevNotes) => [...prevNotes, newNote]); // Update state with new note
      setForm({ title: "", description: "" }); // Reset form fields
      handleClose();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await NotesApi.deleteNote(noteId);
      console.log(noteId)
      setNotes((prevNotes) => prevNotes.filter((note) => note._id.toString() !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await NotesApi.fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    loadNotes();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="p-16">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold text-blue-500">NOTES</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleOpen}
        >
          Add Notes
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {notes.map((note) => (
          <div key={note._id} className="bg-gray-200 p-4 w-1/4">
            <div className="flex flex-row justify-between">
            <h2 className="text-lg font-bold">{note.title}</h2>
            <button onClick={() => handleDelete(note._id.toString())}>
            <DeleteOutlineIcon/>
            </button>
            </div>
            <p>Description: {note.description}</p>
            <p>{formatDate(note.createdAt.toString())}</p>
          </div>
        ))}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p className="text-2xl font-bold uppercase">Add a new notes</p>
            <div className="flex flex-col gap-2">
              <TextField
                required
                id="outlined-required"
                label="Title"
                fullWidth
                name="title"
                value={form.title}
                onChange={handleChange}
              />

              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                fullWidth
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleSubmit}
            >
              Save Note
            </button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
