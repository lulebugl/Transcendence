import { useAuth } from "@/context/auth-context";
import { Loading } from "@/components/Loading";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoutes() {
	const { user, isLoading } = useAuth();
  
	if (isLoading) return <Loading />;
	if (!user) return <Navigate to="/auth/login" replace />;
  
	return <Outlet />;  // Renders child routes
}
