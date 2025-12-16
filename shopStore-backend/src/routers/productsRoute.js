const express = require("express");
const {
  getAllProducts,
  getOneProduct,
  createProduct,
} = require("../controllers/productsController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post("/", createProduct);

module.exports = router;
