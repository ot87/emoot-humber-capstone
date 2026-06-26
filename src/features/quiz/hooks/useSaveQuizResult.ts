import { useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { saveQuizResult } from "@/services/quiz.service";
import type { QuizCompletionResult } from "@/types/quiz";

export const SAVE_QUIZ_RESULT_ERROR = "Could not save your quiz result. Please try again.";

export type SaveCompletionOutcome = "saved" | "skipped" | "failed";

export type UseSaveQuizResultState = {
  saveCompletion: (
    completion: QuizCompletionResult,
    quizId: string,
    uidOverride?: string,
  ) => Promise<SaveCompletionOutcome>;
};

export function useSaveQuizResult(): UseSaveQuizResultState {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const saveCompletion = useCallback(
    async (
      completion: QuizCompletionResult,
      quizId: string,
      uidOverride?: string,
    ): Promise<SaveCompletionOutcome> => {
      const effectiveUid = uidOverride ?? uid;
      if (!effectiveUid) {
        return "skipped";
      }

      try {
        await saveQuizResult(
          effectiveUid,
          quizId,
          completion.answers,
          completion.personalityType,
          new Date(),
        );
        return "saved";
      } catch (err) {
        console.error(err);
        return "failed";
      }
    },
    [uid],
  );

  return { saveCompletion };
}
