"use client";
import { createContext, useContext, useEffect, useState } from "react";
import authService from "@/lib/auth";
import service from "@/lib/service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const current = await authService.getCurrentUser();
      console.log("Current user:", current);
      setUser(current);
    }
    catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    await authService.login({ email, password });
    await fetchUser();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
