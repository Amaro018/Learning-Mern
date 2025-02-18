"use client"
import Link from "next/link";
import {User} from "../models/user";
import { useEffect, useState } from "react";
import * as notesApi from "../network/notes_api";  
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<User | null>(null);


    
    useEffect(() => {
     async function fetchUser() {
      try {
        const user = await notesApi.getUser();
        setCurrentUser(user);
      } catch (error) {
        
        // Ignore errors when fetching user
        console.log("Ignoring error when fetching user:", error);
      }
     }
     fetchUser();
    }, []);

        // Handle logout
        const handleLogout = async () => {
            try {
                await notesApi.logout(); // Call logout API
                setCurrentUser(null); // Remove user from state
                router.push("/"); // Redirect to home page after logout
            } catch (error) {
                console.error("Error logging out:", error);
            }
        };


    return (
        <div className="bg-stone-200 px-16 py-4 text-stone-600">
            <nav>
                <ul className="flex justify-between items-center">
                    <li className="font-bold text-2xl">
                        Archi Rafael
                    </li>
                    {currentUser ? (
                        <>
                         <div className="flex gap-4 justify-between">
                            <li>
                                <p>
                                    Logged in as: {currentUser.username}
                                </p>
                            </li>
                            <Link href="/dashboard">
                                <li>Dashboard</li>
                            </Link>
                            <li>
                               <button onClick={handleLogout}>
                                    logout
                               </button>
                                
                            </li>
                         </div>
                            
                        </>
                    ) : (
                        <>
                        <div className="flex gap-4 justify-between">
                        <Link href="/signup">
                        <li>Sign up</li>
                        </Link>
                        <Link href={"/login"}>
                        <li>Login</li>
                        </Link>
                        </div>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}
