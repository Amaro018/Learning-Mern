import Sidebar from "../components/sidebar";
import UserPage from "../components/account";
import { UserProvider } from "../../context/UserContext";

export default function Page() {
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-gray-100">
       
          <Sidebar />
        

        {/* Main Content (Pushes to the right of Sidebar) */}
        <main className="flex-1 px-4 md:px-10 py-6 overflow-auto ml-64">
          <UserPage />
        </main>
      </div>
    </UserProvider>
  );
}
