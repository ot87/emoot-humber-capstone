import { Navigate, Route, Routes } from "react-router-dom";
import QuizPage from "@/features/quiz/QuizPage";
import BingoPage from "@/features/bingo/BingoPage";
import AuthPage from "@/features/auth/AuthPage";
import { useAuth } from "@/features/auth/hooks/useAuth";

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" replace />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/result" element={<div>Result</div>} />
      <Route
        path="/bingo"
        element={
          <RequireAuth>
            <BingoPage />
          </RequireAuth>
        }
      />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
