import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ user }) {
  const navigate = useNavigate();
  if (!user)
    return (
      <div className="card form">
        <h3>No user signed in</h3>
        <p className="small">Please sign in to view your profile.</p>
      </div>
    );

  return (
    <div className="card form">
      <div className="profile-card">
        <div
          className="avatar"
          style={
            user.avatar
              ? {
                  backgroundImage: `url(${user.avatar})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  fontSize: 0,
                }
              : user.avatarEmoji
              ? { fontSize: "32px", lineHeight: 1 }
              : {
                  background:
                    user.avatarColor ||
                    "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                }
          }
        >
          {!user.avatar &&
            (user.avatarEmoji ||
              user.name
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() ||
              "U")}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            {user.name || "User"}
          </div>
          <div className="small">{user.email || ""}</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h4
          style={{
            marginBottom: 12,
            fontWeight: 600,
            color: "var(--accent-cyan)",
          }}
        >
          📋 Personal Information
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "rgba(0, 215, 255, 0.05)",
            }}
          >
            <div className="small" style={{ color: "var(--text-secondary)" }}>
              Full name
            </div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>{user.name}</div>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "rgba(167, 139, 250, 0.05)",
            }}
          >
            <div className="small" style={{ color: "var(--text-secondary)" }}>
              Email
            </div>
            <div
              style={{ fontWeight: 600, marginTop: 4, wordBreak: "break-all" }}
            >
              {user.email}
            </div>
          </div>
          {user.phone && (
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--card-border)",
                background: "rgba(244, 114, 182, 0.05)",
              }}
            >
              <div className="small" style={{ color: "var(--text-secondary)" }}>
                Phone
              </div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>{user.phone}</div>
            </div>
          )}
          {user.address && (
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--card-border)",
                background: "rgba(52, 211, 153, 0.05)",
              }}
            >
              <div className="small" style={{ color: "var(--text-secondary)" }}>
                Address
              </div>
              <div style={{ fontWeight: 600, marginTop: 4 }}>
                {user.address}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4
          style={{
            marginBottom: 12,
            fontWeight: 600,
            color: "var(--accent-purple)",
          }}
        >
          ⏰ Account Activity
        </h4>
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid var(--card-border)",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <div className="small" style={{ marginBottom: 8 }}>
            <span style={{ color: "var(--text-secondary)" }}>
              Member since:
            </span>{" "}
            <strong style={{ color: "var(--accent-cyan)" }}>
              {new Date().toLocaleDateString()}
            </strong>
          </div>
          <div className="small">
            <span style={{ color: "var(--text-secondary)" }}>
              Account status:
            </span>{" "}
            <strong style={{ color: "var(--accent-pink)" }}>✓ Active</strong>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4
          style={{
            marginBottom: 12,
            fontWeight: 600,
            color: "var(--accent-pink)",
          }}
        >
          🎨 Avatar Settings
        </h4>
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid var(--card-border)",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <div className="small">
            <span style={{ color: "var(--text-secondary)" }}>Avatar type:</span>{" "}
            <strong>
              {user.avatar
                ? "📷 Custom Image"
                : user.avatarEmoji
                ? `😊 Emoji (${user.avatarEmoji})`
                : "🎨 Color"}
            </strong>
          </div>
          {user.avatarColor && !user.avatar && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                className="small"
                style={{ color: "var(--text-secondary)" }}
              >
                Color:
              </span>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: user.avatarColor,
                  border: "1px solid var(--card-border)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h4
          style={{
            marginBottom: 12,
            color: "var(--text-primary)",
            fontWeight: 600,
          }}
        >
          Quick actions
        </h4>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/edit-profile")}
            className="btn"
            style={{ flex: 1 }}
          >
            ✏️ Edit profile
          </button>
          <button
            onClick={() => navigate("/wishlist")}
            style={{
              flex: 1,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "rgba(244, 114, 182, 0.05)",
              color: "var(--accent-pink)",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(244, 114, 182, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(244, 114, 182, 0.05)";
            }}
          >
            ❤ Wishlist
          </button>
          <button
            onClick={() => navigate("/orders")}
            style={{
              flex: 1,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "rgba(167, 139, 250, 0.05)",
              color: "var(--accent-purple)",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(167, 139, 250, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(167, 139, 250, 0.05)";
            }}
          >
            📦 Orders
          </button>
        </div>
      </div>
    </div>
  );
}
