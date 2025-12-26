const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: [
        validator.isStrongPassword,
        "Password must be at least 8 characters long and include uppercase, lowercase, and a number.",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email address."],
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
    cash: { type: Number, default: 1000 },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    purchases: [
      {
        products: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        ],
        total: Number,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
