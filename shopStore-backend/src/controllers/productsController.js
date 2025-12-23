const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllProducts = async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const productsObj = await features.query;
    res.status(200).json({
      status: "success",
      products: productsObj,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
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
      message: err,
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
      message: err,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.productsDetails = async (req, res) => {
  try {
    const details = await Product.aggregate([
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$avgRating" },
          numRatings: { $sum: "$ratingQuantity" },
          numPremium: {
            $sum: { $cond: [{ $eq: ["$premium", true] }, 1, 0] },
          },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      product: details,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.topRating = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: { avgRating: { $gte: 4.6 } },
      },
      {
        $match: { premium: true },
      },
      {
        $sort: { avgRating: -1 },
      },
    ]);
    res.status(200).json({
      numProducts: products.length,
      status: "success",
      product: products,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
