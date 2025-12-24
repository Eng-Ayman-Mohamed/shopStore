import React from "react";

export default function QuickActions({ navigate }) {
  return (
    <div className="profile-actions">
      <h4>Quick actions</h4>
      <div className="quick-actions-buttons">
        <button onClick={() => navigate("/edit-profile")} className="btn">
          ✏️ Edit profile
        </button>
        <button
          onClick={() => navigate("/wishlist")}
          className="action-button pink"
        >
          ❤ Wishlist
        </button>
        <button
          onClick={() => navigate("/orders")}
          className="action-button secondary"
        >
          📦 Orders
        </button>
      </div>
    </div>
  );
}
