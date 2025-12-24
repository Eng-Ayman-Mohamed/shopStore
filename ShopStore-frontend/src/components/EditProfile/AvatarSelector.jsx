import React from "react";

const AVATAR_COLORS = [
  "#00d9ff", // cyan
  "#a78bfa", // purple
  "#f472b6", // pink
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // amber
];

const AVATAR_EMOJIS = ["👨", "👩", "🧑", "🎨", "⭐", "🚀", "💎", "🌟"];

export default function AvatarSelector({
  formData,
  avatarType,
  setAvatarType,
  onAvatarUpload,
  onColorSelect,
  onEmojiSelect,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarUpload({
          file,
          dataUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarPreview = () => {
    const { avatar, avatarColor, avatarEmoji } = formData;

    if (avatarType === "image" && avatar) {
      return {
        backgroundImage: `url(${avatar})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontSize: "0",
      };
    }

    if (avatarType === "emoji" && avatarEmoji) {
      return {
        background:
          "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
        fontSize: "32px",
      };
    }

    // Default to color or first color
    return {
      background: avatarColor || AVATAR_COLORS[0],
      fontSize: "32px",
    };
  };

  return (
    <div className="avatar-section">
      {/* Avatar Preview */}
      <div className="avatar-preview">
        <div className="avatar-preview-image" style={getAvatarPreview()}>
          {avatarType === "emoji" && formData.avatarEmoji}
        </div>
        <div className="avatar-preview-info">
          <h3>Profile picture</h3>
          <p>
            {avatarType === "image"
              ? "Custom image"
              : avatarType === "emoji"
              ? "Emoji avatar"
              : "Color avatar"}
          </p>
        </div>
      </div>

      {/* Avatar Type Selection */}
      <div className="avatar-type-selector">
        <label>Choose avatar type</label>
        <div className="avatar-type-buttons">
          <button
            type="button"
            className={`avatar-type-button ${
              avatarType === "image" ? "image" : ""
            }`}
            onClick={() => setAvatarType("image")}
          >
            📷 Image
          </button>
          <button
            type="button"
            className={`avatar-type-button ${
              avatarType === "emoji" ? "emoji" : ""
            }`}
            onClick={() => setAvatarType("emoji")}
          >
            😊 Emoji
          </button>
          <button
            type="button"
            className={`avatar-type-button ${
              avatarType === "color" ? "color" : ""
            }`}
            onClick={() => setAvatarType("color")}
          >
            🎨 Color
          </button>
        </div>
      </div>

      {/* Image Upload */}
      {avatarType === "image" && (
        <div className="file-upload">
          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      )}

      {/* Emoji Selection */}
      {avatarType === "emoji" && (
        <div className="emoji-selection">
          <label>Choose emoji</label>
          <div className="emoji-grid">
            {AVATAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-button ${
                  formData.avatarEmoji === emoji ? "selected" : ""
                }`}
                onClick={() => onEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {avatarType === "color" && (
        <div className="color-selection">
          <label>Choose color</label>
          <div className="color-picker">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-button ${
                  formData.avatarColor === color ? "selected" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
