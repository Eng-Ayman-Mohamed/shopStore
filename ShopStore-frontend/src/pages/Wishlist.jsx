import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Wishlist({ wishlist, onRemove, onAdd, user }) {
  const navigate = useNavigate();

  if (!user)
    return (
      <div className="card form">
        <h3>Please sign in</h3>
        <p className="small">You need to be signed in to view your wishlist.</p>
      </div>
    );

  if (wishlist.length === 0)
    return (
      <div className="card form">
        <h3>Your wishlist is empty</h3>
        <p className="small">Add items from the shop to your wishlist.</p>
        <button
          className="btn"
          onClick={() => navigate("/shop")}
          style={{ marginTop: 12 }}
        >
          Continue shopping
        </button>
      </div>
    );

  const total = wishlist.reduce((sum, item) => sum + item.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Wishlist ({wishlist.length})</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {wishlist.map((item, idx) => (
            <div
              key={item._id || idx}
              style={{
                display: "flex",
                gap: 12,
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--card-border)",
                alignItems: "center",
              }}
            >
              <img
                src={item.img}
                alt=""
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ color: "var(--accent-cyan)", fontSize: 14 }}>
                  ${item.price}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => onAdd(item)}
                  className="btn"
                  style={{ padding: "8px 12px", fontSize: 12 }}
                >
                  Add to cart
                </button>
                <button
                  onClick={() => onRemove(item)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--card-border)",
                    background: "rgba(244, 114, 182, 0.05)",
                    color: "var(--accent-pink)",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            paddingTop: 12,
            borderTop: "1px solid var(--card-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 600 }}>
            Total:{" "}
            <span style={{ color: "var(--accent-cyan)" }}>
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            className="btn"
            onClick={() => {
              wishlist.forEach((item) => onAdd(item));
            }}
          >
            Add all to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
