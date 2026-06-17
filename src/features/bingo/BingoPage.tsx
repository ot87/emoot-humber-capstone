import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BingoLockedEntryScreen } from "@/features/bingo/components/BingoLockedEntryScreen";
import { BingoUnlockedEntryScreen } from "@/features/bingo/components/BingoUnlockedEntryScreen";
import { useSavedQuizResult } from "@/features/bingo/hooks/useSavedQuizResult";

export function BingoPage() {
  const { savedResult, loading, error, hasSavedResult } = useSavedQuizResult();

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

  if (!hasSavedResult || !savedResult) {
    return <BingoLockedEntryScreen />;
  }

  return <BingoUnlockedEntryScreen personalityType={savedResult.personalityType} />;
}
