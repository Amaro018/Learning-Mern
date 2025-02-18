import { stringify } from "querystring";
import { Note } from "../models/note";
import { Project } from "../models/project";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    console.log(response);
    if (response.ok) {
        return response;

    } else {
        const errorBody = await response.json();
        const errorMessage = new Error(errorBody.error);
        throw errorMessage;
        
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
    return response.json();
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", {method: "POST", body: JSON.stringify(credentials), headers: {"Content-Type": "application/json"}});
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(credentials)});
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", {method: "POST"});
}
//LOGIN & SIGNUP

export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData("/api/notes", {method: "GET"});
    return response.json();
}


export interface NoteInput {
    title: string,
    description?: string,
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("/api/notes", {method: "POST", body: JSON.stringify(note), headers: {"Content-Type": "application/json"}});
    return response.json();
}


export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await fetchData(`/api/notes/${noteId}`, {method: "PATCH", body: JSON.stringify(note), headers: {"Content-Type": "application/json"}});
    return response.json();
}

export async function deleteNote(noteId: string){
    await fetchData(`/api/notes/${noteId}`, {method: "DELETE"});
}


export async function fetchProjects(): Promise<Project[]> {
    const response = await fetchData("/api/projects", {method: "GET"});
    return response.json();
}





export const createProject = async (formData: FormData) => {
    try {
        console.log("📤 Sending FormData:", Object.fromEntries(formData.entries())); // Debug what is being sent

        const response = await fetch("/api/projects", {
            method: "POST",
            body: formData,
        });


        const data = await response.json();
        console.log("📥 Received data:", data);
        if (!response.ok) {
            throw new Error(data.message || "Failed to create project");
        }

        return data;
    } catch (error) {
        console.error("❌ Error creating project:", error);
        throw error;
    }
};
