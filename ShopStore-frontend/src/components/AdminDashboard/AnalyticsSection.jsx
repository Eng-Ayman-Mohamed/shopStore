import React from "react";

export default function AnalyticsSection({
  analytics,
  topProducts,
  userAnalysis,
  loading,
}) {
  const getUserCounts = () => {
    if (!userAnalysis || !Array.isArray(userAnalysis)) {
      return { admin: 0, user: 0, total: 0 };
    }

    const adminCount =
      userAnalysis.find((item) => item._id === "admin")?.numUsers || 0;
    const userCount =
      userAnalysis.find((item) => item._id === "user")?.numUsers || 0;
    const total = adminCount + userCount;

    return { admin: adminCount, user: userCount, total };
  };

  const userCounts = getUserCounts();

  const renderAnalytics = () => (
    <div className="admin-analytics">
      {/* Product Analytics */}
      <div className="analytics-section">
        <h2>Product Analytics</h2>
        <div className="analytics-grid">
          <div className="card analytics-card">
            <h3>{analytics?.numProducts || 0}</h3>
            <p>Total Products</p>
          </div>

          <div className="card analytics-card">
            <h3>${analytics?.avgPrice?.toFixed(2) || "0.00"}</h3>
            <p>Average Price</p>
          </div>

          <div className="card analytics-card">
            <h3>{analytics?.avgRating?.toFixed(1) || "0.0"}</h3>
            <p>Average Rating</p>
          </div>

          <div className="card analytics-card">
            <h3>{analytics?.numPremium || 0}</h3>
            <p>Premium Products</p>
          </div>
        </div>
      </div>

      {/* User Analytics */}
      <div className="analytics-section">
        <h2>User Analytics</h2>
        <div className="analytics-grid">
          <div className="card analytics-card">
            <h3>{userCounts.total}</h3>
            <p>Total Users</p>
          </div>

          <div className="card analytics-card">
            <h3>{userCounts.admin}</h3>
            <p>Admins</p>
          </div>

          <div className="card analytics-card">
            <h3>{userCounts.user}</h3>
            <p>Regular Users</p>
          </div>

          <div className="card analytics-card">
            <h3>
              {userCounts.total > 0
                ? ((userCounts.admin / userCounts.total) * 100).toFixed(1)
                : "0"}
              %
            </h3>
            <p>Admin Percentage</p>
          </div>
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="card top-products-section">
          <h3>Top Rated Products</h3>
          <div className="top-products-grid">
            {topProducts.slice(0, 6).map((product) => (
              <div key={product._id} className="top-product-card">
                <img
                  src={product.img}
                  alt={product.title}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <h4>{product.title}</h4>
                <p>⭐ {product.avgRating?.toFixed(1) || "0.0"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="analytics-loading">
        <span className="spinner" />
      </div>
    );
  }

  return renderAnalytics();
}
