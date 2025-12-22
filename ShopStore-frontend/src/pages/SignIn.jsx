import React, { useState } from "react";
import { Link } from "react-router-dom";
import { validateLogin } from "../utils/auth";

export default function SignIn({ onSign }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Provide email and password");
      return;
    }

    setError("");
    validateLogin(email, password).then((result) => {
      if (!result.success) {
        setError(result.error || "Login failed");
        return;
      }
      setError("");
      onSign(result);
    });
  }

  return (
    <div className="form card">
      <h2>Sign in</h2>
      <form onSubmit={submit}>
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
            Sign in
          </button>
          <Link to="/register" className="small">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
