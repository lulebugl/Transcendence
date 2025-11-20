import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo
} from "react";
import { api } from "@/api/api";
import { login as apiLogin, logout as apiLogout } from "@/api/auth";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email:string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
	  console.log("refreshing user");
      const res = await api("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      // console.error("Failed to fetch user:", error);
      setUser(null);
    }
  }, []);

  const login = useCallback(async(email: string, pass: string) => {
	console.log("logging in");
	await apiLogin(email, pass);
	await refreshUser();
  }, [refreshUser]); 

  const logout = useCallback(async() => {
	try {
		await apiLogout();
	} finally {
		setUser(null);
	}
  }, []);

  useEffect(() => {
	let ignore = false;
	
	const initAuth = async () => {
		try {
			await refreshUser();
		} finally {
			if (!ignore){
				setIsLoading(false);
			} 
		}
	}

	initAuth();
	
	return () => {
		ignore = true;
	}
  }, [refreshUser]);

  const value: AuthContextType = useMemo(() => ({
	user, 
	isLoading, 
	login,
	logout, 
	refreshUser
  }), [user, isLoading, login, logout, refreshUser]);

  return (
    <AuthContext.Provider value={ value }>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
