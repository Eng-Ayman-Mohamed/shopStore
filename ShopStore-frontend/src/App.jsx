import React, { useMemo } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/CartNew";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Toast from "./components/Toast";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import FloatingBackground from "./components/FloatingBackground";
import { useAuth, useCart, useWishlist } from "./hooks/useStorage";
import { useToast } from "./hooks/useToast";
import {
  createCartHandlers,
  createWishlistHandlers,
  createProfileHandlers,
} from "./utils/handlers";
import "./index.css";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setAuthUser } = useAuth();
  const { cart, setCart } = useCart();
  const { wishlist, setWishlist } = useWishlist();
  const { toast, showToast } = useToast();

  const { addToCart, removeFromCart } = useMemo(
    () => createCartHandlers(cart, user, setCart, showToast),
    [cart, user, setCart, showToast]
  );

  const { addToWishlist, removeFromWishlist } = useMemo(
    () => createWishlistHandlers(wishlist, user, setWishlist, showToast),
    [wishlist, user, setWishlist, showToast]
  );

  const { updateUserProfile } = useMemo(
    () => createProfileHandlers(user, setAuthUser, showToast),
    [user, setAuthUser, showToast]
  );

  const handleSignOut = () => {
    setAuthUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("cs_user_id");
    navigate("/");
  };

  const handleSignIn = (result) => {
    // result may be either a user object (fallback) or { success, user }
    const userObj = result?.user || result;
    const userId = userObj?._id || userObj?.id || result?._id || result?.id;
    if (userId) localStorage.setItem("cs_user_id", String(userId));
    setAuthUser(userObj);
    navigate("/profile");
  };

  return (
    <div className="app-shell">
      <FloatingBackground />
      <NavBar
        user={user}
        onSignOut={handleSignOut}
        cartCount={cart.length}
        wishlistCount={wishlist.length}
      />
      <Toast toast={toast} />

      <div className="container">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onAdd={addToCart}
                    onAddToWishlist={addToWishlist}
                    user={user}
                  />
                }
              />
              <Route
                path="/shop"
                element={
                  <ProductList
                    onAdd={addToCart}
                    onAddToWishlist={addToWishlist}
                  />
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProductDetails
                    onAdd={addToCart}
                    onAddToWishlist={addToWishlist}
                  />
                }
              />
              <Route
                path="/signin"
                element={<SignIn onSign={handleSignIn} />}
              />
              <Route
                path="/register"
                element={<Register onRegister={handleSignIn} />}
              />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route
                path="/edit-profile"
                element={<EditProfile user={user} onSave={updateUserProfile} />}
              />
              <Route
                path="/wishlist"
                element={
                  <Wishlist
                    wishlist={wishlist}
                    onRemove={removeFromWishlist}
                    onAdd={addToCart}
                    user={user}
                  />
                }
              />
              <Route
                path="/cart"
                element={<Cart cart={cart} onRemove={removeFromCart} />}
              />
              <Route path="/orders" element={<Orders />} />
              <Route
                path="/admin"
                element={<AdminDashboard user={user} showToast={showToast} />}
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
