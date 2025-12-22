import { useState, useEffect } from "react";
import * as api from "../services/api";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("cs_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const setAuthUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("cs_user", JSON.stringify(userData));
      // notify other hooks/components that auth changed
      try {
        window.dispatchEvent(
          new CustomEvent("cs_user_change", { detail: userData })
        );
      } catch (e) {}
    } else {
      localStorage.removeItem("cs_user");
      // also remove stored user id so listeners see signed-out state
      try {
        localStorage.removeItem("cs_user_id");
      } catch (e) {}
      try {
        window.dispatchEvent(
          new CustomEvent("cs_user_change", { detail: null })
        );
      } catch (e) {}
    }
  };

  return { user, setAuthUser };
}

export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = () => {
      const userId = localStorage.getItem("cs_user_id");
      if (userId) {
        api.getCart().then((res) => {
          if (!mounted) return;
          if (res.ok && res.data && Array.isArray(res.data.cart)) {
            setCart(res.data.cart);
          } else {
            setCart([]);
          }
        });
      } else {
        setCart([]);
      }
    };

    // initial load
    load();

    // re-load when auth changes (sign-in/sign-out)
    const onUserChange = () => load();
    window.addEventListener("cs_user_change", onUserChange);
    // also listen to storage events (other tabs)
    const onStorage = (e) => {
      if (e.key === "cs_user_id") load();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("cs_user_change", onUserChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { cart, setCart };
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = () => {
      const userId = localStorage.getItem("cs_user_id");
      if (userId) {
        api.getWishlist().then((res) => {
          if (!mounted) return;
          if (res.ok && res.data && Array.isArray(res.data.wishlist)) {
            setWishlist(res.data.wishlist);
          } else {
            setWishlist([]);
          }
        });
      } else {
        setWishlist([]);
      }
    };

    // initial load
    load();

    const onUserChange = () => load();
    window.addEventListener("cs_user_change", onUserChange);
    const onStorage = (e) => {
      if (e.key === "cs_user_id") load();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("cs_user_change", onUserChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { wishlist, setWishlist };
}
