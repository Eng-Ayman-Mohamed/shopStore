import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ toast }) {
  if (!toast) return null;
  const { message, type } = toast;

  const bg =
    type === "success"
      ? "linear-gradient(90deg,#4ade80,#10b981)"
      : type === "warning"
      ? "linear-gradient(90deg,#f59e0b,#f97316)"
      : "linear-gradient(90deg,#60a5fa,#3b82f6)";

  return (
    <div style={{ position: "fixed", right: 20, top: 20, zIndex: 9999 }}>
      <AnimatePresence>
        <motion.div
          key={toast.id || message}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            color: "white",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            background: bg,
            minWidth: 220,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 18 }}>
            {type === "success" ? "✓" : type === "warning" ? "⚠" : "ℹ"}
          </div>
          <div style={{ fontSize: 14 }}>{message}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
