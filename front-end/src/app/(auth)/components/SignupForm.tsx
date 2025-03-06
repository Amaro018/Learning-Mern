"use client";
import { useState } from "react";
import { SignUpCredentials } from "../../network/notes_api";
import * as NotesApi from "../../network/notes_api";
import { TextField } from "@mui/material";
import NavBar from "@/app/components/NavBar";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [form, setForm] = useState<SignUpCredentials>({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Signing up with form:", form);
      const newUser = await NotesApi.signUp(form);
      console.log("User signed up successfully:", newUser);
      router.push("/");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-stone-300 min-h-screen px-4">
      <div className="absolute top-0 w-full">
      <NavBar />
      </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-stone-200 p-6 rounded-lg w-full max-w-md sm:w-1/3">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>

          <TextField
            label="Username"
            fullWidth
            name="username"
            value={form.username}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Email"
            fullWidth
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button type="submit" className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded w-full">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}
