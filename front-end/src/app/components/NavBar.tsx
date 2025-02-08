"use client"
import Link from "next/link";
import {User} from "../models/user";
import { useEffect, useState } from "react";
import * as notesApi from "../network/notes_api";  
import router from "next/router";

export default function NavBar() {

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    useEffect(() => {
     async function fetchUser() {
      try {
        const user = await notesApi.getUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
     }
     fetchUser();
    }, []);

        // Handle logout
        const handleLogout = async () => {
            try {
                await notesApi.logout(); // Call logout API
                setCurrentUser(null); // Remove user from state
                // router.push("/"); // Redirect to home page after logout
            } catch (error) {
                console.error("Error logging out:", error);
            }
        };


    return (
        <div>
            <nav>
                <ul>
                    <li>
                        logo
                    </li>
                    {currentUser ? (
                        <>
                            <li>
                                <p>
                                    Logged in as: {currentUser.username}
                                </p>
                            </li>
                            <li>
                               <button onClick={handleLogout}>
                                    logout
                               </button>
                                
                            </li>
                        </>
                    ) : (
                        <>
                        <Link href="/signup">
                        <li>Sign up</li>
                        </Link>
                        <Link href={"/login"}>
                        <li>Login</li>
                        </Link>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}
