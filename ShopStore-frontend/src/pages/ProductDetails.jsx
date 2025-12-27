import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import * as api from "../services/api";
import { getCategoryIcon, getCategoryColor } from "../utils/categories";
import "./ProductDetails.css";

export default function ProductDetails({ onAdd, onAddToWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .getProduct(id)
      .then((res) => {
        if (!mounted) return;
        if (res.ok && res.data?.product) setProduct(res.data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => (mounted = false);
  }, [id]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setImageModalOpen(false);
      }
    };
    if (imageModalOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [imageModalOpen]);

  if (!product && !loading)
    return <div className="card form">Product not found</div>;

  return (
    <>
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div
              className="placeholder placeholder-img"
              style={{ width: 360, height: 260, borderRadius: 12 }}
            />
            <div style={{ flex: 1 }}>
              <div
                className="placeholder-line long"
                style={{ height: 26, borderRadius: 8 }}
              />
              <div
                className="placeholder-line medium"
                style={{ height: 20, marginTop: 12 }}
              />
              <div
                className="placeholder-line long"
                style={{ height: 12, marginTop: 18 }}
              />
              <div
                className="placeholder-line long"
                style={{ height: 12, marginTop: 8 }}
              />
              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <div
                  className="placeholder-line short"
                  style={{ height: 40, flex: 1, borderRadius: 8 }}
                />
                <div
                  className="placeholder-line short"
                  style={{ height: 40, flex: 1, borderRadius: 8 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <img
              src={product.img}
              alt=""
              onClick={() => setImageModalOpen(true)}
              style={{
                width: 360,
                height: 260,
                objectFit: "cover",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              className="product-details-image"
            />
            <div style={{ flex: 1 }}>
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
                {product.title}
              </h2>
              {/* Price Display with Discount */}
              <div style={{ marginTop: 8 }}>
                {product.discount && product.discount > 0 ? (
                  <div className="discounted-price-container">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Discount Badge */}
                      <motion.div
                        className="discount-badge"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                        style={{
                          background:
                            "linear-gradient(135deg, #ef4444, #dc2626)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🔥 -{product.discount}%
                      </motion.div>

                      {/* Discounted Price */}
                      <div
                        className="discounted-price"
                        style={{
                          fontWeight: 800,
                          background:
                            "linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontSize: 24,
                        }}
                      >
                        $
                        {(product.price * (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </div>

                      {/* Original Price */}
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          textDecoration: "line-through",
                          opacity: 0.7,
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Savings Amount */}
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: "14px",
                        color: "var(--accent-cyan)",
                        fontWeight: 600,
                      }}
                    >
                      You save $
                      {(product.price * (product.discount / 100)).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontWeight: 800,
                      background:
                        "linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: 24,
                    }}
                  >
                    ${product.price}
                  </div>
                )}
              </div>

              {/* Rating Display */}
              {product.avgRating && (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>⭐</span>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    {product.avgRating}
                  </span>
                  <span>({product.ratingQuantity} reviews)</span>
                </div>
              )}

              {/* Category Display */}
              {product.category && (
                <div
                  style={{
                    marginTop: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 16px",
                    background: "rgba(0, 215, 255, 0.05)",
                    border: `1px solid ${getCategoryColor(product.category)}`,
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>
                    {getCategoryIcon(product.category)}
                  </span>
                  <span>{product.category}</span>
                </div>
              )}

              {/* Premium Badge */}
              {product.premium && (
                <div
                  style={{
                    marginTop: 12,
                    display: "inline-block",
                    padding: "6px 16px",
                    background:
                      "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                    color: "var(--bg-dark)",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  ⭐ Premium Product
                </div>
              )}

              <p className="small" style={{ marginTop: 16 }}>
                {product.description ||
                  "This is a premium, high-quality product. It features excellent craftsmanship and attention to detail."}
              </p>

              {/* Details Section */}
              {product.details && (
                <div style={{ marginTop: 20 }}>
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "16px",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    Product Details
                  </h3>
                  <p
                    className="small"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {product.details}
                  </p>
                </div>
              )}

              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <button className="btn" onClick={() => onAdd(product)}>
                  Add to cart
                </button>
                <button
                  onClick={() => onAddToWishlist(product)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "1px solid var(--card-border)",
                    background: "rgba(244, 114, 182, 0.05)",
                    color: "var(--accent-pink)",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(244, 114, 182, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(244, 114, 182, 0.05)";
                  }}
                >
                  ❤ Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="image-modal-overlay"
          onClick={() => setImageModalOpen(false)}
        >
          <motion.div
            className="image-modal-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={() => setImageModalOpen(false)}
              aria-label="Close image"
            >
              ✕
            </button>
            <img
              src={product?.img}
              alt={product?.title || "Product image"}
              className="image-modal-img"
            />
          </motion.div>
        </div>
      )}
    </>
  );
}
