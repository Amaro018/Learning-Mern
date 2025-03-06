"use client";

import { useUser } from "../../context/UserContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditUserPage() {
  const { currentUser } = useUser(); // Get user info from context
  const router = useRouter();

  // State for form fields
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    facebookUrl: currentUser?.userInformation?.facebookUrl || "",
    about: currentUser?.userInformation?.about || "",
    imageUrl: currentUser?.userInformation?.imageUrl || "",
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Facebook URL */}
        <div>
          <label className="block text-sm font-medium">Facebook URL</label>
          <input
            type="url"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={4}
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium">Profile Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Preview Image */}
        {formData.imageUrl && (
          <div className="mt-2">
            <Image
              src={formData.imageUrl}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
