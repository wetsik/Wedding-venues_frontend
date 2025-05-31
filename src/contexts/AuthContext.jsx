"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Token mavjud bo'lsa, foydalanuvchi ma'lumotlarini localStorage dan olish
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials, role) => {
    try {
      const response = await api.post(`/${role}/login`, credentials);
      const { token: newToken, [role]: userData } = response.data;

      setToken(newToken);
      setUser({ ...userData, role });

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify({ ...userData, role }));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login xatosi yuz berdi",
      };
    }
  };

  const register = async (userData, role) => {
    try {
      const response = await api.post(`/${role}/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Ro'yxatdan o'tish xatosi",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
