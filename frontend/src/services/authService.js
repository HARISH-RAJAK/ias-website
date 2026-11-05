import api from "./api";

export const authService = {
  // Register a new user
  async register(userData) {
    const response = await api.post("/register", userData);
    const payload = response.data?.data || response.data || {};
    if (payload.token) {
      localStorage.setItem("upsc_token", payload.token);
      localStorage.setItem("upsc_user", JSON.stringify(payload.user));
    }
    return payload;
  },

  // Login existing user
  async login(credentials) {
    const response = await api.post("/login", credentials);
    const payload = response.data?.data || response.data || {};
    if (payload.token) {
      localStorage.setItem("upsc_token", payload.token);
      localStorage.setItem("upsc_user", JSON.stringify(payload.user));
    }
    return payload;
  },

  // Google OAuth Login / Sign Up
  async googleLogin(credential) {
    const response = await api.post("/auth/google", { credential });
    const payload = response.data?.data || response.data || {};
    if (payload.token) {
      localStorage.setItem("upsc_token", payload.token);
      localStorage.setItem("upsc_user", JSON.stringify(payload.user));
    }
    return payload;
  },

  // Logout current user
  async logout() {
    try {
      await api.post("/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem("upsc_token");
      localStorage.removeItem("upsc_user");
    }
  },

  // Fetch authenticated user profile
  async getMe() {
    const response = await api.get("/me");
    const payload = response.data?.data || response.data || {};
    if (payload.user) {
      localStorage.setItem("upsc_user", JSON.stringify(payload.user));
    }
    return payload;
  },

  // Get locally saved user
  getCurrentUser() {
    const user = localStorage.getItem("upsc_user");
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem("upsc_token");
  },
};

export default authService;
