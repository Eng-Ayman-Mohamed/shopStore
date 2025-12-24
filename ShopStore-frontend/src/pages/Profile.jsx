import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import ProfileHeader from "./components/ProfileHeader";
import InfoSection from "./components/InfoSection";
import InfoItem from "./components/InfoItem";
import QuickActions from "./components/QuickActions";

export default function Profile({ user }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="card form">
        <h3>No user signed in</h3>
        <p className="small">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="card form profile-container">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Personal Information Section */}
      <InfoSection title="Personal Information" icon="📋">
        <div className="info-grid">
          <InfoItem label="Full name" value={user.name} variant="default" />
          <InfoItem label="Email" value={user.email} variant="purple" />
          {user.phone && (
            <InfoItem label="Phone" value={user.phone} variant="pink" />
          )}
          {user.address && (
            <InfoItem label="Address" value={user.address} variant="green" />
          )}
        </div>
      </InfoSection>

      {/* Account Activity Section */}
      <InfoSection title="Account Activity" icon="⏰" variant="purple">
        <div className="activity-item">
          <span className="activity-label">Member since:</span>
          <strong className="activity-value">
            {new Date().toLocaleDateString()}
          </strong>
        </div>
        <div className="activity-item">
          <span className="activity-label">Account status:</span>
          <strong className="activity-status">✓ Active</strong>
        </div>
      </InfoSection>

      {/* Avatar Settings Section */}
      <InfoSection title="Avatar Settings" icon="🎨" variant="pink">
        <div className="avatar-preview">
          <div className="avatar-preview-info">
            <h4>Avatar type:</h4>
            <p>
              <strong>
                {user.avatar
                  ? "📷 Custom Image"
                  : user.avatarEmoji
                  ? `😊 Emoji (${user.avatarEmoji})`
                  : "🎨 Color"}
              </strong>
            </p>
          </div>
        </div>
        {user.avatarColor && !user.avatar && (
          <div className="color-indicator">
            <span className="color-indicator-label">Color:</span>
            <div
              className="color-dot"
              style={{ background: user.avatarColor }}
            />
          </div>
        )}
      </InfoSection>

      {/* Quick Actions */}
      <QuickActions navigate={navigate} />
    </div>
  );
}
