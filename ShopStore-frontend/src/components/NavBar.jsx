import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import useBackendStatus from "../hooks/useBackendStatus";

export default function NavBar({ user, onSignOut, cartCount, wishlistCount }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isOnline } = useBackendStatus();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".nav-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`nav nav-container ${isScrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="brand"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="brand-bubble"
          whileHover={{
            rotate: 360,
            scale: 1.1,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
        >
          <img
            src="/favicon.ico"
            alt="SwiftCart Logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </motion.div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Swift Cart</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            Bright gear, brighter you
          </div>
        </div>
      </motion.div>

      {/* Desktop Navigation */}
      <motion.div
        className="nav-links desktop-nav"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
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
            {user.role === "admin" && (
              <Link
                to="/admin"
                style={{
                  color: "var(--accent-gold)",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--accent-gold)",
                  backgroundColor: "rgba(251, 191, 36, 0.1)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(251, 191, 36, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(251, 191, 36, 0.1)";
                }}
              >
                🛠️ Admin
              </Link>
            )}
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
      </motion.div>

      {/* Mobile Menu Button */}
      <motion.button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        style={{
          display: "none",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "30px",
          height: "30px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "4px",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "var(--text-primary)",
            borderRadius: "2px",
            transformOrigin: "1px",
          }}
          animate={{
            rotate: isMobileMenuOpen ? 45 : 0,
            y: isMobileMenuOpen ? 8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "var(--text-primary)",
            borderRadius: "2px",
          }}
          animate={{
            opacity: isMobileMenuOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "var(--text-primary)",
            borderRadius: "2px",
            transformOrigin: "1px",
          }}
          animate={{
            rotate: isMobileMenuOpen ? -45 : 0,
            y: isMobileMenuOpen ? -8 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Mobile Menu Overlay */}
      <motion.div
        className="mobile-menu-overlay"
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? "0%" : "100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "280px",
          height: "100vh",
          backgroundColor: "var(--card-bg)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid var(--card-border)",
          zIndex: 1000,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Mobile Menu Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              Swift Cart
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Mobile Menu
            </div>
          </div>
          <button
            onClick={closeMobileMenu}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: 24,
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ×
          </button>
        </div>

        {/* Mobile Menu Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link
            to="/"
            onClick={closeMobileMenu}
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(100, 116, 139, 0.1)",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(100, 116, 139, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
            }}
          >
            🏠 Home
          </Link>

          <Link
            to="/shop"
            onClick={closeMobileMenu}
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(100, 116, 139, 0.1)",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(100, 116, 139, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
            }}
          >
            🛍️ Shop
          </Link>

          <Link
            to="/wishlist"
            onClick={closeMobileMenu}
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(100, 116, 139, 0.1)",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(244, 114, 182, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
            }}
          >
            <span>❤️ Wishlist</span>
            <span
              style={{
                backgroundColor: "var(--accent-pink)",
                color: "var(--bg-dark)",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {wishlistCount}
            </span>
          </Link>

          <Link
            to="/cart"
            onClick={closeMobileMenu}
            style={{
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(100, 116, 139, 0.1)",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(0, 215, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
            }}
          >
            <span>🛒 Cart</span>
            <span
              style={{
                backgroundColor: "var(--accent-cyan)",
                color: "var(--bg-dark)",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {cartCount}
            </span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              closeMobileMenu();
            }}
            style={{
              cursor: "pointer",
              padding: "12px 16px",
              borderRadius: 10,
              backgroundColor: "rgba(100, 116, 139, 0.1)",
              border: "1px solid var(--card-border)",
              color: "var(--text-primary)",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(167, 139, 250, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
            }}
          >
            {isDarkMode ? "☀️" : "🌙"}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* User Actions */}
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  style={{
                    color: "var(--accent-gold)",
                    textDecoration: "none",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(251, 191, 36, 0.1)",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(251, 191, 36, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(251, 191, 36, 0.1)";
                  }}
                >
                  🛠️ Admin Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                style={{
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(100, 116, 139, 0.1)",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
                }}
              >
                👤 Profile
              </Link>
              <button
                onClick={() => {
                  onSignOut();
                  closeMobileMenu();
                }}
                style={{
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: 10,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "var(--accent-pink)",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                }}
              >
                🚪 Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                onClick={closeMobileMenu}
                style={{
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(100, 116, 139, 0.1)",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 215, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
                }}
              >
                🔑 Sign in
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="btn"
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                  color: "var(--bg-dark)",
                  fontSize: "16px",
                  fontWeight: "700",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(0, 215, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                ✨ Register
              </Link>
            </>
          )}
        </div>

        {/* Backend Status */}
        <div
          style={{
            marginTop: "auto",
            padding: "16px",
            borderRadius: "10px",
            backgroundColor: "rgba(100, 116, 139, 0.05)",
            border: "1px solid var(--card-border)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              background: isOnline ? "#22c55e" : "#ef4444",
              boxShadow: isOnline
                ? "0 0 12px rgba(34,197,94,0.4)"
                : "0 0 12px rgba(239,68,68,0.4)",
              animation: isOnline ? "pulse 2s infinite" : "none",
            }}
          />
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {isOnline ? "Backend Online" : "Backend Offline"}
          </span>
        </div>
      </motion.div>
    </motion.nav>
  );
}
