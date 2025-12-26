const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minLength: [10, "Title must be at least 10 characters"],
      maxLength: [30, "Title must be less than 30 characters"],
    },
    category: {
      type: String,
      enum: ["Electronics", "Fashion", "Home & Garden", "Sports", "Beauty"],
    },
    price: { type: Number, required: true },
    discount: {
      type: Number,
      default: 0, // no discount by default
      min: [0, "Discount must be at least 0%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    img: { type: String, required: true },
    description: { type: String, required: true },
    details: String,
    avgRating: {
      type: Number,
      min: [1, "Rating must be equal or greater than 1"],
      max: [5, "Rating must be equal or lower than 5"],
    },
    ratingQuantity: { type: Number, default: 1 },
    premium: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual("priceAfterDiscount").get(function () {
  return this.price * (1 - this.discount / 100);
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
