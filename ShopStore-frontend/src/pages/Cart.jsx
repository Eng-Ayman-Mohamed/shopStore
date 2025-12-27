import React from "react";
import { motion } from "framer-motion";
import "./Cart.css";

export default function Cart({ cart, onRemove }) {
  if (!cart || cart.length === 0)
    return (
      <div className="card form">
        <h3>Your cart is empty</h3>
        <p className="small">Add items from the Shop to see them here.</p>
      </div>
    );
  const total = cart.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 20 }}>🛒 Shopping Cart</h3>
      <div style={{ display: "grid", gap: 14 }}>
        {cart.map((c, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px",
              background: "rgba(0, 215, 255, 0.03)",
              borderRadius: "10px",
              border: "1px solid var(--card-border)",
            }}
          >
            <img
              src={c.img}
              alt=""
              style={{
                width: 92,
                height: 64,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                {c.title}
              </div>
              <div className="small">${c.price}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => onRemove(idx)}
                aria-label="Remove item"
                title="Remove item"
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
          padding: "16px",
          background: "rgba(0, 215, 255, 0.05)",
          borderRadius: "10px",
          border: "1px solid var(--card-border)",
        }}
      >
        <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
          Total Amount
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            background:
              "linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ${total.toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
}
