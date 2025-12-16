const User = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const userObj = await User.create(req.body, { select: "-password -__v" });
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
    const { email, password } = req.body;
    //check if the user exist
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    //check if the password is correct
    if (userData.password !== password) {
      return res.status(404).json({
        status: "fail",
        message: "Incorrect Password",
      });
    }
    //delete password from response
    const userObj = userData.toObject();
    delete userObj.password;
    res.status(200).json({
      status: "success",
      user: userObj,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "User not found",
    });
  }
};

//Me
exports.userData = async (req, res) => {
  try {
    const userId = req.params.id;
    const userObj = await User.findById(userId, { password: false });
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
      select: "-__v -password",
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
