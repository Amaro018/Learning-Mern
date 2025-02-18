"use client";
import { useState } from "react";
import { SignUpCredentials } from "../../network/notes_api";
import * as NotesApi from "../../network/notes_api";


export default function SignUpForm() {
    const [form, setForm] = useState<SignUpCredentials>({ username: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Signing up with form:", form);
            const newUser = await NotesApi.signUp(form);
            console.log("User signed up successfully:", newUser);
            // const user: User = await NotesApi.signUp(form);
            // console.log("User signed up successfully:", user);
        } catch (error) {
            console.error("Error signing up:", error);
            setError("Error signing up. Please try again.");
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}
