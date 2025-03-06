import Sidebar from "../components/sidebar";
import UserPage from "../components/account";
import { UserProvider } from "../../context/UserContext";
export default function Page() {
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-10 py-6 overflow-auto  md:ml-0 sm:ml-0 ml-10 justify-center">
          <UserPage />
        </main>
      </div>
    </UserProvider>
  );
}
