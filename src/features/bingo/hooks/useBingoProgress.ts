import { useCallback, useEffect, useRef, useState } from "react";

import type { BingoBoard, ChallengeStatus } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createBoard, getBoardState, updateChallengeStatus } from "@/services/bingo.service";

export const LOAD_BINGO_PROGRESS_ERROR = "Could not load your bingo board. Please try again.";

/** The completion half of the board contract: the completed set plus its toggle. */
export type UseBingoProgressState = {
  completed: string[];
  loading: boolean;
  error: string;
  toggleChallenge: (challengeId: string) => Promise<void>;
};

function completedIdsFromBoard(board: BingoBoard): string[] {
  return Object.entries(board.challengeStatuses)
    .filter(([, status]) => status === "COMPLETED")
    .map(([challengeId]) => challengeId);
}

function boardLoadKey(uid: string, personalityType: PersonalityType): string {
  return `${uid}:${personalityType}`;
}

export function useBingoProgress(personalityType: PersonalityType): UseBingoProgressState {
  const { user, loading: authLoading } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);
  const completedRef = useRef(completed);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  const [loadedForKey, setLoadedForKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const uid = user?.uid ?? null;
  const loadKey = uid !== null ? boardLoadKey(uid, personalityType) : null;
  const awaitingFetch = loadKey !== null && loadedForKey !== loadKey;
  const loading = authLoading || awaitingFetch;

  useEffect(() => {
    if (authLoading || uid === null || loadKey === null || loadedForKey === loadKey) {
      return;
    }

    let cancelled = false;
    const currentUid = uid;
    const currentLoadKey = loadKey;

    async function loadProgress(): Promise<void> {
      try {
        // createBoard writes unconditionally, so it runs only when no board exists
        // yet; an existing board's progress must never be overwritten on reload.
        let board = await getBoardState(currentUid);
        if (!board) {
          board = await createBoard(currentUid, personalityType);
        }

        if (!cancelled) {
          setCompleted(completedIdsFromBoard(board));
          setLoadedForKey(currentLoadKey);
          setError("");
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setCompleted([]);
          setLoadedForKey(currentLoadKey);
          setError(LOAD_BINGO_PROGRESS_ERROR);
        }
      }
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [authLoading, uid, loadKey, loadedForKey, personalityType]);

  const toggleChallenge = useCallback(
    async (challengeId: string): Promise<void> => {
      if (!uid) {
        return;
      }

      const wasCompleted = completedRef.current.includes(challengeId);
      const nextStatus: ChallengeStatus = wasCompleted ? "NOT_STARTED" : "COMPLETED";

      // Flip locally first for instant feedback, then reconcile with the board the
      // service returns; on failure, roll the optimistic change back.
      setCompleted((current) =>
        wasCompleted ? current.filter((id) => id !== challengeId) : [...current, challengeId],
      );

      try {
        const updated = await updateChallengeStatus(uid, challengeId, nextStatus);

        setCompleted(completedIdsFromBoard(updated));
        setError("");
      } catch (toggleError) {
        console.error(toggleError);
        setCompleted((current) =>
          wasCompleted ? [...current, challengeId] : current.filter((id) => id !== challengeId),
        );
        setError(LOAD_BINGO_PROGRESS_ERROR);
      }
    },
    [uid],
  );

  return {
    completed,
    loading,
    error,
    toggleChallenge,
  };
}
