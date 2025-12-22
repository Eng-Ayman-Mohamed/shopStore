import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or default to true (dark mode)
    const stored = localStorage.getItem("cs_theme");
    return stored ? JSON.parse(stored) : true;
  });

  // Apply theme on mount and when isDarkMode changes
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  // Persist theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cs_theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function applyTheme(isDarkMode) {
  const root = document.documentElement;
  if (isDarkMode) {
    // Dark mode (current)
    root.style.setProperty("--bg-dark", "#0f172a");
    root.style.setProperty("--bg-darker", "#0b1220");
    root.style.setProperty("--card-bg", "rgba(30, 41, 59, 0.8)");
    root.style.setProperty("--card-border", "rgba(100, 116, 139, 0.2)");
    root.style.setProperty("--text-primary", "#f1f5f9");
    root.style.setProperty("--text-secondary", "#94a3b8");
    root.style.setProperty("--text-muted", "#64748b");
    // Shadows for dark mode
    root.style.setProperty(
      "--card-shadow",
      "0 20px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.03)"
    );
    root.style.setProperty(
      "--card-hover-shadow",
      "0 12px 48px rgba(0, 215, 255, 0.08), inset 0 1px 0 rgba(255,255,255,0.06)"
    );
    root.style.setProperty("--img-shadow", "0 6px 18px rgba(0,0,0,0.45)");
    // Footer/background gradients for dark
    root.style.setProperty("--footer-bg-start", "rgba(15, 23, 42, 0.8)");
    root.style.setProperty("--footer-bg-end", "rgba(11, 18, 32, 0.9)");
    //header background for dark
    root.style.setProperty("--header-bg-start", "rgba(30, 41, 59, 0.7)");
    root.style.setProperty("--header-bg-end", "rgba(15, 23, 42, 0.8)");
  } else {
    // Light mode
    // Softer off-white background and subtle card contrast
    root.style.setProperty("--bg-dark", "#f7fafc");
    root.style.setProperty("--bg-darker", "#eef2f7");
    root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.9)");
    root.style.setProperty("--card-border", "rgba(15, 23, 42, 0.06)");
    // Dark text for readability
    root.style.setProperty("--text-primary", "#0f172a");
    root.style.setProperty("--text-secondary", "#475569");
    root.style.setProperty("--text-muted", "#6b7280");
    // Compatibility alias: some components use --muted
    root.style.setProperty("--muted", "#6b7280");
    // Shadows for light mode
    root.style.setProperty(
      "--card-shadow",
      "0 8px 24px rgba(2, 6, 23, 0.06), inset 0 1px 0 rgba(255,255,255,0.6)"
    );
    root.style.setProperty(
      "--card-hover-shadow",
      "0 12px 36px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
    );
    root.style.setProperty("--img-shadow", "0 6px 18px rgba(2,6,23,0.06)");
    // Footer/background gradients for light
    root.style.setProperty("--footer-bg-start", "rgba(255,255,255,0.9)");
    root.style.setProperty("--footer-bg-end", "rgba(241, 245, 249, 0.9)");
    //header background for light
    root.style.setProperty("--header-bg-start", "rgba(255, 255, 255, 0.7)");
    root.style.setProperty("--header-bg-end", "rgba(255, 255, 255, 0.7)");
  }
}
