import React, { useState, useCallback, useEffect, memo, useRef } from "react";

// --- Memoized Sub-components to ensure they don't recreate ---

const PriceRangeInput = memo(
  ({ label, minField, maxField, pendingFilters, handleInputChange }) => (
    <div className="field">
      <label
        style={{
          color: "var(--text-secondary)",
          marginBottom: "8px",
          display: "block",
          fontSize: "13px",
        }}
      >
        {label}
      </label>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <input
          type="number"
          placeholder="Min"
          value={pendingFilters[minField]}
          onChange={(e) => handleInputChange(minField, e.target.value)}
          className="input"
          style={{ width: "100%", fontSize: "13px", padding: "10px 12px" }}
        />
        <input
          type="number"
          placeholder="Max"
          value={pendingFilters[maxField]}
          onChange={(e) => handleInputChange(maxField, e.target.value)}
          className="input"
          style={{ width: "100%", fontSize: "13px", padding: "10px 12px" }}
        />
      </div>
    </div>
  )
);

const RatingSelect = memo(({ pendingFilters, handleInputChange }) => (
  <div className="field">
    <label
      style={{
        color: "var(--text-secondary)",
        marginBottom: "8px",
        display: "block",
        fontSize: "13px",
      }}
    >
      Minimum Rating
    </label>
    <select
      value={pendingFilters.minRating}
      onChange={(e) => handleInputChange("minRating", e.target.value)}
      className="input"
      style={{ fontSize: "13px", width: "100%" }}
    >
      <option value="">Any Rating</option>
      <option value="1">1+ Stars</option>
      <option value="2">2+ Stars</option>
      <option value="3">3+ Stars</option>
      <option value="4">4+ Stars</option>
      <option value="5">5 Stars</option>
    </select>
  </div>
));

const SortSelect = memo(({ pendingFilters, handleInputChange }) => (
  <div className="field">
    <label
      style={{
        color: "var(--text-secondary)",
        marginBottom: "8px",
        display: "block",
        fontSize: "13px",
      }}
    >
      Sort By
    </label>
    <select
      value={pendingFilters.sortBy}
      onChange={(e) => handleInputChange("sortBy", e.target.value)}
      className="input"
      style={{ fontSize: "13px", width: "100%" }}
    >
      <option value="price">Price: Low to High</option>
      <option value="-price">Price: High to Low</option>
      <option value="-avgRating">Rating: High to Low</option>
      <option value="avgRating">Rating: Low to High</option>
      <option value="title">Title: A to Z</option>
      <option value="-title">Title: Z to A</option>
    </select>
  </div>
));

const PremiumCheckbox = memo(({ pendingFilters, handleInputChange }) => (
  <div className="field">
    <label
      style={{
        color: "var(--text-secondary)",
        marginBottom: "8px",
        display: "block",
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
        style={{
          width: "16px",
          height: "16px",
          accentColor: "var(--accent-cyan)",
        }}
      />
      Premium Only
    </label>
  </div>
));

// --- Main Component ---

export default function FilterPanel({ onFilterChange, onClearFilters }) {
  const [pendingFilters, setPendingFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    premiumOnly: false,
    sortBy: "price",
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Ref to track if it's the first render to avoid firing onFilterChange immediately
  const isFirstRender = useRef(true);

  // Auto-apply logic (Fixed to prevent Infinite Loop)
  useEffect(() => {
    // Skip the very first run to prevent the loop upon loading the page
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      onFilterChange(pendingFilters);
    }, 600);

    return () => clearTimeout(handler);
    // We only react to value changes in pendingFilters
  }, [
    pendingFilters.minPrice,
    pendingFilters.maxPrice,
    pendingFilters.minRating,
    pendingFilters.premiumOnly,
    pendingFilters.sortBy,
  ]);

  const handleInputChange = useCallback((field, value) => {
    setPendingFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    const defaults = {
      minPrice: "",
      maxPrice: "",
      minRating: "",
      premiumOnly: false,
      sortBy: "price",
    };
    setPendingFilters(defaults);
    onClearFilters();
  }, [onClearFilters]);

  return (
    <>
      <div
        className="filter-panel-desktop"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              color: "var(--text-primary)",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Filter Products
          </h3>
          <button
            onClick={clearFilters}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-pink)",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Clear All
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          <PriceRangeInput
            label="Price Range"
            minField="minPrice"
            maxField="maxPrice"
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />
          <RatingSelect
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />
          <SortSelect
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />
          <PremiumCheckbox
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />
        </div>
      </div>

      <div className="filter-panel-mobile">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
            background: "var(--accent-cyan)",
            border: "none",
            fontWeight: "bold",
          }}
        >
          {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>

        {isMobileFilterOpen && (
          <div
            style={{
              padding: "15px",
              background: "var(--card-bg)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <PriceRangeInput
              label="Price"
              minField="minPrice"
              maxField="maxPrice"
              pendingFilters={pendingFilters}
              handleInputChange={handleInputChange}
            />
            <RatingSelect
              pendingFilters={pendingFilters}
              handleInputChange={handleInputChange}
            />
            <SortSelect
              pendingFilters={pendingFilters}
              handleInputChange={handleInputChange}
            />
            <PremiumCheckbox
              pendingFilters={pendingFilters}
              handleInputChange={handleInputChange}
            />
          </div>
        )}
      </div>
    </>
  );
}
