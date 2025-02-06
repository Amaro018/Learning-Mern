import { Note } from "../models/note";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (response.ok) {
        const text = await response.text();
        return text ? JSON.parse(text) : null; // Prevents "Unexpected end of JSON input"
    } else {
        try {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Unknown error");
        } catch {
            throw new Error("Failed to parse error response");
        }
    }
}


export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData("/api/notes", {method: "GET"});
    return response;
}


export interface NoteInput {
    title: string,
    description?: string,
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("/api/notes", {method: "POST", body: JSON.stringify(note), headers: {"Content-Type": "application/json"}});
    return response;
}


export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await fetchData(`/api/notes/${noteId}`, {method: "PATCH", body: JSON.stringify(note), headers: {"Content-Type": "application/json"}});
    return response;
}

export async function deleteNote(noteId: string){
    await fetchData(`/api/notes/${noteId}`, {method: "DELETE"});
}
