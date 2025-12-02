import { AuthContext, AuthContextType } from "@/Providers";
import { useContext } from "react";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
