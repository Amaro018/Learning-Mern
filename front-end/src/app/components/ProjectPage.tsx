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
        <div className="px-24 py-8 bg-stone-300">
            <h1>Project Page</h1>
            {projects.map((project) => (
                <div key={project._id}>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <div className="relative w-[600px] h-[800px]">
                    {project.images.map((image, index) => (
                      <Image key={index} src={image} alt="Project Image" width={200} height={300} className="rounded-lg" />
                    ))}
                    </div>
                </div>
            ))}

            {/* <a href="https://ibb.co/TDSvCWzy"><img src="https://i.ibb.co/SD8sLfqS/japan.png" alt="japan" border="0"></a> */}
            {/* <Image 
                src="https://i.ibb.co/SD8sLfqS/japan.png" 
                alt="Profile" 
                width={600} 
                height={800} 
                className="rounded-lg"
            /> */}
        </div>
    );
}
