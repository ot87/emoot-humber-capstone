import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { SignInCard } from "./components/SignInCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthPage() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/";

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <SignInCard />;
}