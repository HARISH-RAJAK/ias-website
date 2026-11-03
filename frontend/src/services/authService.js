import api from "./api";

export const authService = {
  // Register a new user
  async register(userData) {
    const response = await api.post("/register", userData);
    if (response.data?.token) {
      localStorage.setItem("upsc_token", response.data.token);
      localStorage.setItem("upsc_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login existing user
  async login(credentials) {
    const response = await api.post("/login", credentials);
    if (response.data?.token) {
      localStorage.setItem("upsc_token", response.data.token);
      localStorage.setItem("upsc_user", JSON.stringify(response.data.user));
    }
    return response.data;
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
    if (response.data?.user) {
      localStorage.setItem("upsc_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get locally saved user
  getCurrentUser() {
    const user = localStorage.getItem("upsc_user");
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem("upsc_token");
  },
};

export default authService;

