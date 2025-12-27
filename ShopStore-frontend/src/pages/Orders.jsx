import React, { useState, useEffect } from "react";
import { getUserPurchases } from "../services/api";
import "./Orders.css";

export default function Orders() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserPurchases();

      if (result.ok) {
        // Extract purchases from the API response
        const purchasesData = result.data.purchases || [];
        setPurchases(purchasesData);
      } else {
        setError(result.error || "Failed to fetch purchases");
      }
    } catch (err) {
      setError("Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOrderTotal = (purchase) => {
    // Use the total field from the API response, fallback to calculated total
    if (purchase.total !== undefined) {
      return purchase.total;
    }
    // Fallback calculation if total is not provided
    if (purchase.products && purchase.products.length > 0) {
      return purchase.products.reduce((total, product) => {
        return total + (product.price || 0);
      }, 0);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="card">
        <h3>Your Orders</h3>
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p className="small">Loading your purchases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card form">
        <h3>Your Orders</h3>
        <div className="error-state">
          <p className="small">Error: {error}</p>
          <button
            className="btn"
            onClick={fetchPurchases}
            style={{ marginTop: "12px", padding: "8px 16px", fontSize: "14px" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!purchases.length) {
    return (
      <div className="card form">
        <h3>Your Orders</h3>
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h4>No orders yet</h4>
          <p className="small">
            You haven't placed any orders. Start shopping to see your purchase
            history here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="orders-header">
        <h3>Your Orders</h3>
        <p className="small">
          {purchases.length} purchase{purchases.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="orders-grid">
        {purchases.map((purchase, idx) => {
          // Generate unique keys for purchases and products
          const purchaseKey =
            purchase._id ||
            `purchase-${idx}-${purchase.createdAt || Date.now()}`;

          return (
            <div key={purchaseKey} className="purchase-card">
              <div className="purchase-header">
                <div className="purchase-info">
                  <div className="purchase-id">
                    Order #{purchase._id?.slice(-8) || idx + 1}
                  </div>
                  <div className="purchase-date">
                    {formatDate(purchase.createdAt || Date.now())}
                  </div>
                </div>
                <div className="purchase-total">
                  ${calculateOrderTotal(purchase).toFixed(2)}
                </div>
              </div>

              <div className="products-list">
                {purchase.products &&
                  purchase.products.map((product, productIdx) => {
                    // Generate unique keys for products within each purchase
                    const productKey =
                      product._id ||
                      `product-${idx}-${productIdx}-${
                        product.title || "unknown"
                      }`;

                    return (
                      <div key={productKey} className="product-item">
                        <div className="product-image">
                          <img
                            src={product.img || "https://placehold.co/400"}
                            alt={product.title || "Product"}
                            onError={(e) => {
                              e.target.src = "https://placehold.co/400";
                            }}
                          />
                        </div>
                        <div className="product-details">
                          <div className="product-name">
                            {product.title || "Product Name"}
                          </div>
                          <div className="product-price">
                            ${(product.price || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
