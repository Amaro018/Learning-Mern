"use client";
import { useState } from "react";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import * as notesApi from "../../network/notes_api";
import { useRouter } from "next/navigation";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await notesApi.logout();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside
      className={`bg-gray-900 text-white min-h-screen p-4 flex flex-col fixed md:relative transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 mb-4 hover:bg-gray-700 rounded flex items-center justify-center"
      >
        {isOpen ? (
          <div className="flex items-center gap-2">
            <p>Menu</p>
            <CloseIcon />
          </div>
        ) : (
          <MenuIcon />
        )}
      </button>

      {/* Sidebar Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <Link
              href="/"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <HomeIcon /> {isOpen && <span className="ml-2">Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <FolderIcon /> {isOpen && <span className="ml-2">Projects</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/account"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <AccountCircleIcon />{" "}
              {isOpen && <span className="ml-2">Account</span>}
            </Link>
          </li>
          <li className="flex items-center p-2 hover:bg-gray-700 rounded">
            <button onClick={handleLogout}>
              <ExitToAppRoundedIcon className="transform rotate-180" />
              {isOpen && <span className="ml-2">Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
