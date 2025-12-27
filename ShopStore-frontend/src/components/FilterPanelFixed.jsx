import React, { useState, useRef } from "react";
import "./FilterPanel.css";

const SimpleCategorySelect = ({ value, onChange, categories, onKeyDown }) => {
  return (
    <div className="filter-field">
      <label className="filter-label">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="filter-select"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

const PriceRange = ({
  minPriceRef,
  maxPriceRef,
  onMinChange,
  onMaxChange,
  onKeyDown,
}) => {
  return (
    <div className="filter-field">
      <label className="filter-label">Price Range</label>
      <div className="price-inputs">
        <input
          ref={minPriceRef}
          type="number"
          placeholder="Min"
          onChange={(e) => onMinChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="price-input"
        />
        <span className="price-separator">to</span>
        <input
          ref={maxPriceRef}
          type="number"
          placeholder="Max"
          onChange={(e) => onMaxChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="price-input"
        />
      </div>
    </div>
  );
};

const RatingFilter = ({ value, onChange, onKeyDown }) => {
  const ratings = [
    { value: "", label: "All Ratings" },
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
  ];

  return (
    <div className="filter-field">
      <label className="filter-label">Minimum Rating</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="filter-select"
      >
        {ratings.map((rating) => (
          <option key={rating.value} value={rating.value}>
            {rating.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const SortSelect = ({ value, onChange, onKeyDown }) => {
  const sortOptions = [
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
    { value: "-avgRating", label: "Rating: High to Low" },
    { value: "title", label: "Name: A to Z" },
    { value: "-title", label: "Name: Z to A" },
  ];

  return (
    <div className="filter-field">
      <label className="filter-label">Sort By</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="filter-select"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Main Component using uncontrolled inputs
const FilterPanel = React.memo(
  ({ onFilterChange, onClearFilters, initialFilters = {} }) => {
    const [category, setCategory] = useState(initialFilters.category || "");
    const [minRating, setMinRating] = useState(initialFilters.minRating || "");
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || "price");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Refs for uncontrolled inputs
    const searchInputRef = useRef(null);
    const minPriceInputRef = useRef(null);
    const maxPriceInputRef = useRef(null);

    // Categories data
    const categories = [
      "Electronics",
      "Fashion",
      "Home & Garden",
      "Sports",
      "Books",
      "Beauty",
      "Toys",
      "Automotive",
    ];

    // Count active filters from controlled inputs only
    const activeFiltersCount = [category, minRating].filter(Boolean).length;

    // Get current values from refs
    const getCurrentFilters = () => {
      const searchQuery = searchInputRef.current?.value || "";
      const minPrice = minPriceInputRef.current?.value || "";
      const maxPrice = maxPriceInputRef.current?.value || "";

      return {
        searchQuery,
        category,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
      };
    };

    // Apply all filters at once
    const applyFilters = () => {
      const filters = getCurrentFilters();
      onFilterChange(filters);
    };

    // Handle Enter key in input fields
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFilters();
      }
    };

    // Handle controlled input changes
    const handleCategoryChange = (value) => {
      setCategory(value);
    };

    const handleRatingChange = (value) => {
      setMinRating(value);
    };

    const handleSortChange = (value) => {
      setSortBy(value);
    };

    const clearFilters = () => {
      // Clear refs (uncontrolled inputs)
      if (searchInputRef.current) searchInputRef.current.value = "";
      if (minPriceInputRef.current) minPriceInputRef.current.value = "";
      if (maxPriceInputRef.current) maxPriceInputRef.current.value = "";

      // Clear controlled inputs
      setCategory("");
      setMinRating("");
      setSortBy("price");
      onClearFilters();
    };

    const FilterContent = () => (
      <div className="filter-content">
        {/* Search - Uncontrolled */}
        <div className="filter-field">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            defaultValue={initialFilters.searchQuery || ""}
            className="search-input"
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Filter Grid */}
        <div className="filters-grid">
          <SimpleCategorySelect
            value={category}
            onChange={handleCategoryChange}
            categories={categories}
            onKeyDown={handleKeyDown}
          />

          <PriceRange
            minPriceRef={minPriceInputRef}
            maxPriceRef={maxPriceInputRef}
            onMinChange={() => {}} // No-op for uncontrolled
            onMaxChange={() => {}} // No-op for uncontrolled
            onKeyDown={handleKeyDown}
          />

          <RatingFilter
            value={minRating}
            onChange={handleRatingChange}
            onKeyDown={handleKeyDown}
          />

          <SortSelect
            value={sortBy}
            onChange={handleSortChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Actions */}
        <div className="filter-actions">
          <button onClick={applyFilters} className="apply-filters-btn">
            Apply Filters
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
          {activeFiltersCount > 0 && (
            <span className="active-filters-count">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""}{" "}
              active
            </span>
          )}
        </div>
      </div>
    );

    return (
      <>
        {/* Desktop Filter Panel */}
        <div className="filter-panel">
          <FilterContent />
        </div>

        {/* Mobile Filter Panel */}
        <div className="mobile-filter-panel">
          <button
            className="mobile-filter-toggle"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
            <span className={`arrow ${isMobileFilterOpen ? "open" : ""}`}>
              ▼
            </span>
          </button>

          {isMobileFilterOpen && (
            <div className="mobile-filter-content">
              <FilterContent />
            </div>
          )}
        </div>
      </>
    );
  }
);

FilterPanel.displayName = "FilterPanel";

export default FilterPanel;
