import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import * as api from "../services/api";

export default function ProductList({ onAdd, onAddToWishlist }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalProducts: 0,
    totalPages: 0,
    productsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchProducts = useCallback(async (currentFilters = {}) => {
    setLoading(true);
    try {
      // Convert 1-based page to 0-based for backend
      const pageParam = (currentFilters.page || 1) - 1;
      const apiFilters = { ...currentFilters, page: pageParam };

      const res = await api.getProducts(apiFilters);
      if (res.ok && Array.isArray(res.data?.products)) {
        setProducts(res.data.products);

        // Update pagination metadata if available in response
        if (res.data.pagination) {
          setPagination({
            totalProducts: res.data.pagination.totalProducts || 0,
            totalPages: res.data.pagination.totalPages || 0,
            productsPerPage: res.data.pagination.productsPerPage || 12,
            hasNextPage: res.data.pagination.hasNextPage || false,
            hasPrevPage: res.data.pagination.hasPrevPage || false,
          });
        } else {
          // Fallback: estimate pagination if backend doesn't provide it
          const productsPerPage = currentFilters.limit || 12;
          const receivedProducts = res.data.products.length;

          // If we got a full page of products, assume there might be more pages
          // If we got fewer products, this is likely the last page
          const totalProducts =
            receivedProducts === productsPerPage
              ? (currentFilters.page || 1) * productsPerPage + 1 // Estimate more products
              : receivedProducts;
          const totalPages = Math.max(
            1,
            Math.ceil(totalProducts / productsPerPage)
          );

          setPagination({
            totalProducts,
            totalPages,
            productsPerPage,
            hasNextPage: receivedProducts === productsPerPage && totalPages > 1,
            hasPrevPage: (currentFilters.page || 1) > 1,
          });
        }
      } else {
        setProducts([]);
        setPagination({
          totalProducts: 0,
          totalPages: 0,
          productsPerPage: 12,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const filtersWithPage = { ...filters, page: currentPage };
    fetchProducts(filtersWithPage);
    return () => (mounted = false);
  }, [fetchProducts, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    const filtersWithPage = { ...newFilters, page: 1 };
    fetchProducts(filtersWithPage);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1); // Reset to first page when clearing filters
    fetchProducts({ page: 1 });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top after pagination
  };

  return (
    <div>
      <h2 style={{ marginTop: 8 }}>All Products</h2>
      <p className="small">
        A colorful selection of items with animated interactions.
      </p>

      <FilterPanel
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <div className="grid" style={{ marginTop: 12 }}>
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCard key={`ph-${i}`} loading={true} />
          ))
        ) : products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAdd={onAdd}
              onAddToWishlist={onAddToWishlist}
            />
          ))
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "var(--text-secondary)",
              fontSize: "16px",
            }}
          >
            {Object.keys(filters).some(
              (key) =>
                filters[key] && filters[key] !== "" && filters[key] !== false
            )
              ? "No products found matching your filters."
              : "No products available."}
          </div>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
      />
    </div>
  );
}
