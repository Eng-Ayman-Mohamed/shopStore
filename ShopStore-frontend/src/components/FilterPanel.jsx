import React, { useState, useCallback } from "react";

// --- Sub-components moved outside to prevent focus loss ---

const PriceRangeInput = ({
  label,
  minField,
  maxField,
  pendingFilters,
  handleInputChange,
  handleKeyPress,
}) => (
  <div className="field">
    <label
      style={{
        color: "var(--text-secondary)",
        marginBottom: "8px",
        fontSize: "13px",
      }}
    >
      {label}
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
          value={pendingFilters[minField]}
          onChange={(e) => handleInputChange(minField, e.target.value)}
          onKeyPress={handleKeyPress}
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
          value={pendingFilters[maxField]}
          onChange={(e) => handleInputChange(maxField, e.target.value)}
          onKeyPress={handleKeyPress}
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
);

const RatingSelect = ({
  pendingFilters,
  handleInputChange,
  handleKeyPress,
}) => (
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
      value={pendingFilters.minRating}
      onChange={(e) => handleInputChange("minRating", e.target.value)}
      onKeyPress={handleKeyPress}
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
);

const SortSelect = ({ pendingFilters, handleSortChange, handleKeyPress }) => (
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
      value={pendingFilters.sortBy}
      onChange={(e) => handleSortChange(e.target.value)}
      onKeyPress={handleKeyPress}
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
);

const PremiumCheckbox = ({
  pendingFilters,
  handleInputChange,
  handleKeyPress,
}) => (
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
        checked={pendingFilters.premiumOnly}
        onChange={(e) => handleInputChange("premiumOnly", e.target.checked)}
        onKeyPress={handleKeyPress}
        style={{
          width: "16px",
          height: "16px",
          accentColor: "var(--accent-cyan)",
        }}
      />
      Premium Products Only
    </label>
  </div>
);

const MobilePriceRangeInput = ({ pendingFilters, handleInputChange }) => (
  <div className="filter-mobile-field">
    <label>Price Range</label>
    <div className="filter-mobile-row">
      <input
        type="number"
        placeholder="Min Price"
        value={pendingFilters.minPrice}
        onChange={(e) => handleInputChange("minPrice", e.target.value)}
        className="filter-mobile-input"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={pendingFilters.maxPrice}
        onChange={(e) => handleInputChange("maxPrice", e.target.value)}
        className="filter-mobile-input"
      />
    </div>
  </div>
);

const MobileRatingSelect = ({ pendingFilters, handleInputChange }) => (
  <div className="filter-mobile-field">
    <label>Minimum Rating</label>
    <select
      value={pendingFilters.minRating}
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
);

const MobileSortSelect = ({ pendingFilters, handleSortChange }) => (
  <div className="filter-mobile-field">
    <label>Sort By</label>
    <select
      value={pendingFilters.sortBy}
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
);

const MobilePremiumCheckbox = ({ pendingFilters, handleInputChange }) => (
  <div className="filter-mobile-field">
    <label>Product Type</label>
    <div className="filter-mobile-checkbox">
      <input
        type="checkbox"
        checked={pendingFilters.premiumOnly}
        onChange={(e) => handleInputChange("premiumOnly", e.target.checked)}
      />
      <span>Premium Products Only</span>
    </div>
  </div>
);

// --- Main Component ---

export default function FilterPanel({ onFilterChange, onClearFilters }) {
  const [activeFilters, setActiveFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    premiumOnly: false,
    sortBy: "price",
  });
  const [pendingFilters, setPendingFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    premiumOnly: false,
    sortBy: "price",
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setPendingFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    setActiveFilters(pendingFilters);
    onFilterChange(pendingFilters);
  }, [pendingFilters, onFilterChange]);

  const handleSortChange = useCallback((sortValue) => {
    setPendingFilters((prev) => ({ ...prev, sortBy: sortValue }));
  }, []);

  const clearFilters = useCallback(() => {
    const defaultFilters = {
      minPrice: "",
      maxPrice: "",
      minRating: "",
      premiumOnly: false,
      sortBy: "price",
    };
    setActiveFilters(defaultFilters);
    setPendingFilters(defaultFilters);
    onClearFilters();
  }, [onClearFilters]);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      applyFilters();
    }
  };

  return (
    <>
      {/* Desktop Filter Panel */}
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
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={applyFilters}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--accent-cyan)",
                background: "var(--accent-cyan)",
                color: "var(--bg-dark)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
            >
              Apply Filters
            </button>
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
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <PriceRangeInput
            label="Price Range"
            minField="minPrice"
            maxField="maxPrice"
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
          />
          <RatingSelect
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
          />
          <SortSelect
            pendingFilters={pendingFilters}
            handleSortChange={handleSortChange}
            handleKeyPress={handleKeyPress}
          />
          <PremiumCheckbox
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
            handleKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* Mobile Filter Panel */}
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
          className={`filter-mobile-content ${
            isMobileFilterOpen ? "open" : ""
          }`}
        >
          <MobilePriceRangeInput
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />
          <MobileRatingSelect
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />
          <MobileSortSelect
            pendingFilters={pendingFilters}
            handleSortChange={handleSortChange}
          />
          <MobilePremiumCheckbox
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />

          {/* Action Buttons */}
          <div className="filter-mobile-actions">
            <button className="filter-mobile-clear" onClick={clearFilters}>
              Clear All
            </button>
            <button
              className="filter-mobile-apply"
              onClick={() => {
                applyFilters();
                toggleMobileFilter();
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
