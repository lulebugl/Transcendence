import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode
} from "react";
import { User } from "@/types";
import { api } from "@/api";
import {
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
} from "@/api";
import { AuthContext, AuthContextType } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      await apiSignup(username, password);
      await refreshUser();
    },
    [refreshUser]
  );

  const login = useCallback(
    async (username: string, pass: string) => {
      await apiLogin(username, pass);
      await refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      setUser(null);
    }
  }, []);

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

