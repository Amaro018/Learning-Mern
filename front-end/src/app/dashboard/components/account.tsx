"use client";

import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import { TextField, Button, Avatar } from "@mui/material";

export default function EditUserPage() {
  const { currentUser } = useUser(); // Get user info from context
  const router = useRouter();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    facebookUrl: "",
    about: "",
    imageUrl: "",
  });

  // Populate state when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        facebookUrl: currentUser.userInformation?.facebookUrl || "",
        about: currentUser.userInformation?.about || "",
        imageUrl: currentUser.userInformation?.imageUrl || "",
      });
    }
  }, [currentUser]); // Run when `currentUser` changes

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
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Updated User:", formData);
      router.push("/account");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex flex-col p-8 items-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full ">
        {/* Profile Picture Upload */}
        <div className="flex justify-center">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <Avatar
              src={formData.imageUrl || "/default-profile.png"}
              sx={{ width: 100, height: 100 }}
              className="border-2 border-gray-300"
            />
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Name */}
        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* Facebook URL */}
        <TextField
          label="Facebook URL"
          name="facebookUrl"
          value={formData.facebookUrl}
          onChange={handleChange}
          fullWidth
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
