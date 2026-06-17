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
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;
    const uid = user.uid;

    async function loadSavedResult(): Promise<void> {
      setFetchLoading(true);
      setError("");

      try {
        const result = await getSavedQuizResult(uid);
        if (!cancelled) {
          setSavedResult(result);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setSavedResult(null);
          setError("Could not load your quiz result. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setFetchLoading(false);
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
    loading: authLoading || (user !== null && fetchLoading),
    error,
    hasSavedResult: resolvedResult !== null,
  };
}
