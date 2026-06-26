import { useCallback } from "react";
import {
  SAVE_QUIZ_RESULT_ERROR,
  useSaveQuizResult,
  type SaveCompletionOutcome,
} from "@/features/quiz/hooks/useSaveQuizResult";
import type { PendingQuizCompletion } from "@/features/quiz/quiz.route-state";

export type UsePersistPendingQuizResultState = {
  persistPending: (
    pending: PendingQuizCompletion | null | undefined,
    uidOverride?: string,
  ) => Promise<SaveCompletionOutcome>;
  saveErrorMessage: typeof SAVE_QUIZ_RESULT_ERROR;
};

export function usePersistPendingQuizResult(): UsePersistPendingQuizResultState {
  const { saveCompletion } = useSaveQuizResult();

  const persistPending = useCallback(
    async (
      pending: PendingQuizCompletion | null | undefined,
      uidOverride?: string,
    ): Promise<SaveCompletionOutcome> => {
      if (!pending) {
        return "skipped";
      }

      return saveCompletion(
        {
          personalityType: pending.personalityType,
          answers: pending.answers,
        },
        pending.quizId,
        uidOverride,
      );
    },
    [saveCompletion],
  );

  return {
    persistPending,
    saveErrorMessage: SAVE_QUIZ_RESULT_ERROR,
  };
}
