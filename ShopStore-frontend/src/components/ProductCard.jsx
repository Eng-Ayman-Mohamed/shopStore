import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ProductCard.css";

export default function ProductCard({
  product,
  onAdd,
  onAddToWishlist,
  loading = false,
}) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      className={`card ${product?.discount > 0 ? "has-discount" : ""}`}
      whileHover={{
        scale: 1.005,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        position: "relative",
        overflow: "visible",
      }}
    >
      {!imgLoaded && <div className="placeholder placeholder-img" />}

      {/* Discount Badge - More Prominent */}
      {product?.discount > 0 && (
        <motion.div
          className="discount-badge"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 16px rgba(239, 68, 68, 0.4)",
            zIndex: 3,
            border: "2px solid rgba(255, 255, 255, 0.2)",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            animation: "discountPulse 2s infinite",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            🔥 -{product.discount}%
          </span>
        </motion.div>
      )}

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
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="product-title">{product?.title}</div>
          <div className="product-price">
            {product?.discount > 0 ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    color: "var(--accent-cyan)",
                    fontSize: "18px",
                    fontWeight: "800",
                  }}
                >
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    textDecoration: "line-through",
                  }}
                >
                  ${product.price}
                </span>
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                    color: "var(--bg-dark)",
                    padding: "2px 6px",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: "700",
                  }}
                >
                  -{product.discount}%
                </span>
              </div>
            ) : (
              <span>${product?.price}</span>
            )}
          </div>

          {/* Rating Display */}
          {product?.avgRating && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <span>⭐</span>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                {product.avgRating}
              </span>
              <span>({product.ratingQuantity})</span>
            </div>
          )}

          {/* Premium Badge */}
          {product?.premium && (
            <div
              style={{
                marginTop: 8,
                display: "inline-block",
                padding: "4px 8px",
                background:
                  "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                color: "var(--bg-dark)",
                borderRadius: "12px",
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              ⭐ Premium
            </div>
          )}

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
