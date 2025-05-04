// src/services/AuthService.js

const { apiBaseUrl } = require("../config");
const ApiService = require("../utils/ApiService");

const api = new ApiService(apiBaseUrl);

const AuthService = {
  async login(credentials) {
    return await api.post("/auth/login", credentials);
  },

  async logout() {
    return await api.post("/auth/logout");
  },

  async refreshToken(token) {
    return await api.post("/auth/refresh", { token });
  },
};

module.exports = AuthService;
