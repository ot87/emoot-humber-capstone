import type { ReactElement } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BingoBoardPage } from "@/features/bingo/BingoBoardPage";
import { BingoPage } from "@/features/bingo/BingoPage";
import { useSavedQuizResult } from "@/features/bingo/hooks/useSavedQuizResult";
import { AuthPage } from "@/features/auth/AuthPage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import QuizPage from "@/features/quiz/QuizPage";
import ResultPage from "@/features/quiz/ResultPage";

function RequireAuth({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function RequireSavedQuizResult({ children }: { children: ReactElement }) {
  const { hasSavedResult, loading } = useSavedQuizResult();

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!hasSavedResult) {
    return <Navigate to="/bingo" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route
          path="/bingo"
          element={
            <RequireAuth>
              <BingoPage />
            </RequireAuth>
          }
        />
        <Route
          path="/bingo/board"
          element={
            <RequireAuth>
              <RequireSavedQuizResult>
                <BingoBoardPage />
              </RequireSavedQuizResult>
            </RequireAuth>
          }
        />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
