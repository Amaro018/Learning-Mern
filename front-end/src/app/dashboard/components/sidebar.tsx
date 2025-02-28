"use client";
import Link from "next/link";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white min-h-screen p-5 transition-all duration-300 flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 mb-4 hover:bg-gray-700 rounded w-full flex items-center gap-2"
      >
        <MenuIcon />
        {isOpen && <span>Menu</span>}
      </button>

      {/* Sidebar Navigation */}
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/"
              className="flex items-center p-2 hover:bg-gray-700 rounded gap-2"
            >
              <ArrowBackIcon />
              {isOpen && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="flex items-center p-2 hover:bg-gray-700 rounded gap-2"
            >
              <FolderCopyIcon />
              {isOpen && <span>Projects</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              className="flex items-center p-2 hover:bg-gray-700 rounded gap-2"
            >
              <AccountCircleIcon />
              {isOpen && <span>Account Info</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
