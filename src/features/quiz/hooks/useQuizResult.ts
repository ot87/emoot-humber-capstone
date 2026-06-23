import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getActiveQuizId, getSavedQuizResult, saveQuizResult } from "@/services/quiz.service";
import type { QuizCompletionResult, SavedQuizResult } from "@/types/quiz";

export type UseQuizResultState = {
  savedResult: SavedQuizResult | null;
  loading: boolean;
  error: string;
  hasSavedResult: boolean;
  saveCompletion: (completion: QuizCompletionResult, quizId?: string) => Promise<boolean>;
};

export function useQuizResult(): UseQuizResultState {
  const { user, loading: authLoading } = useAuth();
  const [savedResult, setSavedResult] = useState<SavedQuizResult | null>(null);
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null);
  const [error, setError] = useState("");

  const uid = user?.uid ?? null;
  const awaitingFetch = uid !== null && loadedForUid !== uid;

  useEffect(() => {
    if (authLoading || uid === null || loadedForUid === uid) {
      return;
    }

    let cancelled = false;
    const currentUid = uid;

    async function loadSavedResult(): Promise<void> {
      try {
        const result = await getSavedQuizResult(currentUid);
        if (!cancelled) {
          setSavedResult(result);
          setLoadedForUid(currentUid);
          setError("");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setSavedResult(null);
          setLoadedForUid(currentUid);
          setError("Could not load your quiz result. Please try again.");
        }
      }
    }

    void loadSavedResult();

    return () => {
      cancelled = true;
    };
  }, [authLoading, uid, loadedForUid]);

  const saveCompletion = useCallback(
    async (completion: QuizCompletionResult, quizId?: string): Promise<boolean> => {
      if (!uid) {
        return false;
      }

      try {
        const resolvedQuizId = quizId ?? (await getActiveQuizId());
        if (!resolvedQuizId) {
          setError("Could not save your quiz result. Please try again.");
          return false;
        }

        const saved = await saveQuizResult(
          uid,
          resolvedQuizId,
          completion.answers,
          completion.personalityType,
          new Date(),
        );
        setSavedResult(saved);
        setLoadedForUid(uid);
        setError("");
        return true;
      } catch (err) {
        console.error(err);
        setError("Could not save your quiz result. Please try again.");
        return false;
      }
    },
    [uid],
  );

  const resolvedResult = user ? savedResult : null;

  return {
    savedResult: resolvedResult,
    loading: authLoading || awaitingFetch,
    error,
    hasSavedResult: resolvedResult !== null,
    saveCompletion,
  };
}
