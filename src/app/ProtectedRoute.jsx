import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children, roles, redirectTo = "/login" }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (roles?.length && !roles.includes(user?.perfil)) return <Navigate to="/app/dashboard" replace />;

  return children;
}
