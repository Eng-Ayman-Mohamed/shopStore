import * as api from "../services/api";

const USERS_STORAGE_KEY = "cs_registered_users";

export function getRegisteredUsers() {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function registerUser(email, password, name) {
  // Try backend registration first
  try {
    const res = await api.register({ email, password, name });
    if (res.ok) {
      // backend should return { user }
      const { user } = res.data || {};
      const backendId = user?._id || user?.id;
      if (backendId) localStorage.setItem("cs_user_id", String(backendId));
      return { success: true, user };
    }
  } catch (e) {
    // fall through to local fallback
  }

  // Fallback: localStorage-based registration
  const users = getRegisteredUsers();
  if (users.some((u) => u.email === email)) {
    return { success: false, error: "Email already registered" };
  }
  const newUser = { email, password, name, id: Date.now() };
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return { success: true, user: { name, email, id: newUser.id } };
}

export async function validateLogin(email, password) {
  // Try backend login first
  try {
    const res = await api.login({ email, password });
    if (res.ok) {
      const { user } = res.data || {};
      const backendId = user?._id || user?.id;
      if (backendId) localStorage.setItem("cs_user_id", String(backendId));
      return { success: true, user };
    } else if (res.status === 401) {
      return { success: false, error: res.error || "Unauthorized" };
    }
  } catch (e) {
    // fall back
  }

  // Fallback: localStorage-based validation
  const users = getRegisteredUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, error: "Email not found" };
  if (user.password !== password)
    return { success: false, error: "Incorrect password" };
  const logged = { name: user.name, email: user.email, id: user.id };
  localStorage.setItem("cs_user_id", String(user.id));
  return { success: true, user: logged };
}
