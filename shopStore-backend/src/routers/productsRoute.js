const express = require("express");
const {
  getAllProducts,
  getOneProduct,
  createProduct,
  deleteProduct,
  productsDetails,
  topRating,
  updateProduct,
} = require("../controllers/productsController");

const router = express.Router();

router.route("/top-rating").get(topRating);
router.route("/products-details").get(productsDetails);
router.get("/", getAllProducts);
router
  .route("/:id")
  .get(getOneProduct)
  .delete(deleteProduct)
  .put(updateProduct);
router.post("/", createProduct);

module.exports = router;
