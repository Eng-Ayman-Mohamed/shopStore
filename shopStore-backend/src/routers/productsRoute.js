const express = require("express");
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  deleteProduct,
  productsDetails,
  topRating,
} = require("../controllers/productsController");

const router = express.Router();

router.route("/top-rating").get(topRating);
router.route("/products-details").get(productsDetails);
router.get("/", getAllProducts);
router.route("/:id").get(getOneProduct).delete(deleteProduct);
router.post("/", createProduct);

module.exports = router;
