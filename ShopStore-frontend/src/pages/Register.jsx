import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../utils/auth";
import "./Auth.css";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    registerUser(email, password, name).then((result) => {
      if (!result.success) {
        setError(result.error || "Registration failed");
        return;
      }
      setError("");
      onRegister(result);
    });
  }

  return (
    <div className="form card">
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label className="small">Full name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="small">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="small">Password</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              style={{
                cursor: "pointer",
                border: "none",
                background: "transparent",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {error && (
          <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button className="btn" type="submit">
            Create account
          </button>
          <Link to="/signin" className="small">
            Have account?
          </Link>
        </div>
      </form>
    </div>
  );
}
