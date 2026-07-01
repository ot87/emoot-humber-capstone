import { useCallback } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { isBoardComplete } from "@/features/bingo/bingo.logic";
import { BingoBoardLayout } from "@/features/bingo/components/BingoBoardLayout";
import { BingoBoardCompleteCard } from "@/features/bingo/components/BingoBoardCompleteCard";
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
  const { challenges, completed, syncedCompleted, loading, error, toggleChallenge } =
    useBingoBoard(personalityType);
  const { activeCelebration, isCelebrating } = useBingoWinCelebration(
    challenges,
    completed,
    syncedCompleted,
  );

  const handleOpenDetail = useCallback(
    (challengeId: string) => {
      void toggleChallenge(challengeId);
    },
    [toggleChallenge],
  );

  const handleViewAchievement = useCallback(() => {
    // Achievement route not yet implemented — stub for KAN-49.
  }, []);

  const boardComplete = isBoardComplete(completed.length, challenges.length);

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
        {!boardComplete && activeCelebration ? (
          <BingoWinCelebrationTop
            personalityType={savedResult.personalityType}
            line={activeCelebration}
          />
        ) : null}
        <BingoGrid
          challenges={challenges}
          completed={completed}
          personalityType={savedResult.personalityType}
          onOpenDetail={handleOpenDetail}
          className="w-full shrink-0"
        />
        {boardComplete ? (
          <BingoBoardCompleteCard
            personalityType={savedResult.personalityType}
            onViewAchievement={handleViewAchievement}
          />
        ) : isCelebrating ? (
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
