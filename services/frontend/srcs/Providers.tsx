import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  createContext,
} from "react";
import { User } from "@/types/users";
import { api } from "@/api";
import * as authApi from "@/api/auth";
import { useNavigate } from "react-router";
import { LoginResponse } from "@/api/types";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    otp?: string
  ) => Promise<LoginResponse>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/* eslint-disable react-refresh/only-export-components */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

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
    console.log("Refetching user");
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
