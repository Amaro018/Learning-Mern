"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getProject } from "../../network/notes_api";
import { Project } from "../../models/project";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (!project)
    return <p className="text-center mt-10 text-lg">Project not found.</p>;

  const images = project.images || [];
  const selectedImage = images[selectedImageIndex];

  // Handle Next & Previous Image Navigation
  const handleNext = () =>
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className=" mx-auto p-6    w-full">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        {project.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Carousel Section */}
        <div className="relative w-full h-[1000px] rounded-lg shadow-md overflow-hidden">
          {/* Main Image Display */}
          {selectedImage && (
            <div className="relative rounded-lg shadow-md overflow-hidden">
              <Image
                src={selectedImage.toString()}
                alt="Main Project Image"
                width={600}
                height={400}
                className="rounded-lg object-cover w-full h-auto"
              />

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
                    <div className="flex justify-between">
                      <IconButton
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full"
                      >
                        <ArrowBackIosIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full"
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Thumbnail Images */}
          <Box mt={4} className="flex gap-2 justify-center flex-wrap">
            {images.map((image, index) => (
              <Image
                key={index}
                src={image.toString()}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={75}
                className={`rounded-md cursor-pointer border-2 ${
                  selectedImageIndex === index
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </Box>
        </div>

        {/* Project Details Section */}
        <div className="md:w-1/2 w-full space-y-6">
          {/* Description */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Description
            </h2>
            <p className="text-lg text-gray-600">{project.description}</p>
          </div>

          {/* Materials List */}
          {project.materials && project.materials.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                Materials Used
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
                {project.materials.map((material, index) => (
                  <li key={index} className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {material.name}
                    </span>
                    <span className="text-gray-500">
                      Color: {material.color} | Size: {material.size} | Qty:{" "}
                      {material.quantity}
                    </span>
                    <span className="italic text-gray-500">
                      {material.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
