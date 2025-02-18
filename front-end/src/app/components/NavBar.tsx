"use client";
import Link from "next/link";
import { User } from "../models/user";
import { useEffect, useState } from "react";
import * as notesApi from "../network/notes_api";  
import { useRouter } from "next/navigation";
import { IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

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

    // Handle logout
    const handleLogout = async () => {
        try {
            await notesApi.logout();
            setCurrentUser(null);
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="bg-stone-200 px-6 sm:px-12 md:px-16 py-4 text-stone-600">
            <nav className="flex justify-between items-center">
                
                {/* Logo */}
                <div className="text-2xl font-bold">Archi Rafael</div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-6 items-center">
                    {currentUser ? (
                        <>
                            <p>Logged in as: {currentUser.username}</p>
                            <Link href="/" className="hover:text-stone-800">Home</Link>
                            <Link href="/dashboard" className="hover:text-stone-800">Dashboard</Link>
                            <button 
                                onClick={handleLogout} 
                                className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>

                            <Link href="/" className="hover:text-stone-800">Home</Link>
                            <Link href="/login" className="hover:text-stone-800">Login</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <IconButton onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div className="w-60 p-4 flex flex-col gap-3">
                    {currentUser ? (
                        <>
                            <p className="text-lg font-semibold">Logged in as: {currentUser.username}</p>
                            <Link href="/dashboard" className="hover:text-stone-800">Dashboard</Link>
                            <button 
                                onClick={handleLogout} 
                                className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/signup" className="hover:text-stone-800">Sign Up</Link>
                            <Link href="/login" className="hover:text-stone-800">Login</Link>
                        </>
                    )}
                </div>
            </Drawer>
        </div>
    );
}
