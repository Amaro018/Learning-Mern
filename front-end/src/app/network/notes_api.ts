import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (response.ok) {
        const text = await response.text();
        console.log(text);
        return text ? JSON.parse(text) : null; // Prevents "Unexpected end of JSON input"
    } else {
        try {
            const errorBody = await response.json();
            throw new Error(errorBody.error || "Unknown error");
        } catch {
            throw new Error("Failed to parse error message");
        }
    }
}

//LOGIN & SIGNUP
export interface SignUpCredentials {
    username: string,
    email: string,
    password: string
}

export async function getUser(): Promise<User> {
    const response = await fetchData("/api/users", {method: "GET"});
    return response;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", {method: "POST", body: JSON.stringify(credentials), headers: {"Content-Type": "application/json"}});
    return response;
}

export interface LoginCredentials {
    username: string,
    password: string
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login", {method: "POST", body: JSON.stringify(credentials), headers: {"Content-Type": "application/json"}});
    return response;
}

export async function logout() {
    await fetchData("/api/users/logout", {method: "POST"});
}
//LOGIN & SIGNUP

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
