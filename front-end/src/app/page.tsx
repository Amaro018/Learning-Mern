import NavBar from "./components/NavBar";
import ProfilePage from "./components/ProfilePage";
import ProjectPage from "./components/ProjectPage";
import { UserProvider } from "./context/UserContext";

export default function Home() {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen bg-stone-300">
        {/* Navbar - Always Fixed */}
        <div className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
          <NavBar />
        </div>

        {/* Main Content Wrapper (Adjusts for Navbar Height) */}
        <div className="flex flex-col md:flex-row flex-1 pt-16">
          {/* Profile Section - Sticky on Desktop */}
          <aside className="w-full md:w-1/3 md:sticky md:top-16 h-auto md:h-screen overflow-hidden shadow-md p-4 bg-slate-300">
            <ProfilePage />
          </aside>

          {/* Projects Section - Scrollable */}
          <main className="w-full md:w-2/3 h-screen overflow-y-auto p-4">
            <ProjectPage />
          </main>
        </div>

        {/* Footer - Always at the bottom */}
        <footer className="bg-slate-800 text-white text-center w-full p-4 mt-auto">
          created by J.Amaro © 2024. All rights reserved.
        </footer>
      </div>
    </UserProvider>
  );
}
