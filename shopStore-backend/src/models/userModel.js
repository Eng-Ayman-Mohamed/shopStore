const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phone: Number,
  address: String,
  avatar: String, // Cloudinary URL or Base64
  avatarFile: String, // File path if stored locally
  avatarColor: String,
  avatarEmoji: {
    type: String,
    enum: ["👨", "👩", "🧑", "🎨", "⭐", "🚀", "💎", "🌟"],
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
