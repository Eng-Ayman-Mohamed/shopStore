import * as api from "../services/api";

export function createCartHandlers(cart, user, setCart, showToast) {
  const addToCart = async (product) => {
    if (!user) {
      showToast("Please sign in to add items to cart", "warning");
      return;
    }

    // Call API to add product to backend cart
    const res = await api.addToCart(product._id || product.id);
    if (res.ok) {
      showToast(`${product.title} added to cart`, "success");
      // Fetch updated cart from backend
      const cartRes = await api.getCart();
      if (cartRes.ok && Array.isArray(cartRes.data?.cart)) {
        setCart(cartRes.data.cart);
      }
    } else {
      showToast(res.error || "Failed to add to cart", "error");
    }
  };

  const removeFromCart = async (product) => {
    const res = await api.removeFromCart(product._id || product.id);
    if (res.ok) {
      showToast(`${product.title} removed from cart`, "info");
      // Fetch updated cart from backend
      const cartRes = await api.getCart();
      if (cartRes.ok && Array.isArray(cartRes.data?.cart)) {
        setCart(cartRes.data.cart);
      }
    } else {
      showToast(res.error || "Failed to remove from cart", "error");
    }
  };

  return { addToCart, removeFromCart };
}

export function createWishlistHandlers(wishlist, user, setWishlist, showToast) {
  const addToWishlist = async (product) => {
    if (!user) {
      showToast("Please sign in to add items to wishlist", "warning");
      return;
    }

    // Call API to add product to backend wishlist
    const res = await api.addToWishlist(product._id || product.id);
    if (res.ok) {
      showToast(`${product.title} added to wishlist`, "success");
      // Fetch updated wishlist from backend
      const wishlistRes = await api.getWishlist();
      if (wishlistRes.ok && Array.isArray(wishlistRes.data?.wishlist)) {
        setWishlist(wishlistRes.data.wishlist);
      }
    } else {
      showToast(res.error || "Failed to add to wishlist", "error");
    }
  };

  const removeFromWishlist = async (product) => {
    const res = await api.removeFromWishlist(product._id || product.id);
    if (res.ok) {
      showToast(`${product.title} removed from wishlist`, "info");
      // Fetch updated wishlist from backend
      const wishlistRes = await api.getWishlist();
      if (wishlistRes.ok && Array.isArray(wishlistRes.data?.wishlist)) {
        setWishlist(wishlistRes.data.wishlist);
      }
    } else {
      showToast(res.error || "Failed to remove from wishlist", "error");
    }
  };

  return { addToWishlist, removeFromWishlist };
}

export function createProfileHandlers(user, setAuthUser, showToast) {
  const updateUserProfile = async (updatedData) => {
    try {
      const res = await api.updateProfile(updatedData);
      if (res.ok) {
        const updated = res.data?.user || res.data?.profile || res.data;
        if (updated) {
          setAuthUser(updated);
          showToast("Profile updated successfully", "success");
          return { ok: true, data: updated };
        }
      }
      // fallback to local update if API didn't return updated user
      const updatedUser = { ...user, ...updatedData };
      setAuthUser(updatedUser);
      showToast("Profile updated (local)", "warning");
      return { ok: false, error: res?.error || "No updated user returned" };
    } catch (err) {
      const updatedUser = { ...user, ...updatedData };
      setAuthUser(updatedUser);
      showToast("Profile updated (offline)", "warning");
      return { ok: false, error: err.message };
    }
  };

  return { updateUserProfile };
}
