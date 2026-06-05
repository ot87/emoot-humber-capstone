import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { SignInCard } from "./components/SignInCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo = location.state?.from ?? "/bingo";

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <SignInCard onSuccess={() => navigate(redirectTo, { replace: true })} />;
}
