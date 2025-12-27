import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home({ onAdd, onAddToWishlist, user }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        // Fetch multiple data sources
        const [
          premiumRes,
          trendingRes,
          topRatedRes,
          discountedRes,
          purchasesRes,
        ] = await Promise.all([
          api.getProducts({
            premiumOnly: true,
            sortBy: "-avgRating",
            limit: 8,
          }),
          api.getProducts({ sortBy: "-avgRating", limit: 6 }),
          api.getTopRatedProducts(),
          api.getProducts({ sortBy: "-discount", limit: 8 }),
          user ? api.getUserPurchases() : Promise.resolve({ ok: false }),
        ]);

        if (!mounted) return;

        if (premiumRes.ok && Array.isArray(premiumRes.data?.products)) {
          const allProducts = premiumRes.data.products;
          setProducts(allProducts);
        }

        if (discountedRes.ok && Array.isArray(discountedRes.data?.products)) {
          // Filter products that have actual discounts
          const discounted = discountedRes.data.products.filter(
            (product) => product.discount > 0
          );
          setDiscountedProducts(discounted);
        }

        if (trendingRes.ok && Array.isArray(trendingRes.data?.products)) {
          setTrendingProducts(trendingRes.data.products);
        }

        if (topRatedRes.ok && topRatedRes.data) {
          setTopRatedProducts(topRatedRes.data);
        }

        if (purchasesRes.ok && Array.isArray(purchasesRes.data?.purchases)) {
          setUserStats({
            totalOrders: purchasesRes.data.purchases.length,
            totalSpent: purchasesRes.data.purchases.reduce(
              (sum, order) => sum + (order.total || 0),
              0
            ),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, [user]);

  const firstName = user?.name ? user.name.split(" ")[0] : "";

  // Mock categories data
  const categories = [
    { name: "Electronics", icon: "📱", color: "var(--accent-cyan)" },
    { name: "Fashion", icon: "👕", color: "var(--accent-purple)" },
    { name: "Home & Garden", icon: "🏠", color: "var(--accent-pink)" },
    { name: "Sports", icon: "⚽", color: "var(--accent-blue)" },
    { name: "Books", icon: "📚", color: "var(--accent-cyan)" },
    { name: "Beauty", icon: "💄", color: "var(--accent-purple)" },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="home-wrapper">
      {/* Desktop Hero Section */}
      <motion.div
        className="header-hero-class hero-desktop"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="hero-text-content">
          <h1 className="hero-title">
            Welcome back{firstName ? `, ${firstName}` : ""} <br />
            <span>discover colorful picks</span>
          </h1>
          <p className="hero-sub">
            Shop playful, durable gear with smooth motion and bright hues.
            Premium quality for SwiftCart explorers.
          </p>
        </div>
      </motion.div>

      {/* Mobile Hero Section */}
      <motion.div
        className="hero-mobile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="hero-mobile-content">
          <h1 className="hero-mobile-title">
            Welcome back{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="hero-mobile-sub">
            Discover colorful picks and premium gear
          </p>
        </div>
      </motion.div>

      {/* Categories Showcase */}
      <motion.section
        className="categories-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="section-header">
          <h3 className="section-title">Shop by Category</h3>
          <a href="/shop" className="text-link">
            See all →
          </a>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="category-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h4 className="category-name">{category.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trending Now Section */}
      <motion.section
        className="product-section trending-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="section-header">
          <h3 className="section-title">
            🔥 Trending Now
            <span className="trending-badge">Hot</span>
          </h3>
          <a href="/shop" className="text-link">
            See all →
          </a>
        </div>

        <div className="grid trending-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCard key={`th-${i}`} loading={true} />
              ))
            : trendingProducts
                .slice(0, 4)
                .map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onAdd={onAdd}
                    onAddToWishlist={onAddToWishlist}
                  />
                ))}
        </div>
      </motion.section>

      {/* Premium Products Section */}
      <motion.section className="product-section">
        <div className="section-header">
          <h3 className="section-title">⭐ Premium Products</h3>
          <a href="/shop" className="text-link">
            See all →
          </a>
        </div>

        <div className="grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCard key={`pp-${i}`} loading={true} />
              ))
            : products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onAdd={onAdd}
                  onAddToWishlist={onAddToWishlist}
                />
              ))}
        </div>
      </motion.section>

      {/* Deals of the Day Section - Only show if there are discounted products */}
      {discountedProducts.length > 0 && (
        <motion.section
          className="deals-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="section-header">
            <h3 className="section-title">
              ⚡ Deals of the Day
              <span className="deal-timer">⏰ Limited Time</span>
            </h3>
            <a href="/shop" className="text-link">
              See all deals →
            </a>
          </div>

          <div className="deals-grid">
            {discountedProducts.slice(0, 4).map((product, index) => {
              const discountedPrice =
                product.price * (1 - product.discount / 100);
              return (
                <motion.div
                  key={`deal-${product._id}`}
                  className="deal-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="deal-badge">-{product.discount}%</div>
                  <img
                    src={product.img}
                    alt={product.title}
                    className="deal-image"
                  />
                  <div className="deal-content">
                    <h4 className="deal-title">{product.title}</h4>
                    <div className="deal-pricing">
                      <span className="deal-price">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      <span className="deal-original">${product.price}</span>
                    </div>
                    <button
                      className="deal-button"
                      onClick={() => onAdd && onAdd(product)}
                    >
                      Grab Deal
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Top Rated Section */}
      {topRatedProducts.length > 0 && (
        <motion.section
          className="product-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="section-header">
            <h3 className="section-title">🏆 Top Rated Products</h3>
            <a href="/shop" className="text-link">
              See all →
            </a>
          </div>

          <div className="grid">
            {topRatedProducts.slice(0, 6).map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAdd={onAdd}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
