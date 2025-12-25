const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");

exports.register = async (req, res) => {
  try {
    const userObj = await User.create(req.body);
    res.status(200).json({
      status: "success",
      user: userObj,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    //check if the user exist
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      user: userData,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const usersObj = await features.query;
    res.status(200).json({
      message: "success",
      users: usersObj,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

//Me
exports.userData = async (req, res) => {
  try {
    const userId = req.params.id;
    const userObj = await User.findById(userId);
    res.status(200).json({
      status: "success",
      user: userObj,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const newUserData = req.body;
    console.log(newUserData);
    const userData = await User.findByIdAndUpdate(userId, newUserData.profile, {
      new: true,
      runValidators: true,
      select: "-__v ",
    });

    res.status(200).json(userData);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

//Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const userObj = await User.findById(userId).populate("cart");
    const cartObj = userObj.cart;
    res.status(200).json({
      status: "success",
      cart: cartObj,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.findByIdAndUpdate(
      userId,
      { $push: { cart: productId } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Product added to cart",
    });
  } catch (er) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;
    await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: productId } },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Product removed from cart",
    });
  } catch (er) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

//WishList
exports.userWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const userObj = await User.findById(userId).populate("wishlist");
    const wishlistObj = userObj.wishlist;
    res.status(200).json({
      status: "success",
      wishlist: wishlistObj,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.body.productId;
    await User.findByIdAndUpdate(userId, {
      $push: { wishlist: productId },
    });
    res.status(200).json({
      status: "success",
      message: "Product added to wishlist",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: productId },
    });
    res.status(200).json({
      status: "success",
      message: "Product removed from wishlist",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

exports.usersAnalysis = async (req, res) => {
  try {
    const analysis = await User.aggregate([
      {
        $group: {
          _id: "$role",
          numUsers: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      analysis,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
