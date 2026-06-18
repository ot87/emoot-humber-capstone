import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BingoLockedEntryScreen } from "@/features/bingo/components/BingoLockedEntryScreen";
import { useSavedQuizResult } from "@/features/bingo/hooks/useSavedQuizResult";

export function BingoPage() {
  const { loading, error, hasSavedResult } = useSavedQuizResult();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <p className="text-center font-quiz-body text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!hasSavedResult) {
    return <BingoLockedEntryScreen />;
  }

  return <Navigate to="/bingo/board" replace />;
}
