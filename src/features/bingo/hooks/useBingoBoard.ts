import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createBoard,
  getBoardState,
  getChallenges,
  updateChallengeStatus,
} from "@/services/bingo.service";
import type { BingoBoard, ChallengeStatus, UseBingoBoardState } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

export const LOAD_BINGO_BOARD_ERROR = "Could not load your bingo board. Please try again.";

function completedIdsFromBoard(board: BingoBoard): string[] {
  return Object.entries(board.challengeStatuses)
    .filter(([, status]) => status === "COMPLETED")
    .map(([challengeId]) => challengeId);
}

function boardLoadKey(uid: string, personalityType: PersonalityType): string {
  return `${uid}:${personalityType}`;
}

export function useBingoBoard(personalityType: PersonalityType): UseBingoBoardState {
  const { user, loading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState<UseBingoBoardState["challenges"]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [syncedCompleted, setSyncedCompleted] = useState<string[]>([]);
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

    async function loadBoard(): Promise<void> {
      try {
        let board = await getBoardState(currentUid);
        if (!board) {
          board = await createBoard(currentUid, personalityType);
        }

        const loadedChallenges = await getChallenges(personalityType);
        if (!cancelled) {
          const loadedCompleted = completedIdsFromBoard(board);
          setChallenges(loadedChallenges);
          setCompleted(loadedCompleted);
          setSyncedCompleted(loadedCompleted);
          setLoadedForKey(currentLoadKey);
          setError("");
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setChallenges([]);
          setCompleted([]);
          setSyncedCompleted([]);
          setLoadedForKey(currentLoadKey);
          setError(LOAD_BINGO_BOARD_ERROR);
        }
      }
    }

    void loadBoard();

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

      setCompleted((current) =>
        wasCompleted ? current.filter((id) => id !== challengeId) : [...current, challengeId],
      );

      try {
        const updated = await updateChallengeStatus(uid, challengeId, nextStatus);
        const confirmedCompleted = completedIdsFromBoard(updated);
        setCompleted(confirmedCompleted);
        setSyncedCompleted(confirmedCompleted);
        setError("");
      } catch (toggleError) {
        console.error(toggleError);
        setCompleted((current) =>
          wasCompleted ? [...current, challengeId] : current.filter((id) => id !== challengeId),
        );
        setError(LOAD_BINGO_BOARD_ERROR);
      }
    },
    [uid],
  );

  return {
    personalityType,
    challenges,
    completed,
    syncedCompleted,
    loading,
    error,
    toggleChallenge,
  };
}
