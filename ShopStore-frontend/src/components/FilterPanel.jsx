import React, { useState } from "react";

export default function FilterPanel({ onFilterChange, onClearFilters }) {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    premiumOnly: false,
    sortBy: "price",
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortValue) => {
    const newFilters = { ...filters, sortBy: sortValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      minPrice: "",
      maxPrice: "",
      minRating: "",
      premiumOnly: false,
      sortBy: "price",
    };
    setFilters(defaultFilters);
    onClearFilters();
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  // Desktop Filter Panel
  const DesktopFilterPanel = () => (
    <div
      className="filter-panel-desktop"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "24px",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            color: "var(--text-primary)",
            fontSize: "16px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Filter Products
        </h3>
        <button
          onClick={clearFilters}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid var(--card-border)",
            background: "transparent",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(239, 68, 68, 0.1)";
            e.target.style.color = "var(--accent-pink)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "var(--text-secondary)";
          }}
        >
          Clear All
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Price Range */}
        <div className="field">
          <label
            style={{
              color: "var(--text-secondary)",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            Price Range
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleInputChange("minPrice", e.target.value)}
                className="input"
                style={{
                  width: "100%",
                  fontSize: "13px",
                  padding: "10px 12px",
                }}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                className="input"
                style={{
                  width: "100%",
                  fontSize: "13px",
                  padding: "10px 12px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="field">
          <label
            style={{
              color: "var(--text-secondary)",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            Minimum Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleInputChange("minRating", e.target.value)}
            className="input"
            style={{ fontSize: "13px" }}
          >
            <option value="">Any Rating</option>
            <option value="1">1+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="field">
          <label
            style={{
              color: "var(--text-secondary)",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="input"
            style={{ fontSize: "13px" }}
          >
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-avgRating">Rating: High to Low</option>
            <option value="avgRating">Rating: Low to High</option>
            <option value="title">Title: A to Z</option>
            <option value="-title">Title: Z to A</option>
          </select>
        </div>

        {/* Premium Filter */}
        <div className="field">
          <label
            style={{
              color: "var(--text-secondary)",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            Product Type
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              color: "var(--text-primary)",
              fontSize: "13px",
            }}
          >
            <input
              type="checkbox"
              checked={filters.premiumOnly}
              onChange={(e) =>
                handleInputChange("premiumOnly", e.target.checked)
              }
              style={{
                width: "16px",
                height: "16px",
                accentColor: "var(--accent-cyan)",
              }}
            />
            Premium Products Only
          </label>
        </div>
      </div>
    </div>
  );

  // Mobile Filter Panel
  const MobileFilterPanel = () => (
    <div className="filter-panel-mobile">
      <div className="filter-mobile-header">
        <h3
          style={{
            color: "var(--text-primary)",
            fontSize: "18px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Filter Products
        </h3>
        <button
          className="filter-mobile-toggle"
          onClick={toggleMobileFilter}
          style={{
            background: isMobileFilterOpen
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
            color: "var(--bg-dark)",
            border: "none",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div
        className={`filter-mobile-content ${isMobileFilterOpen ? "open" : ""}`}
      >
        {/* Price Range */}
        <div className="filter-mobile-field">
          <label>Price Range</label>
          <div className="filter-mobile-row">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleInputChange("minPrice", e.target.value)}
              className="filter-mobile-input"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              className="filter-mobile-input"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-mobile-field">
          <label>Minimum Rating</label>
          <select
            value={filters.minRating}
            onChange={(e) => handleInputChange("minRating", e.target.value)}
            className="filter-mobile-input"
          >
            <option value="">Any Rating</option>
            <option value="1">1+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-mobile-field">
          <label>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="filter-mobile-input"
          >
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-avgRating">Rating: High to Low</option>
            <option value="avgRating">Rating: Low to High</option>
            <option value="title">Title: A to Z</option>
            <option value="-title">Title: Z to A</option>
          </select>
        </div>

        {/* Premium Filter */}
        <div className="filter-mobile-field">
          <label>Product Type</label>
          <div className="filter-mobile-checkbox">
            <input
              type="checkbox"
              checked={filters.premiumOnly}
              onChange={(e) =>
                handleInputChange("premiumOnly", e.target.checked)
              }
            />
            <span>Premium Products Only</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-mobile-actions">
          <button className="filter-mobile-clear" onClick={clearFilters}>
            Clear All
          </button>
          <button className="filter-mobile-apply" onClick={toggleMobileFilter}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopFilterPanel />
      <MobileFilterPanel />
    </>
  );
}
