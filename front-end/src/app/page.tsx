
import NavBar from "./components/NavBar";
import ProfilePage from "./components/ProfilePage";
import ProjectPage from "./components/ProjectPage";
// import Note from "./components/Note";


export default function Home() {



  return (
    <div>
      <div className="sticky top-0">
      <NavBar/>
      </div>
      <ProfilePage/>
      <ProjectPage/>
      <footer className="bg-stone-200 text-stone-600 text-center p-4">created by J.Amaro © 2024. All rights reserved.</footer>
    </div>
  );
}
