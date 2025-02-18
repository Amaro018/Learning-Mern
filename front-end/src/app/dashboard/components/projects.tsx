"use client";
import Image from "next/image";
import { Project as ProjectModel } from "../../models/project";
import * as ProjectsApi from "../../network/notes_api";
import { useEffect, useState } from "react";
import { Box, Modal, Typography, TextField } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function Projects() {
    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        materials: [{ name: "", description: "", size: "", color: "", quantity: 0 }],
        images: []
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Handle input changes for form fields
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
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
        { name: "", description: "", size: "", color: "", quantity: 0 },
      ],
    });
  };
    // Handle image selection and preview
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setImages([...images, ...fileArray]); // Store selected images
            setPreviews([...previews, ...fileArray.map(file => URL.createObjectURL(file))]); // Generate previews
        }
    };

    // Function to create a new project with images
    const handleCreateProject = async () => {
      const formData = new FormData();
      formData.append("title", form.title);
      if (form.description) formData.append("description", form.description);
      if (form.materials) formData.append("materials", JSON.stringify(form.materials));

      images.forEach((image) => {
          formData.append("images", image);
      });

      console.log(form, images)

      try {
          const response = await ProjectsApi.createProject(form, images);
          console.log("Project created successfully:", response);
          handleClose();
          setProjects([...projects, response]);
          setForm({
              title: "",
              description: "",
              materials: [{ name: "", description: "", size: "", color: "", quantity: 0 }],
              images: []
          })
      } catch (error) {
          console.error("Failed to create project:", error);
      }
    };

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
            <div className="flex flex-col">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold mb-4">List of Projects</h1>
                    <button className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded" onClick={handleOpen}>
                        Add Project
                    </button>
                </div>
              <div className="flex flex-wrap py-4">
                {/* Project List */}
                {projects.map(project => (
                    <div key={project._id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 h-full">
                            <Image src={project.images[0] ? project.images[0].toString() : ""} alt={project.title} width={400} height={300} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Add Project Modal */}
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" sx={{ overflowY: "scroll", height: "100vh" }}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                        Adding New Project
                    </Typography>
                    <TextField required label="Project Title" fullWidth name="title" value={form.title} onChange={handleFormChange} sx={{ marginBottom: 2 }} />
                    <TextField required label="Project Description" fullWidth name="description" value={form.description} onChange={handleFormChange} sx={{ marginBottom: 2 }} />
                      {/* Dynamically Render Materials Input Fields */}
        {form.materials.map((material, index) => (
          <div key={index}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Material {index + 1}
            </Typography>
            <TextField
              label="Material Title"
              fullWidth
              name="name"
              value={material.name}
              onChange={(e) => handleFormChange(e, index)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Material Description"
              fullWidth
              name="description"
              value={material.description}
              onChange={(e) => handleFormChange(e, index)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Material Size"
              fullWidth
              name="size"
              value={material.size}
              onChange={(e) => handleFormChange(e, index)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Material Color"
              fullWidth
              name="color"
              value={material.color}
              onChange={(e) => handleFormChange(e, index)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Material Quantity"
              fullWidth
              name="quantity"
              type="number"
              value={material.quantity}
              onChange={(e) => handleFormChange(e, index)}
              sx={{ marginBottom: 2 }}
            />
          </div>
        ))}

                {/* Button to Add More Materials */}
                <button
          type="button"
          onClick={handleAddMaterial}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Add More Material
        </button>

                    {/* Image Upload Input */}
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-4" />

                    {/* Image Preview */}
                    <div className="flex gap-2 mt-4">
                        {previews.slice(0, 3).map((src, index) => (
                            <div key={index} className="w-24 h-24 rounded-lg overflow-hidden">
                                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        {previews.length > 3 && (
                            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-lg text-xl font-bold">
                                +{previews.length - 3}
                            </div>
                        )}
                    </div>

                    <button className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleCreateProject}>
                        Save Project
                    </button>
                </Box>
            </Modal>
        </>
    );
}
