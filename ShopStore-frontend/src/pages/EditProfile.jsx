import React, { useState } from "react";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
          avatarFile: file,
        }));
        setAvatarType("image");
      };
      reader.readAsDataURL(file);
    }
  }

  function handleColorSelect(color) {
    setFormData((prev) => ({ ...prev, avatarColor: color }));
    setAvatarType("color");
  }

  function handleEmojiSelect(emoji) {
    setFormData((prev) => ({ ...prev, avatarEmoji: emoji }));
    setAvatarType("emoji");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const payload = { ...formData };
        // remove file object — we only send the uploaded URL to backend
        if (payload.avatarFile) delete payload.avatarFile;
        // If user selected a new file, upload it first
        if (formData.avatarFile) {
          const up = await api.uploadImage(formData.avatarFile);
          if (up.ok) {
            // Cloudinary returns secure_url
            payload.avatar =
              up.data.secure_url || up.data.url || payload.avatar;
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
    })();
  }

  return (
    <motion.div
      className="card form"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h2
        style={{
          marginTop: 0,
          background:
            "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Edit profile
      </h2>

      {/* Avatar Preview */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: 16,
          borderRadius: 8,
          border: "1px solid var(--card-border)",
          marginBottom: 16,
          background: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: formData.avatar ? 0 : "32px",
            fontWeight: 800,
            color: "white",
            background: formData.avatar
              ? `url(${formData.avatar}) center/cover`
              : avatarType === "color"
              ? formData.avatarColor
              : "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
            backgroundSize: formData.avatar ? "cover" : undefined,
          }}
        >
          {avatarType === "emoji" && formData.avatarEmoji}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Profile picture</div>
          <div className="small" style={{ marginTop: 4 }}>
            {avatarType === "image"
              ? "Custom image"
              : avatarType === "emoji"
              ? "Emoji avatar"
              : "Color avatar"}
          </div>
        </div>
      </div>

      {/* Avatar Type Selection */}
      <div style={{ marginBottom: 16 }}>
        <label className="small" style={{ marginBottom: 8, display: "block" }}>
          Choose avatar type
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setAvatarType("image")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border:
                avatarType === "image"
                  ? "2px solid var(--accent-cyan)"
                  : "1px solid var(--card-border)",
              background:
                avatarType === "image"
                  ? "rgba(0, 215, 255, 0.1)"
                  : "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              transition: "all 0.2s ease",
            }}
          >
            📷 Image
          </button>
          <button
            type="button"
            onClick={() => setAvatarType("emoji")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border:
                avatarType === "emoji"
                  ? "2px solid var(--accent-pink)"
                  : "1px solid var(--card-border)",
              background:
                avatarType === "emoji"
                  ? "rgba(244, 114, 182, 0.1)"
                  : "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              transition: "all 0.2s ease",
            }}
          >
            😊 Emoji
          </button>
          <button
            type="button"
            onClick={() => setAvatarType("color")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border:
                avatarType === "color"
                  ? "2px solid var(--accent-purple)"
                  : "1px solid var(--card-border)",
              background:
                avatarType === "color"
                  ? "rgba(167, 139, 250, 0.1)"
                  : "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              transition: "all 0.2s ease",
            }}
          >
            🎨 Color
          </button>
        </div>
      </div>

      {/* Image Upload */}
      {avatarType === "image" && (
        <div style={{ marginBottom: 16 }}>
          <label className="small">Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 6,
              border: "1px solid var(--card-border)",
              background: "rgba(255, 255, 255, 0.02)",
              color: "var(--text-primary)",
              cursor: "pointer",
            }}
          />
        </div>
      )}

      {/* Emoji Selection */}
      {avatarType === "emoji" && (
        <div style={{ marginBottom: 16 }}>
          <label
            className="small"
            style={{ marginBottom: 8, display: "block" }}
          >
            Choose emoji
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {AVATAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                style={{
                  padding: "12px",
                  borderRadius: 6,
                  border:
                    formData.avatarEmoji === emoji
                      ? "2px solid var(--accent-pink)"
                      : "1px solid var(--card-border)",
                  background:
                    formData.avatarEmoji === emoji
                      ? "rgba(244, 114, 182, 0.1)"
                      : "transparent",
                  fontSize: 24,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {avatarType === "color" && (
        <div style={{ marginBottom: 16 }}>
          <label
            className="small"
            style={{ marginBottom: 8, display: "block" }}
          >
            Choose color
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border:
                    formData.avatarColor === color
                      ? "3px solid white"
                      : "2px solid transparent",
                  background: color,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div>
          <label className="small">Full name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="small">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="small">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="small">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, City, State"
          />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              flex: 1,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Uploading...
              </>
            ) : (
              "Save changes"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "var(--bg-dark)",
              color: "var(--text-secondary)",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              transition: "all 0.2s ease",
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.target.style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "var(--bg-dark)";
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
