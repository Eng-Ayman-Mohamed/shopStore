import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanelFixed";
import Pagination from "../components/Pagination";
import * as api from "../services/api";
import "./ProductList.css";

export default function ProductList({ onAdd, onAddToWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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

  // Combined effect: Initialize filters AND fetch products
  useEffect(() => {
    const category = searchParams.get("category");
    const initialFilters = {};

    if (category) {
      initialFilters.category = category;
    }

    setFilters(initialFilters);

    // Fetch products immediately with the current filters and current page
    const filtersWithPage = { ...initialFilters, page: currentPage };
    fetchProducts(filtersWithPage);
  }, [searchParams, currentPage]); // Added currentPage dependency

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
          const currentPageNum = currentFilters.page || 1;

          // Simple logic: if we got a full page, assume there might be more
          // if we got less, this is likely the last page or an empty category
          let totalPages = currentPageNum; // Start with current page as minimum

          if (receivedProducts === 0) {
            // No products - likely empty category or past last page
            totalPages = 1;
          } else if (receivedProducts < productsPerPage) {
            // Partial page - likely last page
            totalPages = currentPageNum;
          } else {
            // Full page - assume there might be more pages
            totalPages = currentPageNum + 1;
          }

          console.log("Fallback pagination:", {
            receivedProducts,
            productsPerPage,
            currentPage: currentPageNum,
            totalPages,
            hasNext:
              receivedProducts === productsPerPage &&
              totalPages > currentPageNum,
            hasPrev: currentPageNum > 1,
          });

          setPagination({
            totalProducts: receivedProducts, // This is an estimate
            totalPages,
            productsPerPage,
            hasNextPage:
              receivedProducts === productsPerPage &&
              totalPages > currentPageNum,
            hasPrevPage: currentPageNum > 1,
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

  // Removed the second useEffect - combined effect above handles all fetching

  const handleFilterChange = useCallback(
    (newFilters) => {
      // Update URL to sync with category changes
      setSearchParams(
        (currentParams) => {
          const newSearchParams = new URLSearchParams(currentParams);

          if (newFilters.category) {
            newSearchParams.set("category", newFilters.category);
          } else {
            newSearchParams.delete("category");
          }

          return newSearchParams;
        },
        { replace: true }
      );

      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
      // Fetch products with new filters
      fetchProducts({ ...newFilters, page: 1 });
    },
    // Only depend on fetchProducts to prevent recreation
    [fetchProducts]
  );

  const handleClearFilters = useCallback(() => {
    // Clear URL parameters
    setSearchParams({}, { replace: true });

    setFilters({});
    setCurrentPage(1); // Reset to first page when clearing filters
    // Fetch products with cleared filters
    fetchProducts({ page: 1 });
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top after pagination
  };

  // Get the current category from filters for display
  const currentCategory = filters.category;
  const pageTitle = currentCategory
    ? `${currentCategory} Products`
    : "All Products";

  return (
    <div>
      <h2 style={{ marginTop: 8 }}>{pageTitle}</h2>

      <FilterPanel
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
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
