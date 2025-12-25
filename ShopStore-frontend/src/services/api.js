const API_BASE = process.env.REACT_APP_API_BASE;

async function request(path, options = {}) {
  const userId = localStorage.getItem("cs_user_id");
  const headers = options.headers || {};
  if (userId) headers["X-User-Id"] = userId;
  headers["Content-Type"] = "application/json";

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }
    if (!res.ok) {
      return { ok: false, status: res.status, error: data?.error || data };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function register(data) {
  return await request(`/users/register`, { method: "POST", body: data });
}

export async function login(data) {
  return await request(`/users/login`, { method: "POST", body: data });
}

export async function getCart() {
  const userId = localStorage.getItem("cs_user_id");
  if (userId) {
    // try /users/cart/:userId first for compatibility
    let res = await request(`/users/cart/${encodeURIComponent(userId)}`, {
      method: "GET",
    });
    if (res.ok) return res;
  }
  return "Can't get cart without user ID";
}

export async function saveCart(cart) {
  const userId = localStorage.getItem("cs_user_id");
  if (userId) {
    // try PUT /users/cart/:userId
    let res = await request(`/users/cart/${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: { cart },
    });
    if (res.ok) return res;
  }
  return "Can't save cart without user ID";
}

export async function addToCart(productId) {
  const userId = localStorage.getItem("cs_user_id");
  if (!userId) return { ok: false, error: "Not logged in" };
  return await request(`/users/cart/${encodeURIComponent(userId)}`, {
    method: "POST",
    body: { productId },
  });
}

export async function removeFromCart(productId) {
  const userId = localStorage.getItem("cs_user_id");
  if (!userId) return { ok: false, error: "Not logged in" };
  return await request(
    `/users/cart/${encodeURIComponent(userId)}/${encodeURIComponent(
      productId
    )}`,
    {
      method: "DELETE",
    }
  );
}

export async function getWishlist() {
  const userId = localStorage.getItem("cs_user_id");
  if (userId) {
    let res = await request(`/users/wishlist/${encodeURIComponent(userId)}`, {
      method: "GET",
    });
    if (res.ok) return res;
  }
  return "can't get wishlist without user ID";
}

export async function saveWishlist(wishlist) {
  const userId = localStorage.getItem("cs_user_id");
  if (userId) {
    let res = await request(`/users/wishlist/${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: { wishlist },
    });
    if (res.ok) return res;
  }
  return "Can't save wishlist without user ID";
}

export async function addToWishlist(productId) {
  const userId = localStorage.getItem("cs_user_id");
  if (!userId) return { ok: false, error: "Not logged in" };
  return await request(`/users/wishlist/${encodeURIComponent(userId)}`, {
    method: "POST",
    body: { productId },
  });
}

export async function removeFromWishlist(productId) {
  const userId = localStorage.getItem("cs_user_id");
  if (!userId) return { ok: false, error: "Not logged in" };
  return await request(
    `/users/wishlist/${encodeURIComponent(userId)}/${encodeURIComponent(
      productId
    )}`,
    {
      method: "DELETE",
    }
  );
}

export async function getProfile() {
  const userId = localStorage.getItem("cs_user_id");
  if (userId) {
    // try /me/:userId first for compatibility
    let res = await request(`/users/me/${encodeURIComponent(userId)}`, {
      method: "GET",
    });
    if (res.ok) return res;
  }
  return "Can't get profile without user ID";
}

export async function updateProfile(profile) {
  const userId = localStorage.getItem("cs_user_id");
  if (userId) {
    // try PUT /me/:userId
    let res = await request(`/users/me/${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: { profile },
    });
    if (res.ok) return res;
  }
  return "Can't update profile without user ID";
}

export async function ping() {
  // Health check endpoint; backend should respond 200 for /health
  return await request(`/health`, { method: "GET" });
}

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  // Add filtering parameters
  if (filters.minPrice) params.append("price[gte]", filters.minPrice);
  if (filters.maxPrice) params.append("price[lte]", filters.maxPrice);
  if (filters.minRating) params.append("avgRating[gte]", filters.minRating);
  if (filters.premiumOnly) params.append("premium", true);

  // Add sorting
  if (filters.sortBy) params.append("sort", filters.sortBy);

  // Add pagination parameters
  params.append("limit", filters.limit?.toString() || "12");
  params.append("page", filters.page?.toString() || "0");

  const queryString = params.toString();
  const url = `/products${queryString ? `?${queryString}` : ""}`;

  return await request(url, { method: "GET" });
}

export async function getProduct(id) {
  return await request(`/products/${encodeURIComponent(id)}`, {
    method: "GET",
  });
}

export async function createProduct(productData) {
  return await request(`/products`, {
    method: "POST",
    body: productData,
  });
}

export async function deleteProduct(productId) {
  return await request(`/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

export async function getProductsDetails() {
  return await request(`/products/products-details`, {
    method: "GET",
  });
}

export async function getTopRatedProducts() {
  return await request(`/products/top-rating`, {
    method: "GET",
  });
}

// Upload an image to a public hosting provider (Cloudinary unsigned upload)
export async function uploadImage(file) {
  // Environment variables: REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    return { ok: false, error: "Missing Cloudinary upload config" };
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(url, { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok)
      return { ok: false, status: res.status, error: data?.error || data };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Admin user management functions
export async function getUsers(filters = {}) {
  const params = new URLSearchParams();

  // Add filtering parameters
  if (filters.search) params.append("search", filters.search);

  // Add sorting
  if (filters.sortBy) params.append("sort", filters.sortBy);

  // Add pagination parameters
  params.append("limit", filters.limit?.toString() || "20");
  params.append("page", filters.page?.toString() || "0");

  const queryString = params.toString();
  const url = `/users${queryString ? `?${queryString}` : ""}`;

  return await request(url, { method: "GET" });
}

export async function updateUserRole(userId, role) {
  return await request(`/users/me/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: { profile: { role } },
  });
}

export async function deleteUser(userId) {
  return await request(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export async function getUsersAnalysis() {
  return await request(`/users/users-analysis`, { method: "GET" });
}
