import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getSavedQuizResult } from "@/services/quiz.service";
import type { SavedQuizResult } from "@/types/quiz";

export type UseLoadQuizResultState = {
  savedResult: SavedQuizResult | null;
  loading: boolean;
  error: string;
  hasSavedResult: boolean;
};

export function useLoadQuizResult(): UseLoadQuizResultState {
  const { user, loading: authLoading } = useAuth();
  const [savedResult, setSavedResult] = useState<SavedQuizResult | null>(null);
  // Uid we last fetched (or attempted) for; keyed by uid so auth user object
  // reference changes alone do not trigger another Firestore read.
  const [loadedForUid, setLoadedForUid] = useState<string | null>(null);
  const [error, setError] = useState("");

  const uid = user?.uid ?? null;
  // Signed in but saved result not yet resolved for this uid.
  const awaitingFetch = uid !== null && loadedForUid !== uid;

  useEffect(() => {
    // Skip until auth settles, user is signed out, or we already fetched for this uid.
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

  const resolvedResult = user ? savedResult : null;

  return {
    savedResult: resolvedResult,
    loading: authLoading || awaitingFetch,
    error,
    hasSavedResult: resolvedResult !== null,
  };
}
