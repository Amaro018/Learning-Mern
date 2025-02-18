"use client"
import Image from "next/image";
import {Project as ProjectModel} from "../models/project";
import * as ProjectsApi from "../network/notes_api";
import { useEffect, useState } from "react";

export default function ProjectPage() {
      const [projects, setProjects] = useState<ProjectModel[]>([]);


        useEffect(() => {
          async function loadProjects() {
            try {
              const data = await ProjectsApi.fetchProjects();
              setProjects(data as ProjectModel[]);
            } catch (error) {
              console.error("Error fetching notes:", error);
            }
          }
          loadProjects();
        }, []);


    return (
<div className="py-8 bg-stone-300">
  <h1 className="text-2xl font-bold text-center">List of my Projects</h1>
  <div className="flex flex-wrap justify-center gap-4 py-8">
    {projects.map((project) => (
      <div
        key={project._id}
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col items-center rounded-lg overflow-hidden shadow-md bg-white cursor-pointer transition-transform hover:scale-105"
      >
        <div className="w-full h-64 relative">
          <Image
            src={project.images[0]?.toString()}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
        <div className="p-4 bg-white w-full text-center">
          <h2 className="text-lg font-semibold">{project.title}</h2>
        </div>
      </div>
    ))}
  </div>
</div>

    );
}
