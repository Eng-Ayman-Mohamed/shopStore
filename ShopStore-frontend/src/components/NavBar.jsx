import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import useBackendStatus from "../hooks/useBackendStatus";

export default function NavBar({ user, onSignOut, cartCount, wishlistCount }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isOnline } = useBackendStatus();

  return (
    <nav className="nav container">
      <div className="brand">
        <div className="brand-bubble">CS</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Colorful Shop</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            Bright gear, brighter you
          </div>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/wishlist">Wishlist ({wishlistCount})</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        <div
          title={isOnline ? "Backend online" : "Backend offline"}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              background: isOnline ? "#22c55e" : "#ef4444",
              boxShadow: isOnline
                ? "0 0 8px rgba(34,197,94,0.25)"
                : "0 0 8px rgba(239,68,68,0.25)",
            }}
          />
        </div>
        <button
          onClick={toggleTheme}
          style={{
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: 10,
            background: "transparent",
            border: "1px solid var(--card-border)",
            color: "var(--text-primary)",
            fontSize: 18,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(100, 116, 139, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
          }}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <a
              onClick={onSignOut}
              style={{
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 10,
              }}
            >
              Sign out
            </a>
          </>
        ) : (
          <>
            <Link to="/signin">Sign in</Link>
            <Link to="/register" className="btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
