const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  try {
    const productsObj = await Product.find();
    res.status(200).json({
      status: "success",
      products: productsObj,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "😢",
    });
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productObj = await Product.findById(id);
    res.status(200).json({
      status: "success",
      product: productObj,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productObj = await Product.create(req.body);
    res.status(200).json({
      status: "success",
      product: productObj,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Failed to create product",
    });
  }
};
