import React from "react";

export default function AdminTabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "add", label: "Add Product", icon: "➕" },
    { id: "products", label: "All Products", icon: "📦" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  return (
    <div className="admin-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
