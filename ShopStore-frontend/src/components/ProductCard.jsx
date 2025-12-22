import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({
  product,
  onAdd,
  onAddToWishlist,
  loading = false,
}) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  if (loading) {
    return (
      <motion.div
        className="card"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="placeholder placeholder-img" />
        <div className="placeholder-line long" />
        <div className="placeholder-line medium" />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <div className="placeholder-line short" style={{ flex: 1 }} />
          <div className="placeholder-line short" style={{ flex: 1 }} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {!imgLoaded && <div className="placeholder placeholder-img" />}
      <img
        src={product?.img}
        alt=""
        className="product-img"
        style={{ display: imgLoaded ? "block" : "none" }}
        onLoad={() => setImgLoaded(true)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div>
          <div className="product-title">{product?.title}</div>
          <div className="product-price">${product?.price}</div>
          {product?.description && (
            <div
              className="small muted"
              style={{ marginTop: 6, maxWidth: 220 }}
            >
              {product.description}
            </div>
          )}
        </div>
        <button
          onClick={() => onAddToWishlist && onAddToWishlist(product)}
          style={{
            borderRadius: 8,
            padding: "8px 12px",
            border: "1px solid var(--card-border)",
            background: "rgba(244, 114, 182, 0.05)",
            color: "var(--accent-pink)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
            transition: "all 0.2s ease",
            minWidth: "fit-content",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(244, 114, 182, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(244, 114, 182, 0.05)";
          }}
        >
          ❤
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button
          className="btn"
          onClick={() => onAdd && onAdd(product)}
          style={{ flex: 1 }}
        >
          Add
        </button>
        <button
          style={{
            flex: 1,
            borderRadius: 8,
            padding: "10px 12px",
            border: "1px solid var(--card-border)",
            background: "rgba(0, 215, 255, 0.05)",
            color: "var(--accent-cyan)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s ease",
          }}
          onClick={() => navigate(`/product/${product?._id}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 215, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 215, 255, 0.05)";
          }}
        >
          View
        </button>
      </div>
    </motion.div>
  );
}
