import React from "react";

export default function ProfileHeader({ user }) {
  const getAvatarContent = () => {
    if (user.avatar) {
      return null; // Will be handled by CSS background image
    }

    if (user.avatarEmoji) {
      return user.avatarEmoji;
    }

    return (
      user.name
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getAvatarStyles = () => {
    const styles = {};

    if (user.avatar) {
      styles.backgroundImage = `url(${user.avatar})`;
      styles.backgroundSize = "cover";
      styles.backgroundPosition = "center";
      styles.fontSize = 0;
      styles.className = "profile-avatar has-background";
    } else if (user.avatarEmoji) {
      styles.fontSize = "32px";
      styles.lineHeight = 1;
    } else {
      styles.background =
        user.avatarColor ||
        "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))";
    }

    return styles;
  };

  return (
    <div className="profile-card">
      <div className="profile-avatar" style={getAvatarStyles()}>
        {getAvatarContent()}
      </div>
      <div className="profile-info">
        <h3>{user.name || "User"}</h3>
        <p>{user.email || ""}</p>
      </div>
    </div>
  );
}
