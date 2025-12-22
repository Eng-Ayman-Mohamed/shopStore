import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import * as api from "../services/api";

export default function ProductList({ onAdd, onAddToWishlist }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getProducts()
      .then((res) => {
        if (!mounted) return;
        if (res.ok && Array.isArray(res.data?.products)) {
          setProducts(res.data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 8 }}>All Products</h2>
      <p className="small">
        A colorful selection of items with animated interactions.
      </p>
      <div className="grid" style={{ marginTop: 12 }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCard key={`ph-${i}`} loading={true} />
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
    </div>
  );
}
