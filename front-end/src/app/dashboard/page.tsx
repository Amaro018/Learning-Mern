"use client";
import * as userApi from "../network/notes_api";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Sidebar from "./components/sidebar";
import Projects from "./components/projects";

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await userApi.getUser();
        setCurrentUser(user);
      } catch (error) {
        alert("NO USER LOGGED IN");
        console.error("Error fetching user:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress className="w-10 h-10" />
      </div>
    );

  if (!currentUser) return null; // Prevents UI flicker before redirect

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-10 py-6 overflow-auto  md:ml-0 sm:ml-0 ml-10">
        <Projects />
      </main>
    </div>
  );
}
