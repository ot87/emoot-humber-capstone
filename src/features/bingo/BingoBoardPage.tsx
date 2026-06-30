import { useCallback } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BingoBoardLayout } from "@/features/bingo/components/BingoBoardLayout";
import { BingoGrid } from "@/features/bingo/components/BingoGrid";
import { BingoProgressCard } from "@/features/bingo/components/BingoProgressCard";
import { BingoScreenContent } from "@/features/bingo/components/BingoScreenContent";
import {
  BingoWinCelebrationBottom,
  BingoWinCelebrationTop,
} from "@/features/bingo/components/BingoWinCelebration";
import { useBingoBoard } from "@/features/bingo/hooks/useBingoBoard";
import { useBingoWinCelebration } from "@/features/bingo/hooks/useBingoWinCelebration";
import { useSavedQuizResult } from "@/features/bingo/hooks/useSavedQuizResult";

export function BingoBoardPage() {
  const { savedResult, loading: quizLoading, error: quizError } = useSavedQuizResult();
  const personalityType = savedResult?.personalityType ?? "PLANNER";
  const { challenges, completed, loading, error, toggleChallenge } = useBingoBoard(personalityType);
  const { isCelebrating } = useBingoWinCelebration(challenges, completed);

  const handleOpenDetail = useCallback(
    (challengeId: string) => {
      void toggleChallenge(challengeId);
    },
    [toggleChallenge],
  );

  if (quizLoading || loading) {
    return <LoadingSpinner />;
  }

  if (quizError || error) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <p className="text-center font-quiz-body text-sm text-destructive">{quizError || error}</p>
      </div>
    );
  }

  if (challenges.length === 0 || !savedResult) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <p className="text-center font-quiz-body text-base text-muted-foreground">
          No bingo challenges are available for your personality type right now.
        </p>
      </div>
    );
  }

  return (
    <BingoBoardLayout personalityType={savedResult.personalityType}>
      <h1 className="sr-only">Bingo board</h1>
      <BingoScreenContent variant="board">
        {isCelebrating ? (
          <BingoWinCelebrationTop personalityType={savedResult.personalityType} />
        ) : null}
        <BingoGrid
          challenges={challenges}
          completed={completed}
          personalityType={savedResult.personalityType}
          onOpenDetail={handleOpenDetail}
          className="w-full shrink-0"
        />
        {isCelebrating ? (
          <BingoWinCelebrationBottom personalityType={savedResult.personalityType} />
        ) : (
          <BingoProgressCard
            personalityType={savedResult.personalityType}
            completedCount={completed.length}
            totalCount={challenges.length}
          />
        )}
      </BingoScreenContent>
    </BingoBoardLayout>
  );
}
