"use client"
import React, { useState } from "react";
import * as NotesApi from "../../network/notes_api";
import { LoginCredentials } from "../../network/notes_api";

export default function LoginForm() {
  const [form, setForm] = useState<LoginCredentials>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await NotesApi.login(form);
      console.log("User logged in successfully:", user);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>
        Username:
        <input type="text" name="username" value={form.username} onChange={handleChange} required />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </label>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
