"use client";
import { createContext, useContext, useEffect, useState } from "react";
import * as notesApi from "../network/notes_api";
import { User } from "../models/user";

interface UserContextType {
  currentUser: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await notesApi.getUser();
        setCurrentUser(user);
      } catch (error) {
        console.log("Ignoring error when fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
