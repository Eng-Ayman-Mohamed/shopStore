import React, { useState } from "react";
import { motion } from "framer-motion";
import { completePayment } from "../services/api";

export default function Cart({ cart, onRemove, user, onPaymentSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!cart || cart.length === 0)
    return (
      <div className="card form">
        <h3>Your cart is empty</h3>
        <p className="small">Add items from the Shop to see them here.</p>
      </div>
    );

  // Calculate discounted price for each item
  const getDiscountedPrice = (item) => {
    if (item.discount && item.discount > 0) {
      return item.price * (1 - item.discount / 100);
    }
    return item.price;
  };

  const total = cart.reduce((s, i) => s + (getDiscountedPrice(i) || 0), 0);

  const handlePayment = async () => {
    if (!user) {
      setError("Please log in to complete payment");
      return;
    }

    if (total > (user?.cash || 0)) {
      setError("Insufficient balance");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const result = await completePayment(total);
      if (result.ok) {
        // Get the updated user from the response - fix the data path
        const updatedUser = result.data?.data?.user;
        if (updatedUser) {
          onPaymentSuccess(updatedUser);
        } else {
          setError("Payment completed but user data not available");
        }
        // Clear cart (this will be handled by parent component)
      } else {
        setError(
          typeof result.error === "string" ? result.error : "Payment failed"
        );
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
              <div className="small">
                {c.discount && c.discount > 0 ? (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "var(--muted)",
                      }}
                    >
                      ${c.price.toFixed(2)}
                    </span>
                    <span
                      style={{ fontWeight: 700, color: "var(--accent-cyan)" }}
                    >
                      ${getDiscountedPrice(c).toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#22c55e",
                        background: "rgba(34, 197, 94, 0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {c.discount}% OFF
                    </span>
                  </div>
                ) : (
                  <span>${c.price.toFixed(2)}</span>
                )}
              </div>
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

      {/* User Cash Balance */}
      {user && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            padding: "12px",
            background: "rgba(34, 197, 94, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          <div className="small" style={{ color: "var(--text-secondary)" }}>
            Your Balance
          </div>
          <div style={{ fontWeight: 700, color: "#22c55e" }}>
            💰 ${user?.cash?.toFixed(2) || "0.00"}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: 12,
            padding: "12px",
            background: "rgba(239, 68, 68, 0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || !user || total > (user?.cash || 0)}
        style={{
          width: "100%",
          marginTop: 18,
          padding: "14px",
          borderRadius: "10px",
          background: isProcessing
            ? "rgba(100, 116, 139, 0.5)"
            : total > (user?.cash || 0)
            ? "rgba(239, 68, 68, 0.5)"
            : "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
          border: "none",
          color: "var(--bg-dark)",
          fontWeight: 700,
          fontSize: "16px",
          cursor:
            isProcessing || !user || total > (user?.cash || 0)
              ? "not-allowed"
              : "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isProcessing && user && total <= (user?.cash || 0)) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(0, 215, 255, 0.3)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isProcessing && user && total <= (user?.cash || 0)) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }
        }}
      >
        {isProcessing ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid var(--bg-dark)",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Processing...
          </div>
        ) : (
          `💳 Complete Payment - $${total.toFixed(2)}`
        )}
      </button>
    </motion.div>
  );
}
