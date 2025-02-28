"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getProject } from "../../network/notes_api";
import { Project } from "../../models/project";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        if (!id) return;
        const data = await getProject(id as string);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!project) return <p className="text-center mt-10">Project not found.</p>;

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-4">
          {project.images?.map((image, index) => (
            <Image
              key={index}
              src={image.toString()}
              alt={`Project Image ${index + 1}`}
              width={600}
              height={400}
              className="rounded-lg"
            />
          ))}
        </div>
        <p className="mt-4 text-lg">{project.description}</p>
      </div>
    </>
  );
}
