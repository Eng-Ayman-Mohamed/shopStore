// Shared categories configuration for the ShopStore application
export const categories = [
  { name: "Electronics", icon: "📱", color: "var(--accent-cyan)" },
  { name: "Fashion", icon: "👕", color: "var(--accent-purple)" },
  { name: "Home & Garden", icon: "🏠", color: "var(--accent-pink)" },
  { name: "Sports", icon: "⚽", color: "var(--accent-blue)" },
  { name: "Books", icon: "📚", color: "var(--accent-cyan)" },
  { name: "Beauty", icon: "💄", color: "var(--accent-purple)" },
];

// Helper function to get category by name
export const getCategoryByName = (categoryName) => {
  return categories.find((cat) => cat.name === categoryName);
};

// Helper function to get category icon by name
export const getCategoryIcon = (categoryName) => {
  const category = getCategoryByName(categoryName);
  return category ? category.icon : "📦"; // Default icon
};

// Helper function to get category color by name
export const getCategoryColor = (categoryName) => {
  const category = getCategoryByName(categoryName);
  return category ? category.color : "var(--accent-cyan)"; // Default color
};
