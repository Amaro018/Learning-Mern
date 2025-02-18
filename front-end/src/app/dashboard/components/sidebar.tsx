import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav>
            <ul className="space-y-4">
                <li>
                    <Link href="/" className="flex items-center p-2 hover:bg-gray-700 rounded gap-2">
                        <ArrowBackIcon />
                        Home
                    </Link>
                </li>
                <li>
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded gap-2">
                        <FolderCopyIcon />
                        <span>Projects</span>
                    </div>
                </li>
                <li>
                    <div className="flex items-center p-2 hover:bg-gray-700 rounded gap-2">
                        <AccountCircleIcon />
                        <span>Account Info</span>
                    </div>
                </li>
            </ul>
        </nav>
    </aside>
    );
}