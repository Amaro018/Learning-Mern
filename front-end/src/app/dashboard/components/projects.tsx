"use client";
import Image from "next/image";
import { Project as ProjectModel } from "../../models/project";
import * as ProjectsApi from "../../network/notes_api";
import { useEffect, useState } from "react";
import { Box, Modal, Typography, TextField } from "@mui/material";
import { createProject } from "../../network/notes_api";

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

    interface ProjectForm {
        title: string;
        description: string;
        materials: { name: string; description: string; size: string; color: string; quantity: number }[];
        files: File[];
      }

       const [form, setForm] = useState<ProjectForm>({ title: "", description: "", materials: [], files: [] });


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

    // Add new material input fields
    const handleAddMaterial = () => {
        setForm({
            ...form,
            materials: [...form.materials, { name: "", description: "", size: "", color: "", quantity: 0 }],
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

    const handleCreateProject = async () => {
        const formData = new FormData();
        
        // Add form fields to FormData
        formData.append("title", form.title);
        formData.append("description", form.description);
        
        images.forEach((image) => {
            formData.append("files", image);  // Correctly append multiple files
        });
    
        formData.append("materials", JSON.stringify(form.materials));  // Ensure it's a valid JSON string
    
        // Debugging FormData
        console.log("📤 FormData Debugging (Before Sending):");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        console.log('----')
        console.log(formData)
    
        try {
            await createProject(formData);
        } catch (error) {
            console.error("❌ Failed to create project:", error);
        }
    };
    
    
    

    // Fetch projects from API
    const loadProjects = async () => {
        try {
            const data = await ProjectsApi.fetchProjects();
            setProjects(data as ProjectModel[]);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
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

                {/* Project List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105">
                            <Image
                                src={project.images && project.images.length > 0 ? project.images[0] : "/placeholder.svg"}
                                alt={project.title}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{project.title}</h2>
                                <p className="text-gray-600">{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Project Modal */}
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" sx={{ overflowY: "scroll", height: "100vh" }}>
                <Box sx={style}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Adding New Project
                    </Typography>
                    <TextField required label="Project Title" fullWidth name="title" value={form.title} onChange={handleFormChange} sx={{ marginBottom: 2 }} />
                    <TextField required label="Project Description" fullWidth name="description" value={form.description} onChange={handleFormChange} sx={{ marginBottom: 2 }} />

                    {/* Dynamically Render Materials Input Fields */}
                    {form.materials.map((material, index) => (
                        <div key={index} className="mb-4">
                            <Typography variant="subtitle1">Material {index + 1}</Typography>
                            <TextField label="Material Title" fullWidth name="name" value={material.name} onChange={(e) => handleFormChange(e, index)} sx={{ marginBottom: 2 }} />
                            <TextField label="Material Description" fullWidth name="description" value={material.description} onChange={(e) => handleFormChange(e, index)} sx={{ marginBottom: 2 }} />
                            <TextField label="Material Size" fullWidth name="size" value={material.size} onChange={(e) => handleFormChange(e, index)} sx={{ marginBottom: 2 }} />
                            <TextField label="Material Color" fullWidth name="color" value={material.color} onChange={(e) => handleFormChange(e, index)} sx={{ marginBottom: 2 }} />
                            <TextField label="Material Quantity" fullWidth name="quantity" type="number" value={material.quantity} onChange={(e) => handleFormChange(e, index)} sx={{ marginBottom: 2 }} />
                        </div>
                    ))}

                    {/* Button to Add More Materials */}
                    <button onClick={handleAddMaterial} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
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
                    </div>

                    <button className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleCreateProject}>
                        Save Project
                    </button>
                </Box>
            </Modal>
        </>
    );
}
