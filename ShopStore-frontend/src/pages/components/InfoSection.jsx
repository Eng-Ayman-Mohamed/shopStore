import React from "react";

export default function InfoSection({
  title,
  icon,
  variant = "default",
  children,
}) {
  return (
    <div className={`profile-section ${variant}`}>
      <h4>
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}
