"use client";
import Image from "next/image";
import { Project as ProjectModel } from "../models/project";
import * as ProjectsApi from "../network/notes_api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ProjectPage() {
  const [projects, setProjects] = useState<ProjectModel[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await ProjectsApi.fetchProjects();
        setProjects(data as ProjectModel[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    loadProjects();
  }, []);


  return (
<>

<div className="flex flex-wrap gap-4 p-4 justify-center">
      {projects.map((project) =>
        project.images?.map((image, index) => (
          <motion.div
            key={`${project._id}-${index}`}
            className="relative w-full h-auto overflow-hidden rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ amount: 0.2 }}
          >
            {/* Image */}
            <div className="relative group">
              <Image
                src={image.toString()}
                alt={`${project.title} - Image ${index + 1}`}
                width={500}
                height={500}
                className="w-full h-auto rounded-lg transition-all duration-300 group-hover:brightness-50 cursor-pointer"
              />

              {/* Project Title Overlay (Hidden by Default) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col items-center">
                <p className="text-white text-4xl font-bold bg-opacity-50 px-4 py-2 rounded-lg">
                  {project.title}
                </p>
                <p className="text-white text-xs bg-opacity-50 px-4 py-2 rounded-lg">
                  view project
                </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
</>

  );
}
