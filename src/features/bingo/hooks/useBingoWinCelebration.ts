import { useCallback, useEffect, useRef, useState } from "react";
import { detectNewlyCompletedLines, isLineComplete } from "@/features/bingo/bingo.logic";
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
  syncedCompleted: string[],
): UseBingoWinCelebrationState {
  const previousSyncedCompletedRef = useRef(syncedCompleted);
  const [celebrationQueue, setCelebrationQueue] = useState<BingoLine[]>([]);

  useEffect(() => {
    const newlyCompleted = detectNewlyCompletedLines(
      previousSyncedCompletedRef.current,
      syncedCompleted,
      challenges,
    );
    previousSyncedCompletedRef.current = syncedCompleted;

    setCelebrationQueue((current) => {
      const stillComplete = current.filter((line) => isLineComplete(line, completed, challenges));
      const brokeLines = stillComplete.length !== current.length;
      const addedLines = newlyCompleted.length > 0;

      if (!brokeLines && !addedLines) {
        return current;
      }

      if (!addedLines) {
        return stillComplete;
      }

      // A celebration was already visible: show the latest newly completed line
      // immediately instead of queuing behind the older active celebration.
      if (current.length > 0) {
        const merged = [...newlyCompleted, ...stillComplete];
        const seen = new Set<string>();
        return merged.filter((line) => {
          if (seen.has(line.id)) {
            return false;
          }
          seen.add(line.id);
          return true;
        });
      }

      return [...stillComplete, ...newlyCompleted];
    });
  }, [challenges, completed, syncedCompleted]);

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
