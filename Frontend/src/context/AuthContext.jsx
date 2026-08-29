import { createContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../services/authApi";

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = (data) => {
    if (data?.accessToken)
      localStorage.setItem("accessToken", data.accessToken);
    if (data?.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);
    if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
  };

  const clearSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await authApi.getCurrentUser();
      setUser(data?.data ?? null);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    persistSession(data?.data);
    setUser(data?.data?.user ?? null);
    return data;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    clearSession();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
