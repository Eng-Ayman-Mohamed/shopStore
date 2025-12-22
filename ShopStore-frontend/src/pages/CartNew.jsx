import React from "react";
import { motion } from "framer-motion";

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
      <h3 style={{ marginTop: 0 }}>Your cart</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {cart.map((c, idx) => (
          <div
            key={c._id || idx}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
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
              <div style={{ fontWeight: 700 }}>{c.title}</div>
              <div className="small">${c.price}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => onRemove(c)}
                aria-label="Remove item"
                title="Remove item"
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
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
          marginTop: 18,
        }}
      >
        <div className="small">Total</div>
        <div style={{ fontWeight: 800 }}>${total.toFixed(2)}</div>
      </div>
    </motion.div>
  );
}
