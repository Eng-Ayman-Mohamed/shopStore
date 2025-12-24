import React from "react";

export default function InfoItem({ label, value, variant = "default" }) {
  return (
    <div className={`info-item ${variant}`}>
      <div className="info-item-label">{label}</div>
      <div className="info-item-value">{value}</div>
    </div>
  );
}
