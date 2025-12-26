import React, { useState, useCallback, useEffect, memo, useRef } from "react";

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

const DiscountCheckbox = memo(({ pendingFilters, handleInputChange }) => (
  <div className="field">
    <label
      style={{
        color: "var(--text-secondary)",
        marginBottom: "8px",
        display: "block",
        fontSize: "13px",
      }}
    >
      Special Offers
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
        checked={pendingFilters.discountedOnly}
        onChange={(e) => handleInputChange("discountedOnly", e.target.checked)}
        style={{
          width: "16px",
          height: "16px",
          accentColor: "var(--accent-cyan)",
        }}
      />
      Products with Discount
    </label>
  </div>
));

const CategorySelect = memo(
  ({ pendingFilters, handleInputChange, categories }) => (
    <div className="field">
      <label
        style={{
          color: "var(--text-secondary)",
          marginBottom: "8px",
          display: "block",
          fontSize: "13px",
        }}
      >
        Category
      </label>
      <select
        value={pendingFilters.category}
        onChange={(e) => handleInputChange("category", e.target.value)}
        className="input"
        style={{ fontSize: "13px", width: "100%" }}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.icon} {category.name}
          </option>
        ))}
      </select>
    </div>
  )
);

// --- Main Component ---

export default function FilterPanel({
  onFilterChange,
  onClearFilters,
  initialFilters = {},
}) {
  const [pendingFilters, setPendingFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    premiumOnly: false,
    discountedOnly: false,
    sortBy: "price",
    category: "",
    ...initialFilters,
  });

  // Categories data
  const categories = [
    { name: "Electronics", icon: "📱", color: "var(--accent-cyan)" },
    { name: "Fashion", icon: "👕", color: "var(--accent-purple)" },
    { name: "Home & Garden", icon: "🏠", color: "var(--accent-pink)" },
    { name: "Sports", icon: "⚽", color: "var(--accent-blue)" },
    { name: "Books", icon: "📚", color: "var(--accent-cyan)" },
    { name: "Beauty", icon: "💄", color: "var(--accent-purple)" },
  ];

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync pendingFilters with initialFilters when initialFilters changes
  useEffect(() => {
    setPendingFilters((prev) => ({
      ...prev,
      category: initialFilters.category || "",
    }));
  }, [initialFilters.category]);

  // Manual apply function to prevent auto-fetching
  const applyFilters = useCallback(() => {
    onFilterChange(pendingFilters);
  }, [pendingFilters, onFilterChange]);

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
      discountedOnly: false,
      sortBy: "price",
      category: "",
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
          position: "relative",
        }}
      >
        <h3
          style={{
            color: "var(--text-primary)",
            fontSize: "16px",
            margin: "0 0 20px 0",
          }}
        >
          Filter Products
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <CategorySelect
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
            categories={categories}
          />
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
          <DiscountCheckbox
            pendingFilters={pendingFilters}
            handleInputChange={handleInputChange}
          />
        </div>

        {/* Bottom right action buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            onClick={clearFilters}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-pink)",
              cursor: "pointer",
              fontSize: "13px",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(244, 114, 182, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            style={{
              background:
                "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              border: "none",
              color: "var(--bg-dark)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              padding: "10px 20px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0, 215, 255, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 16px rgba(0, 215, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(0, 215, 255, 0.2)";
            }}
          >
            Apply Filters
          </button>
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
            <CategorySelect
              pendingFilters={pendingFilters}
              handleInputChange={handleInputChange}
              categories={categories}
            />
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
            <DiscountCheckbox
              pendingFilters={pendingFilters}
              handleInputChange={handleInputChange}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button
                onClick={applyFilters}
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                  border: "none",
                  color: "var(--bg-dark)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "12px 16px",
                  borderRadius: "8px",
                }}
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                style={{
                  flex: 1,
                  background: "none",
                  border: "1px solid var(--accent-pink)",
                  color: "var(--accent-pink)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "12px 16px",
                  borderRadius: "8px",
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
