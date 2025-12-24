import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import Pagination from "../components/Pagination";

export default function AdminDashboard({ user, showToast }) {
  const navigate = useNavigate();

  // Call ALL hooks at the top level - no early returns allowed before this
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  // Analytics data
  const [analytics, setAnalytics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  // Form data for adding products
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    img: "",
  });

  // Products list
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalProducts: 0,
    totalPages: 0,
    productsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Define functions before useEffect hooks to avoid temporal dead zone errors
  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsRes, topProductsRes] = await Promise.all([
        api.getProductsDetails(),
        api.getTopRatedProducts(),
      ]);

      if (analyticsRes.ok) {
        setAnalytics(analyticsRes.data.product[0] || {});
      }

      if (topProductsRes.ok) {
        setTopProducts(topProductsRes.product || []);
      }
    } catch (error) {
      showToast("Failed to load analytics data", "error");
    }
    setLoading(false);
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      // Convert 1-based page to 0-based for backend
      const pageParam = currentPage - 1;
      const params = {
        limit: 20,
        page: pageParam,
        sortBy: "-createdAt",
      };

      // Add search term if provided
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const res = await api.getProducts(params);
      if (res.ok && Array.isArray(res.data?.products)) {
        setProducts(res.data.products);

        // Update pagination metadata if available in response
        if (res.data.pagination) {
          setPagination({
            totalProducts: res.data.pagination.totalProducts || 0,
            totalPages: res.data.pagination.totalPages || 0,
            productsPerPage: res.data.pagination.productsPerPage || 20,
            hasNextPage: res.data.pagination.hasNextPage || false,
            hasPrevPage: res.data.pagination.hasPrevPage || false,
          });
        } else {
          // Fallback: estimate pagination if backend doesn't provide it
          const productsPerPage = 20;
          const receivedProducts = res.data.products.length;

          // If we got a full page of products, assume there might be more pages
          // If we got fewer products, this is likely the last page
          const estimatedTotalProducts =
            receivedProducts === productsPerPage
              ? currentPage * productsPerPage + 1 // Estimate more products
              : currentPage * productsPerPage -
                (productsPerPage - receivedProducts); // Calculate actual total
          const estimatedTotalPages = Math.max(
            1,
            Math.ceil(estimatedTotalProducts / productsPerPage)
          );

          setPagination({
            totalProducts: estimatedTotalProducts,
            totalPages: estimatedTotalPages,
            productsPerPage,
            hasNextPage: receivedProducts === productsPerPage,
            hasPrevPage: currentPage > 1,
          });
        }

        console.log("Products API Response:", {
          products: res.data.products?.length || 0,
          pagination: res.data.pagination || "none",
        });
      } else {
        setProducts([]);
        setPagination({
          totalProducts: 0,
          totalPages: 0,
          productsPerPage: 20,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setPagination({
        totalProducts: 0,
        totalPages: 0,
        productsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setProductsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, []);

  // Load products when on products tab
  useEffect(() => {
    if (activeTab === "products") {
      loadProducts();
    }
  }, [activeTab, currentPage, searchTerm]);

  // Check admin access after all hooks are called
  if (!user || user.role !== "admin") {
    return (
      <div className="card form">
        <h3>Access Denied</h3>
        <p className="small">You need admin privileges to access this page.</p>
        <button
          className="btn"
          onClick={() => navigate("/")}
          style={{ marginTop: 12 }}
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim()) {
      showToast("Please enter product title", "error");
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      showToast("Please enter valid price", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Please enter product description", "error");
      return;
    }
    if (!formData.img.trim()) {
      showToast("Please enter image URL", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.createProduct({
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        img: formData.img.trim(),
      });

      if (res.ok) {
        showToast(`Product "${formData.title}" added successfully`, "success");
        setFormData({ title: "", price: "", description: "", img: "" });
        // Refresh products list if on products tab
        if (activeTab === "products") {
          setCurrentPage(1);
          // Force reload of products with new page
          setTimeout(() => loadProducts(), 100);
        }
        // Refetch analytics data after product addition
        loadAnalytics();
      } else {
        showToast(res.error || "Failed to add product", "error");
      }
    } catch (error) {
      showToast("Failed to add product", "error");
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    try {
      const res = await api.deleteProduct(productId);
      if (res.ok) {
        showToast(`Product "${productTitle}" deleted successfully`, "success");
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        // Refetch analytics data after product deletion
        loadAnalytics();
      } else {
        showToast(res.error || "Failed to delete product", "error");
      }
    } catch (error) {
      showToast("Failed to delete product", "error");
    }
  };

  const renderAnalytics = () => (
    <div className="admin-analytics">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
          <h3 style={{ margin: 0, color: "var(--primary)" }}>
            {analytics?.numProducts || 0}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)" }}>
            Total Products
          </p>
        </div>

        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
          <h3 style={{ margin: 0, color: "var(--primary)" }}>
            ${analytics?.avgPrice?.toFixed(2) || "0.00"}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)" }}>
            Average Price
          </p>
        </div>

        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
          <h3 style={{ margin: 0, color: "var(--primary)" }}>
            {analytics?.avgRating?.toFixed(1) || "0.0"}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)" }}>
            Average Rating
          </p>
        </div>

        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
          <h3 style={{ margin: 0, color: "var(--primary)" }}>
            {analytics?.numPremium || 0}
          </h3>
          <p style={{ margin: "8px 0 0 0", color: "var(--text-secondary)" }}>
            Premium Products
          </p>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="card" style={{ padding: "20px" }}>
          <h3 style={{ marginTop: 0 }}>Top Rated Products</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            {topProducts.slice(0, 6).map((product) => (
              <div
                key={product._id}
                style={{
                  border: "1px solid var(--card-border)",
                  borderRadius: "8px",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <img
                  src={product.img}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <h4 style={{ margin: "5px 0", fontSize: "14px" }}>
                  {product.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}
                >
                  ⭐ {product.avgRating?.toFixed(1) || "0.0"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAddProduct = () => (
    <div className="card form" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
            Product Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Aurora Sneakers"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              fontSize: 14,
              background: "var(--input-bg)",
              color: "var(--text-primary)",
              boxSizing: "border-box",
            }}
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 89.99"
            step="0.01"
            min="0"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              fontSize: 14,
              background: "var(--input-bg)",
              color: "var(--text-primary)",
              boxSizing: "border-box",
            }}
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Lightweight, responsive sneakers with a vibrant gradient finish for everyday comfort."
            rows="3"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              fontSize: 14,
              background: "var(--input-bg)",
              color: "var(--text-primary)",
              boxSizing: "border-box",
              fontFamily: "inherit",
              resize: "vertical",
            }}
            disabled={loading}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
            Image URL *
          </label>
          <input
            type="url"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="e.g., https://example.com/image.jpg"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              fontSize: 14,
              background: "var(--input-bg)",
              color: "var(--text-primary)",
              boxSizing: "border-box",
            }}
            disabled={loading}
          />
          {formData.img && (
            <div style={{ marginTop: 12 }}>
              <p className="small" style={{ marginBottom: 8 }}>
                Preview:
              </p>
              <img
                src={formData.img}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  borderRadius: 8,
                  border: "1px solid var(--card-border)",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              flex: 1,
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Adding...
              </span>
            ) : (
              "Add Product"
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({ title: "", price: "", description: "", img: "" })
            }
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );

  const renderProductsList = () => (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>All Products</h3>

      {/* Search and Filter Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              fontSize: 14,
              background: "var(--input-bg)",
              color: "var(--text-primary)",
              boxSizing: "border-box",
            }}
          />
        </div>
        {searchTerm.trim() && (
          <button
            onClick={() => setSearchTerm("")}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Search Results Counter */}
      {(searchTerm.trim() || products.length > 0 || productsLoading) && (
        <div style={{ marginBottom: 15 }}>
          <p
            style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}
          >
            {productsLoading ? (
              "Loading products..."
            ) : searchTerm.trim() ? (
              <>
                Showing <strong>{products.length}</strong> result
                {products.length !== 1 ? "s" : ""} for "{searchTerm.trim()}"
                {pagination.totalProducts > products.length &&
                  ` (${pagination.totalProducts} total)`}
              </>
            ) : (
              <>
                Showing <strong>{products.length}</strong> product
                {products.length !== 1 ? "s" : ""}
                {pagination.totalProducts > products.length &&
                  ` of ${pagination.totalProducts} total`}
              </>
            )}
          </p>
        </div>
      )}

      {products.length === 0 && !productsLoading ? (
        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          {searchTerm.trim()
            ? "No products found matching your search"
            : "No products found"}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                border: "1px solid var(--card-border)",
                borderRadius: 8,
                padding: 15,
                position: "relative",
              }}
            >
              <img
                src={product.img}
                alt={product.title}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 6,
                  marginBottom: 10,
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <h4 style={{ margin: "5px 0", fontSize: 16 }}>{product.title}</h4>

              <p
                style={{
                  margin: "5px 0",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "var(--primary)",
                }}
              >
                ${product.price?.toFixed(2)}
              </p>

              <p
                style={{
                  margin: "5px 0",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  ⭐ {product.avgRating?.toFixed(1) || "0.0"}
                </span>

                <button
                  onClick={() =>
                    handleDeleteProduct(product._id, product.title)
                  }
                  style={{
                    padding: "5px 10px",
                    borderRadius: 4,
                    border: "1px solid #e74c3c",
                    background: "none",
                    color: "#e74c3c",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {productsLoading && (
        <div style={{ textAlign: "center", padding: 20 }}>
          <span
            style={{
              width: 20,
              height: 20,
              border: "2px solid var(--card-border)",
              borderTop: "2px solid var(--primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              display: "inline-block",
            }}
          />
        </div>
      )}

      {/* Pagination */}
      {(pagination.totalPages > 1 ||
        pagination.hasPrevPage ||
        pagination.hasNextPage) && (
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
          />
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "add", label: "Add Product", icon: "➕" },
    { id: "products", label: "All Products", icon: "📦" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 30,
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 32 }}>Admin Dashboard</h1>
        <p style={{ margin: "10px 0 0 0", color: "var(--text-secondary)" }}>
          Manage your shop products and view analytics
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: 5,
          marginBottom: 30,
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 20px",
              border: "none",
              background:
                activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "white" : "var(--text-primary)",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {loading && activeTab === "analytics" ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  border: "3px solid var(--card-border)",
                  borderTop: "3px solid var(--primary)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }}
              />
            </div>
          ) : (
            <>
              {activeTab === "analytics" && renderAnalytics()}
              {activeTab === "add" && renderAddProduct()}
              {activeTab === "products" && renderProductsList()}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .admin-analytics .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .admin-analytics .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </motion.div>
  );
}
