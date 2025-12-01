import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { User } from "@/types";
import { api } from "@/api";
import * as authApi from "@/api/auth";
import { AuthContext } from "./auth-context";
import { useNavigate } from "react-router";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    otp?: string
  ) => Promise<void | { require2fa: boolean }>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
	const handleStorageChange = (event: StorageEvent) => {
	  if (event.key === "accessToken" && event.newValue === null) {
		setUser(null);
	  }
	};
  
	window.addEventListener("storage", handleStorageChange);
	return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  const refreshUser = useCallback(async () => {
    try {
      const res = await api("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  }, []);

  const signup = useCallback(
    async (username: string, password: string) => {
      await authApi.signup(username, password);
      await refreshUser();
    },
    [refreshUser]
  );

  const login = useCallback(
    async (username: string, pass: string, otp?: string) => {
      const data = await authApi.login(username, pass, otp);
      console.log("login response: ", data);
      await refreshUser();
      return data;
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      setUser(null);
    }
  }, [navigate]);

  useEffect(() => {
    let ignore = false;

    const initAuth = async () => {
      try {
        await refreshUser();
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      ignore = true;
    };
  }, [refreshUser]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, signup, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
