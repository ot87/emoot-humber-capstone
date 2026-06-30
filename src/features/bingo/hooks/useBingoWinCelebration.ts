import { useCallback, useEffect, useRef, useState } from "react";
import { detectNewlyCompletedLines } from "@/features/bingo/bingo.logic";
import type { BingoChallenge, BingoLine } from "@/types/bingo";

export type UseBingoWinCelebrationState = {
  activeCelebration: BingoLine | null;
  isCelebrating: boolean;
  queuedCelebrationCount: number;
  dismissCelebration: () => void;
};

export function useBingoWinCelebration(
  challenges: BingoChallenge[],
  completed: string[],
): UseBingoWinCelebrationState {
  const previousCompletedRef = useRef(completed);
  const [celebrationQueue, setCelebrationQueue] = useState<BingoLine[]>([]);

  useEffect(() => {
    const newlyCompleted = detectNewlyCompletedLines(
      previousCompletedRef.current,
      completed,
      challenges,
    );
    previousCompletedRef.current = completed;

    if (newlyCompleted.length > 0) {
      setCelebrationQueue((current) => [...current, ...newlyCompleted]);
    }
  }, [challenges, completed]);

  const activeCelebration = celebrationQueue[0] ?? null;

  const dismissCelebration = useCallback(() => {
    setCelebrationQueue((current) => current.slice(1));
  }, []);

  return {
    activeCelebration,
    isCelebrating: activeCelebration !== null,
    queuedCelebrationCount: celebrationQueue.length,
    dismissCelebration,
  };
}
