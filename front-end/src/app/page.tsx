import NavBar from "./components/NavBar";
import ProfilePage from "./components/ProfilePage";
import ProjectPage from "./components/ProjectPage";
import { UserProvider } from "./context/UserContext";
export default function Home() {
  return (
    <UserProvider>
      <div className="h-[calc(100vh-64px)] flex flex-col">
        {/* Navbar - Always Sticky */}
        <div className="sticky top-0 z-50 w-full">
          <NavBar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col md:flex-row ">
          {/* Profile Section - Sticky on Desktop, Not on Mobile */}
          <div className="w-full md:w-1/3 h-auto md:h-screen md:sticky md:top-0 overflow-hidden shadow-md">
            <ProfilePage />
          </div>

          {/* Projects Section - Scrolls Independently */}
          <div className="w-full md:w-2/3 h-screen overflow-y-auto p-4">
            <ProjectPage />
          </div>
        </div>

        {/* Footer (Optional) */}
        <footer className="bg-slate-800 text-white text-center p-4">
          created by J.Amaro © 2024. All rights reserved.
        </footer>
      </div>
    </UserProvider>
  );
}
