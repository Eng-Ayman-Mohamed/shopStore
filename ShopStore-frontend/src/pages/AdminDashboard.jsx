import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";

export default function AdminDashboard({ user, showToast }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    img: "",
  });
  const [loading, setLoading] = useState(false);

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="card form">
        <h3>Access Denied</h3>
        <p className="small">You need admin privileges to access this page.</p>
        <button className="btn" onClick={() => navigate("/")} style={{ marginTop: 12 }}>
          Go Home
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      showToast("Please enter product title", "error");
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      showToast("Please enter valid price", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Please enter product description", "error");
      return;
    }
    if (!formData.img.trim()) {
      showToast("Please enter image URL", "error");
      return;
    }

    setLoading(true);
    const res = await api.createProduct({
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      img: formData.img.trim(),
    });

    setLoading(false);

    if (res.ok) {
      showToast(`Product "${formData.title}" added successfully`, "success");
      setFormData({ title: "", price: "", description: "", img: "" });
    } else {
      showToast(res.error || "Failed to add product", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="card form">
        <h2 style={{ marginTop: 0 }}>Add New Product</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Aurora Sneakers"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                boxSizing: "border-box",
              }}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 89.99"
              step="0.01"
              min="0"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                boxSizing: "border-box",
              }}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Lightweight, responsive sneakers with a vibrant gradient finish for everyday comfort."
              rows="3"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                boxSizing: "border-box",
                fontFamily: "inherit",
                resize: "vertical",
              }}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
              Image URL *
            </label>
            <input
              type="url"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="e.g., https://example.com/image.jpg"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                fontSize: 14,
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                boxSizing: "border-box",
              }}
              disabled={loading}
            />
            {formData.img && (
              <div style={{ marginTop: 12 }}>
                <p className="small" style={{ marginBottom: 8 }}>Preview:</p>
                <img
                  src={formData.img}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 8,
                    border: "1px solid var(--card-border)",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                flex: 1,
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Adding...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid var(--card-border)",
                background: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
