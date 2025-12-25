import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";

// Import components
import AdminHeader from "../components/AdminDashboard/AdminHeader";
import AdminTabNavigation from "../components/AdminDashboard/AdminTabNavigation";
import AnalyticsSection from "../components/AdminDashboard/AnalyticsSection";
import AddProductForm from "../components/AdminDashboard/AddProductForm";
import ProductsListSection from "../components/AdminDashboard/ProductsListSection";
import UsersListSection from "../components/AdminDashboard/UsersListSection";

// Import styles
import "../components/AdminDashboard/AdminDashboard.css";

export default function AdminDashboard({ user, showToast }) {
  const navigate = useNavigate();

  // Call ALL hooks at the top level - no early returns allowed before this
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  // Analytics data
  const [analytics, setAnalytics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [userAnalysis, setUserAnalysis] = useState([]);

  // Users list
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({
    totalUsers: 0,
    totalPages: 0,
    usersPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [usersSearchTerm, setUsersSearchTerm] = useState("");

  // Form data for adding products
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    img: "",
    details: "",
    avgRating: "",
    premium: false,
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
      const [analyticsRes, topProductsRes, userAnalysisRes] = await Promise.all(
        [
          api.getProductsDetails(),
          api.getTopRatedProducts(),
          api.getUsersAnalysis(),
        ]
      );

      if (analyticsRes.ok) {
        setAnalytics(analyticsRes.data.product[0] || {});
      }

      if (topProductsRes.ok) {
        setTopProducts(topProductsRes.product || []);
      }

      if (userAnalysisRes.ok) {
        setUserAnalysis(userAnalysisRes.data.analysis || []);
      }
    } catch (error) {
      showToast("Failed to load analytics data", "error");
    }
    setLoading(false);
  };

  const loadUserAnalysis = async () => {
    try {
      const res = await api.getUsersAnalysis();
      if (res.ok) {
        setUserAnalysis(res.data.analysis || []);
      }
    } catch (error) {
      console.error("Failed to load user analysis:", error);
    }
  };

  const loadUsers = async (page = 1) => {
    setUsersLoading(true);
    try {
      const pageParam = page - 1; // Convert 1-based page to 0-based for backend
      const params = {
        limit: 20,
        page: pageParam,
        sortBy: "-createdAt",
      };

      if (usersSearchTerm.trim()) {
        params.search = usersSearchTerm.trim();
      }

      const res = await api.getUsers(params);
      if (res.ok && Array.isArray(res.data?.users)) {
        setUsers(res.data.users);

        // Update pagination metadata if available in response
        if (res.data.pagination) {
          setUsersPagination({
            totalUsers: res.data.pagination.totalUsers || 0,
            totalPages: res.data.pagination.totalPages || 0,
            usersPerPage: res.data.pagination.usersPerPage || 20,
            hasNextPage: res.data.pagination.hasNextPage || false,
            hasPrevPage: res.data.pagination.hasPrevPage || false,
          });
        } else {
          // Fallback: estimate pagination if backend doesn't provide it
          const usersPerPage = 20;
          const receivedUsers = res.data.users.length;

          const estimatedTotalUsers =
            receivedUsers === usersPerPage
              ? page * usersPerPage + 1
              : page * usersPerPage - (usersPerPage - receivedUsers);
          const estimatedTotalPages = Math.max(
            1,
            Math.ceil(estimatedTotalUsers / usersPerPage)
          );

          setUsersPagination({
            totalUsers: estimatedTotalUsers,
            totalPages: estimatedTotalPages,
            usersPerPage,
            hasNextPage: receivedUsers === usersPerPage,
            hasPrevPage: page > 1,
          });
        }
      } else {
        setUsers([]);
        setUsersPagination({
          totalUsers: 0,
          totalPages: 0,
          usersPerPage: 20,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setUsersPagination({
        totalUsers: 0,
        totalPages: 0,
        usersPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUsersPageChange = (newPage) => {
    loadUsers(newPage);
    window.scrollTo(0, 0); // Scroll to top after pagination
  };

  const handleUpdateUserRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
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
    window.scrollTo(0, 0); // Scroll to top after pagination
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

  // Load users when on users tab
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab, usersSearchTerm]);

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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      // Prepare product data, only include optional fields if they have values
      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        img: formData.img.trim(),
      };

      // Add optional fields only if they have values
      if (formData.details.trim()) {
        productData.details = formData.details.trim();
      }
      if (formData.avgRating && !isNaN(parseFloat(formData.avgRating))) {
        productData.avgRating = parseFloat(formData.avgRating);
      }
      if (formData.premium) {
        productData.premium = formData.premium;
      }

      const res = await api.createProduct(productData);

      if (res.ok) {
        showToast(`Product "${formData.title}" added successfully`, "success");
        setFormData({
          title: "",
          price: "",
          description: "",
          img: "",
          details: "",
          avgRating: "",
          premium: false,
        });
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

  const handleClearForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      img: "",
      details: "",
      avgRating: "",
      premium: false,
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "analytics":
        return (
          <AnalyticsSection
            analytics={analytics}
            topProducts={topProducts}
            userAnalysis={userAnalysis}
            loading={loading}
          />
        );
      case "add":
        return (
          <AddProductForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            onClearForm={handleClearForm}
          />
        );
      case "products":
        return (
          <ProductsListSection
            products={products}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentPage={currentPage}
            pagination={pagination}
            handlePageChange={handlePageChange}
            productsLoading={productsLoading}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case "users":
        return (
          <UsersListSection
            users={users}
            searchTerm={usersSearchTerm}
            setSearchTerm={setUsersSearchTerm}
            currentPage={1}
            pagination={usersPagination}
            handlePageChange={handleUsersPageChange}
            usersLoading={usersLoading}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="admin-dashboard"
    >
      <AdminHeader />
      <AdminTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
