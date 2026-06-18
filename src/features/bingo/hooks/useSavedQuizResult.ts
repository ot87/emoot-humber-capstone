import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getSavedQuizResult } from "@/services/quiz.service";
import type { SavedQuizResult } from "@/types/quiz";

export type SavedQuizResultState = {
  savedResult: SavedQuizResult | null;
  loading: boolean;
  error: string;
  hasSavedResult: boolean;
};

export function useSavedQuizResult(): SavedQuizResultState {
  const { user, loading: authLoading } = useAuth();
  const [savedResult, setSavedResult] = useState<SavedQuizResult | null>(null);
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null);
  const [error, setError] = useState("");

  const uid = user?.uid ?? null;
  const awaitingFetch = uid !== null && loadedForUid !== uid;

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;
    const currentUid = user.uid;

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
  }, [authLoading, user]);

  const resolvedResult = user ? savedResult : null;

  return {
    savedResult: resolvedResult,
    loading: authLoading || awaitingFetch,
    error,
    hasSavedResult: resolvedResult !== null,
  };
}
