import { useCallback, useRef, useState } from "react";

import type { FeedbackVote } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { submitFeedback as submitFeedbackService } from "@/services/bingo.service";

export const SUBMIT_FEEDBACK_ERROR = "Could not submit your feedback. Please try again.";

export type SubmitFeedbackOutcome = "submitted" | "skipped" | "failed";

export type UseSubmitFeedbackState = {
  submitFeedback: (helpful: FeedbackVote) => Promise<SubmitFeedbackOutcome>;
  submitting: boolean;
  submitted: boolean;
  error: string;
};

/**
 * Feedback is once per board within this hook's lifetime: while a submit is in
 * flight or after one succeeds, further calls are skipped. Cross-session gating
 * comes from the board's feedbackSubmitted flag and is the consuming UI's
 * concern, not this hook's.
 */
export function useSubmitFeedback(personalityType: PersonalityType): UseSubmitFeedbackState {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  // State lags a render behind, so a rapid double-tap needs a synchronous guard.
  const guardRef = useRef(false);

  const submitFeedback = useCallback(
    async (helpful: FeedbackVote): Promise<SubmitFeedbackOutcome> => {
      if (!uid || guardRef.current) {
        return "skipped";
      }

      guardRef.current = true;
      setSubmitting(true);
      try {
        await submitFeedbackService(uid, personalityType, helpful);
        setSubmitted(true);
        setError("");

        return "submitted";
      } catch (err) {
        console.error(err);
        // A failed vote never landed, so the user may retry.
        guardRef.current = false;
        setError(SUBMIT_FEEDBACK_ERROR);

        return "failed";
      } finally {
        setSubmitting(false);
      }
    },
    [uid, personalityType],
  );

  return { submitFeedback, submitting, submitted, error };
}
