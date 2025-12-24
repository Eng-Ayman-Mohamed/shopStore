import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import * as api from "../services/api";

export default function Home({ onAdd, onAddToWishlist, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // Fetch only premium products for the home page
    api
      .getProducts({ premiumOnly: true, sortBy: "-avgRating" })
      .then((res) => {
        if (!mounted) return;
        if (res.ok && Array.isArray(res.data?.products))
          setProducts(res.data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div>
      {/* Desktop Hero Section */}
      <motion.div
        className="header-hero-class hero-desktop"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ flex: 1 }}>
          <div className="hero-title">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} —
            discover colorful picks
          </div>
          <div className="hero-sub">
            Shop playful, durable gear with smooth motion and bright hues.
          </div>
        </div>
        <div style={{ minWidth: 260 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
            Hot picks
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {loading
              ? [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="placeholder placeholder-img"
                    style={{ width: 72, height: 72, borderRadius: 10 }}
                  />
                ))
              : products.slice(0, 3).map((p) => (
                  <img
                    key={p._id}
                    src={p.img}
                    alt=""
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      borderRadius: 10,
                      boxShadow: "var(--img-shadow)",
                    }}
                  />
                ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile Hero Section */}
      <motion.div
        className="hero-mobile"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-mobile-content">
          <div className="hero-mobile-title">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </div>
          <div className="hero-mobile-sub">
            Discover colorful picks and premium gear
          </div>

          {/* Mobile Hot Picks */}
          <div className="hero-mobile-picks">
            <div className="hero-mobile-picks-header">
              <span>🔥 Hot picks</span>
              <a href="/shop" className="hero-mobile-see-all">
                See all →
              </a>
            </div>
            <div className="hero-mobile-picks-grid">
              {loading
                ? [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="placeholder placeholder-img"
                      style={{ width: 80, height: 80, borderRadius: 12 }}
                    />
                  ))
                : products
                    .slice(0, 3)
                    .map((p) => (
                      <img
                        key={p._id}
                        src={p.img}
                        alt=""
                        className="hero-mobile-pick-img"
                      />
                    ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>Premium products</h3>
          <a
            href="/shop"
            style={{
              color: "var(--accent-cyan)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            See all →
          </a>
        </div>

        <div className="grid" style={{ marginTop: 12 }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCard key={`ph-${i}`} loading={true} />
              ))
            : products
                .slice(0, 8)
                .map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onAdd={onAdd}
                    onAddToWishlist={onAddToWishlist}
                  />
                ))}
        </div>
      </div>
    </div>
  );
}
