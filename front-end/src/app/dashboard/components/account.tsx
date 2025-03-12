"use client";

import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import * as UsersApi from "../../network/notes_api";
import {
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Typography,
} from "@mui/material";
import { toast } from "sonner";

export default function EditUserPage() {
  const { currentUser } = useUser();
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    about: "",
  });

  // Populate state when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.userInformation?.name || "",
        facebookUrl: currentUser.userInformation?.facebookUrl || "",
        about: currentUser.userInformation?.about || "",
        instagramUrl: currentUser.userInformation?.instagramUrl || "",
        linkedinUrl: currentUser.userInformation?.linkedinUrl || "",
        githubUrl: currentUser.userInformation?.githubUrl || "",
        twitterUrl: currentUser.userInformation?.twitterUrl || "",
      });
      setPreviewImage(
        currentUser.userInformation?.imageUrl || "/default-profile.png"
      );
    }
  }, [currentUser]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = currentUser?._id;
      if (!userId) {
        throw new Error("User ID is missing.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("facebookUrl", formData.facebookUrl);
      formDataToSend.append("about", formData.about);
      formDataToSend.append("instagramUrl", formData.instagramUrl);
      formDataToSend.append("linkedinUrl", formData.linkedinUrl);
      formDataToSend.append("githubUrl", formData.githubUrl);
      formDataToSend.append("twitterUrl", formData.twitterUrl);

      if (image) {
        formDataToSend.append("image", image);
      }

      // ✅ Send userId & formData (including image) to backend
      await UsersApi.updateUserInformation(userId, formDataToSend);
      toast.success("updated successfully");
      setIsLoading(true);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col p-8 items-center min-h-screen">
        <CircularProgress />
        <Typography variant="h6" className="mt-4">
          Updating user info...
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-8 items-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Profile Picture Upload */}
        <div className="flex flex-row items-center gap-2">
          <div className="relative cursor-pointer group">
            <label htmlFor="imageUpload">
              {/* Profile Image */}
              <Avatar
                src={previewImage || "/default-profile.png"}
                sx={{ width: 200, height: 200 }}
                className="border-2 border-gray-300"
              />

              {/* Hover Effect with Text */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer">
                <span className="text-white font-semibold">Change Profile</span>
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex flex-col gap-2 w-full">
            {/* Name */}
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            {/* About */}
            <TextField
              label="About"
              name="about"
              value={formData.about}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </div>
        </div>

        {/* URLs */}
        <TextField
          label="Facebook URL"
          name="facebookUrl"
          value={formData.facebookUrl}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="IG URL"
          name="instagramUrl"
          value={formData.instagramUrl}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Linkedin URL"
          name="linkedinUrl"
          value={formData.linkedinUrl}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Github URL"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Twitter URL"
          name="twitterUrl"
          value={formData.twitterUrl}
          onChange={handleChange}
          fullWidth
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isLoading ? "saving" : "save"}
        </Button>
      </form>
    </div>
  );
}
