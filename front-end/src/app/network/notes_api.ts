import { Note } from "../models/note";
import { Material, Project } from "../models/project";
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
  username: string;
  email: string;
  password: string;
}

export async function getUser(): Promise<User> {
  const response = await fetchData("/api/users", { method: "GET" });
  return response.json();
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  await fetchData("/api/users/logout", { method: "POST" });
}
//LOGIN & SIGNUP

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("/api/notes", { method: "GET" });
  return response.json();
}

export interface NoteInput {
  title: string;
  description?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData("/api/notes", {
    method: "POST",
    body: JSON.stringify(note),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await fetchData(`/api/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(note),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export async function deleteNote(noteId: string) {
  await fetchData(`/api/notes/${noteId}`, { method: "DELETE" });
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetchData("/api/projects", { method: "GET" });
  return response.json();
}

// export async function createProject(project: ProjectInput, images: File[]): Promise<Project> {
//     console.log("Creating project with form:", project);
//     console.log("sending Images:", images);
//     const formData = new FormData();

//     // Append text fields

//     formData.append("title", project.title);
//     if (project.description) formData.append("description", project.description);
//     if (project.materials) formData.append("materials", JSON.stringify(project.materials));

//     // Append images
//     images.forEach((image) => formData.append("images", image));

//     // Make API call
//     const response = await fetchData("/api/projects", {
//         method: "POST",
//         body: formData, // Use FormData
//     });

//     if (!response.ok) throw new Error("Failed to create project");

//     return response.json();
// }

export interface ProjectInput {
  title: string;
  images: File[];
  description?: string;
  materials?: Material[];
}
export const createProject = async (form: ProjectInput, images: File[]) => {
  const formData = new FormData();

  // Append text fields
  formData.append("title", form.title);
  if (form.description) formData.append("description", form.description);
  if (form.materials)
    formData.append("materials", JSON.stringify(form.materials));

  // Append images
  images.forEach((image) => formData.append("images", image));

  try {
    const response = await fetchData("/api/projects", {
      method: "POST",
      body: formData,
      credentials: "include", // To send cookies/session
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export async function deleteProject(projectId: string) {
  await fetchData(`/api/projects/${projectId}`, { method: "DELETE" });
}

// frontend/api/updateProject.ts

// export async function updateProject(projectId: string, form: ProjectInput, images: File[]): Promise<Project> {

//     console.log("Updating project with form:", form);

//     const formData = new FormData();
//     // Append text fields
//     formData.append("title", form.title);
//     if (form.description) formData.append("description", form.description);
//     if (form.materials) formData.append("materials", JSON.stringify(form.materials));

//     // Append images
//     images.forEach((image) => formData.append("images", image));

//     // if (form.materials) formData.append("materials", JSON.stringify(form.materials));

//     // // Append new images if they are files
//     // form.images.forEach((image) => {
//     //     if (image instanceof File) {
//     //         formData.append("files", image);
//     //     }
//     // });

//     // // Append existing image URLs separately (backend should handle this properly)
//     // const existingImages = form.images.filter(img => !(img instanceof File));
//     // if (existingImages.length > 0) {
//     //     formData.append("existingImages", JSON.stringify(existingImages));
//     // }

//     // // ✅ Correctly log FormData contents
//     // console.log("FormData contents:");
//     // for (const [key, value] of formData.entries()) {
//     //     console.log(key, value);
//     // }

//     // await fetchData(`/api/notes/${noteId}`, {method: "PATCH", body: JSON.stringify(note), headers: {"Content-Type": "application/json"}})

//     const response = await fetchData(`/api/projects/${projectId}`, {
//         method: "PATCH",
//         body: formData,
//         headers: {"Content-Type": "multipart/form-data"},
//         credentials: "include",
//     });

//     if (!response.ok) {
//         throw new Error(`Failed to update project: ${response.statusText}`);
//     }

//     console.log("Project updated successfully");
//     return await response.json();
// }
export async function updateProject(
  projectId: string,
  form: ProjectInput,
  images: File[]
): Promise<Project> {
  const formData = new FormData();

  // Append form fields (handle objects properly)
  Object.entries(form).forEach(([key, value]) => {
    formData.append(
      key,
      typeof value === "object" ? JSON.stringify(value) : (value as string)
    );
  });

  // Append images
  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: formData, // Browser auto-sets headers
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.statusText}`);
  }

  console.log("Project updated successfully");
  return await response.json();
}

export async function getProject(projectId: string): Promise<Project> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.statusText}`);
  }

  return await response.json();
}
