import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import * as api from "../services/api";

export default function ProductDetails({ onAdd, onAddToWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (!product && !loading)
    return <div className="card form">Product not found</div>;

  return (
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
            style={{
              width: 360,
              height: 260,
              objectFit: "cover",
              borderRadius: 12,
            }}
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
            <div
              style={{
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: 24,
                marginTop: 8,
              }}
            >
              ${product.price}
            </div>
            <p className="small" style={{ marginTop: 16 }}>
              {product.description ||
                "This is a premium, high-quality product. It features excellent craftsmanship and attention to detail."}
            </p>

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
  );
}
