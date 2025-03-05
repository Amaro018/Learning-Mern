"use client";
import Image from "next/image";
import { Project as ProjectModel } from "../../models/project";
import * as ProjectsApi from "../../network/notes_api";
import { useEffect, useState } from "react";
import { Box, Modal, Typography, TextField } from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "sonner";
import { motion } from "framer-motion";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function Projects() {
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      projectId: "",
      title: "",
      description: "",
      materials: [
        { name: "", description: "", size: "", color: "", quantity: 1 },
      ],
      images: [],
    });
    setImages([]);
    setPreviews([]);
  };

  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    materials: [
      { name: "", description: "", size: "", color: "", quantity: 1 },
    ],
    images: [],
  });

  const handleOpen = (project?: ProjectModel) => {
    if (project) {
      setEditingProjectId(project._id);
      setForm({
        projectId: project._id,
        title: project.title,
        description: project.description || "",
        materials: project.materials || [
          { name: "", description: "", size: "", color: "", quantity: 1 },
        ],
        images: [],
      });
      setImages(project.images ?? []);
      setPreviews((project.images ?? []).map((img) => img.toString()));
    } else {
      setEditingProjectId(null);
      resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = event.target;
    if (index === undefined) {
      setForm({ ...form, [name]: value });
    } else {
      const updatedMaterials = [...form.materials];
      updatedMaterials[index] = { ...updatedMaterials[index], [name]: value };
      setForm({ ...form, materials: updatedMaterials });
    }
  };

  const handleAddMaterial = () => {
    setForm({
      ...form,
      materials: [
        ...form.materials,
        { name: "", description: "", size: "", color: "", quantity: 1 },
      ],
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages([...images, ...fileArray]);
      setPreviews([
        ...previews,
        ...fileArray.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleCreateProject = async () => {
    try {
      if (editingProjectId) {
        const response = await ProjectsApi.updateProject(
          editingProjectId,
          form,
          images
        );
        setProjects(
          projects.map((project) =>
            project._id === editingProjectId ? response : project
          )
        );
        toast.success("successfully updated project!");
      } else {
        const response = await ProjectsApi.createProject(form, images);
        toast.success("successfully added to projects!");
        setProjects([...projects, response]);
      }
      handleClose();
      resetForm();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    toast(
      <div className="flex flex-col items-center justify-center w-full">
        <strong className="text-center">
          Are you sure you want to delete this project?
        </strong>
        <p className="text-center">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              try {
                await ProjectsApi.deleteProject(projectId);
                setProjects((prevProjects) =>
                  prevProjects.filter((project) => project._id !== projectId)
                );
                toast.dismiss(); // Close the toast after action
                toast.success("Project successfully deleted!");
              } catch (error) {
                console.error("Failed to delete project:", error);
                toast.error("Failed to delete project. Please try again.");
              }
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-red-500 py-2 px-4 rounded font-bold text-white"
          >
            No
          </button>
        </div>
      </div>,
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        duration: 5000,
        position: "top-right", // Moves it to the center of the screen
      }
    );
  };

  /*************  ✨ Codeium Command 🌟  *************/
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
  /******  0da13c61-e77c-4294-ba02-a56f8672c51b  *******/

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">List of Projects</h1>
        <button
          className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleOpen()}
        >
          Add Project
        </button>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center ml-8 sm:ml-0">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, scale: 0.9 }} // Animation on load
            animate={{ opacity: 1, scale: 1 }} // Animation when visible
            whileHover={{ scale: 1.05 }} // Scale on hover
            transition={{ duration: 0.3 }} // Smooth transition
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="flex justify-end p-2">
              <button
                className="p-1 hover:scale-110 transition-transform"
                onClick={() => handleOpen(project)}
              >
                <EditIcon sx={{ color: "green" }} />
              </button>
              <button
                className="p-1 hover:scale-110 transition-transform"
                onClick={() => handleDeleteProject(project._id)}
              >
                <DeleteForever sx={{ color: "red" }} />
              </button>
            </div>

            <Image
              src={project.images?.[0]?.toString() || "/placeholder.png"}
              alt={project.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold">{project.title}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: 2 }}
          >
            {editingProjectId ? "Edit Project" : "Add New Project"}
          </Typography>
          <TextField
            required
            label="Project Title"
            fullWidth
            name="title"
            value={form.title}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            required
            label="Project Description"
            fullWidth
            name="description"
            value={form.description}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />

          {/* Materials Input */}
          {form.materials.map((material, index) => (
            <div key={index} className="mb-4">
              <Typography variant="subtitle1">Material {index + 1}</Typography>
              <TextField
                label="Name"
                fullWidth
                name="name"
                value={material.name}
                onChange={(e) => handleFormChange(e, index)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="description"
                fullWidth
                name="description"
                value={material.description}
                onChange={(e) => handleFormChange(e, index)}
                sx={{ marginBottom: 2 }}
              />
              <div className="flex flex-row gap-2">
                <TextField
                  label="size"
                  fullWidth
                  name="size"
                  value={material.size}
                  onChange={(e) => handleFormChange(e, index)}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="color"
                  fullWidth
                  name="color"
                  value={material.color}
                  onChange={(e) => handleFormChange(e, index)}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  type="number"
                  label="quantity"
                  fullWidth
                  name="quantity"
                  value={material.quantity}
                  onChange={(e) => handleFormChange(e, index)}
                  sx={{ marginBottom: 2 }}
                />
              </div>
            </div>
          ))}
          <button
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
            onClick={handleAddMaterial}
          >
            Add Material
          </button>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-4"
          />
          {/* Image Preview */}
          <div className="flex gap-2 mt-4">
            {previews.slice(0, 5).map((src, index) => (
              <div key={index} className="w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={src}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {previews.length > 5 && (
              <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-lg text-xl font-bold">
                +{previews.length - 5}
              </div>
            )}
          </div>
          {/* Save Button */}
          <button
            className="bg-stone-500 hover:bg-stone-700 text-white py-2 px-4 rounded mt-4"
            onClick={handleCreateProject}
          >
            {editingProjectId ? "Update Project" : "Save Project"}
          </button>
        </Box>
      </Modal>
    </div>
  );
}
