import React, { useState } from "react";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AvatarSelector from "../components/EditProfile/AvatarSelector";
import FormField from "../components/EditProfile/FormField";
import ProfileForm from "../components/EditProfile/ProfileForm";
import "./../components/EditProfile/EditProfile.css";

const AVATAR_COLORS = [
  "#00d9ff", // cyan
  "#a78bfa", // purple
  "#f472b6", // pink
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // amber
];

const AVATAR_EMOJIS = ["👨", "👩", "🧑", "🎨", "⭐", "🚀", "💎", "🌟"];

export default function EditProfile({ user, onSave }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || null,
    avatarFile: null,
    avatarColor: user?.avatarColor || AVATAR_COLORS[0],
    avatarEmoji: user?.avatarEmoji || AVATAR_EMOJIS[0],
  });
  const [avatarType, setAvatarType] = useState(
    user?.avatar ? "image" : user?.avatarEmoji ? "emoji" : "color"
  );
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleAvatarUpload({ file, dataUrl }) {
    setFormData((prev) => ({
      ...prev,
      avatar: dataUrl,
      avatarFile: file,
    }));
    setAvatarType("image");
  }

  function handleColorSelect(color) {
    setFormData((prev) => ({ ...prev, avatarColor: color }));
    setAvatarType("color");
  }

  function handleEmojiSelect(emoji) {
    setFormData((prev) => ({ ...prev, avatarEmoji: emoji }));
    setAvatarType("emoji");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData };
      // remove file object — we only send the uploaded URL to backend
      if (payload.avatarFile) delete payload.avatarFile;
      // If user selected a new file, upload it first
      if (formData.avatarFile) {
        const up = await api.uploadImage(formData.avatarFile);
        if (up.ok) {
          // Cloudinary returns secure_url
          payload.avatar = up.data.secure_url || up.data.url || payload.avatar;
        } else {
          console.warn("Avatar upload failed:", up.error);
          // proceed with existing avatar preview if upload fails
        }
      }

      await onSave(payload);
      navigate("/profile");
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/profile");
  }

  return (
    <motion.div
      className="edit-profile-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="edit-profile-title">Edit profile</h2>

      <AvatarSelector
        formData={formData}
        avatarType={avatarType}
        setAvatarType={setAvatarType}
        onAvatarUpload={handleAvatarUpload}
        onColorSelect={handleColorSelect}
        onEmojiSelect={handleEmojiSelect}
      />

      <ProfileForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      >
        <FormField
          name="name"
          label="Full name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
        />
        <FormField
          name="phone"
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
        />
        <FormField
          name="address"
          label="Address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, City, State"
        />
      </ProfileForm>
    </motion.div>
  );
}
