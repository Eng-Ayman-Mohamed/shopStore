import React from "react";

export default function Button({
  type = "button",
  variant = "primary",
  children,
  onClick,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "btn btn-submit";
      case "secondary":
        return "btn-cancel";
      default:
        return "btn btn-submit";
    }
  };

  return (
    <button
      type={type}
      className={`${getVariantClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="loading-spinner" />}
      {children}
    </button>
  );
}
