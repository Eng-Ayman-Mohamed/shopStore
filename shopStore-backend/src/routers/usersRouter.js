const express = require("express");
const {
  register,
  login,
  getCart,
  userData,
  updateUser,
  addToCart,
  removeFromCart,
  userWishlist,
  addToWishlist,
  removeFromWishlist,
  deleteUser,
  getUsers,
  usersAnalysis,
} = require("../controllers/userController");

const router = express.Router();

router.route("/users-analysis").get(usersAnalysis);
router.route("/").get(getUsers);
router.post("/register", register);
router.post("/login", login);

//User cart
router.route("/cart/:id").get(getCart).post(addToCart);
router.route("/cart/:id/:productId").delete(removeFromCart);
//User wishList
router.route("/wishlist/:id").get(userWishlist).post(addToWishlist);
router.route("/wishlist/:id/:productId").delete(removeFromWishlist);

//User Data
router.route("/me/:id").get(userData).put(updateUser).delete(deleteUser);
module.exports = router;
