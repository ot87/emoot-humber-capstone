import { useQuizResult } from "@/features/quiz/hooks/useQuizResult";
import type { SavedQuizResult } from "@/types/quiz";

export type SavedQuizResultState = {
  savedResult: SavedQuizResult | null;
  loading: boolean;
  error: string;
  hasSavedResult: boolean;
};

export function useSavedQuizResult(): SavedQuizResultState {
  const { savedResult, loading, error, hasSavedResult } = useQuizResult();

  return {
    savedResult,
    loading,
    error,
    hasSavedResult,
  };
}
