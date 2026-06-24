import {
  useLoadQuizResult,
  type UseLoadQuizResultState,
} from "@/features/quiz/hooks/useLoadQuizResult";

export type SavedQuizResultState = UseLoadQuizResultState;

export function useSavedQuizResult(): SavedQuizResultState {
  return useLoadQuizResult();
}
