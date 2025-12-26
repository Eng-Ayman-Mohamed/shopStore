import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ProductCardAdmin({
  product,
  onDelete,
  onUpdateDiscount,
}) {
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState(product.discount || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDiscountSave = async () => {
    if (discountValue < 0 || discountValue > 100) {
      alert("Discount must be between 0 and 100");
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateDiscount(product._id, parseFloat(discountValue));
      setIsEditingDiscount(false);
    } catch (error) {
      console.error("Failed to update discount:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDiscountCancel = () => {
    setDiscountValue(product.discount || 0);
    setIsEditingDiscount(false);
  };

  const calculateDiscountedPrice = () => {
    return product.price * (1 - (product.discount || 0) / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        border: "1px solid var(--card-border)",
        borderRadius: 8,
        padding: 15,
        position: "relative",
      }}
    >
      <img
        src={product.img}
        alt={product.title}
        style={{
          width: "100%",
          height: 150,
          objectFit: "cover",
          borderRadius: 6,
          marginBottom: 10,
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />

      <h4 style={{ margin: "5px 0", fontSize: 16 }}>{product.title}</h4>

      {/* Price display with discount */}
      <div style={{ margin: "5px 0" }}>
        {(product.discount || 0) > 0 ? (
          <div>
            <span
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "var(--accent-cyan)",
                marginRight: 8,
              }}
            >
              ${calculateDiscountedPrice().toFixed(2)}
            </span>
            <span
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                textDecoration: "line-through",
              }}
            >
              ${product.price?.toFixed(2)}
            </span>
            <div
              style={{
                fontSize: 12,
                color: "#22c55e",
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              {product.discount}% OFF
            </div>
          </div>
        ) : (
          <p
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "var(--accent-cyan)",
            }}
          >
            ${product.price?.toFixed(2)}
          </p>
        )}
      </div>

      {/* Discount control */}
      <div style={{ margin: "8px 0" }}>
        {isEditingDiscount ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              style={{
                flex: 1,
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid var(--card-border)",
                background: "var(--footer-bg-end)",
                color: "var(--text-primary)",
                fontSize: 12,
              }}
              placeholder="Discount %"
            />
            <button
              onClick={handleDiscountSave}
              disabled={isUpdating}
              style={{
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #22c55e",
                background: "none",
                color: "#22c55e",
                cursor: isUpdating ? "not-allowed" : "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {isUpdating ? "..." : "Save"}
            </button>
            <button
              onClick={handleDiscountCancel}
              style={{
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #6b7280",
                background: "none",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingDiscount(true)}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid var(--accent-cyan)",
              background: "none",
              color: "var(--accent-cyan)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {product.discount
              ? `Edit Discount (${product.discount}%)`
              : "Add Discount"}
          </button>
        )}
      </div>

      <p
        style={{
          margin: "5px 0",
          fontSize: 12,
          color: "var(--text-secondary)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {product.description}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          ⭐ {product.avgRating?.toFixed(1) || "0.0"}
        </span>

        <button
          onClick={() => onDelete(product._id, product.title)}
          style={{
            padding: "5px 10px",
            borderRadius: 4,
            border: "1px solid #e74c3c",
            background: "none",
            color: "#e74c3c",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
