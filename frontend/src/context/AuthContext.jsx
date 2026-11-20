import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("loanx_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();

        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const saveSession = (res) => {
    if (res.success && res.token) {
      localStorage.setItem("loanx_token", res.token);
      setToken(res.token);
      setUser(res.user);
    }

    return res;
  };

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    return saveSession(res);
  };

  const demoLogin = async () => {
    const res = await authApi.demoLogin();
    return saveSession(res);
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    return saveSession(res);
  };

  const registerAdmin = async (adminData) => {
    const res = await authApi.registerAdmin(adminData);
    return saveSession(res);
  };

  const logout = () => {
    localStorage.removeItem("loanx_token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        demoLogin,
        register,
        registerAdmin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
