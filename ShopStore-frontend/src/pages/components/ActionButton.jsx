import React from "react";

export default function ActionButton({
  children,
  onClick,
  variant = "primary",
  style = {},
  ...props
}) {
  const handleMouseEnter = (e) => {
    if (variant === "secondary") {
      e.target.style.background = "rgba(167, 139, 250, 0.1)";
    } else if (variant === "pink") {
      e.target.style.background = "rgba(244, 114, 182, 0.1)";
    }
  };

  const handleMouseLeave = (e) => {
    if (variant === "secondary") {
      e.target.style.background = "rgba(167, 139, 250, 0.05)";
    } else if (variant === "pink") {
      e.target.style.background = "rgba(244, 114, 182, 0.05)";
    }
  };

  return (
    <button
      className={`action-button ${variant}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
