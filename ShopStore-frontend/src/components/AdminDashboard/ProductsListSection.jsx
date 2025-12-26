import React from "react";
import Pagination from "../Pagination";
import ProductCardAdmin from "./ProductCardAdmin";

export default function ProductsListSection({
  products,
  searchTerm,
  setSearchTerm,
  currentPage,
  pagination,
  handlePageChange,
  productsLoading,
  onDeleteProduct,
  onUpdateDiscount,
}) {
  const renderSearchControls = () => (
    <div className="search-controls">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search products by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      {searchTerm.trim() && (
        <button
          onClick={() => setSearchTerm("")}
          className="clear-filter-button"
        >
          Clear Filter
        </button>
      )}
    </div>
  );

  const renderSearchResultsCounter = () => (
    <div className="search-results-counter">
      <p>
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
  );

  const renderProductsGrid = () => (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCardAdmin
          key={product._id}
          product={product}
          onDelete={onDeleteProduct}
          onUpdateDiscount={onUpdateDiscount}
        />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="empty-state">
      <p>
        {searchTerm.trim()
          ? "No products found matching your search"
          : "No products found"}
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="loading-state">
      <span className="spinner" />
    </div>
  );

  const renderPagination = () => {
    if (
      pagination.totalPages > 1 ||
      pagination.hasPrevPage ||
      pagination.hasNextPage
    ) {
      return (
        <div className="pagination-wrapper">
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
    return null;
  };

  return (
    <div className="card">
      <h3 className="products-list-header">All Products</h3>

      {renderSearchControls()}
      {renderSearchResultsCounter()}

      {products.length === 0 && !productsLoading ? (
        renderEmptyState()
      ) : (
        <>
          {renderProductsGrid()}
          {productsLoading && renderLoadingState()}
          {renderPagination()}
        </>
      )}
    </div>
  );
}
