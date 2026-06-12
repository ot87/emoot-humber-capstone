import type { PersonalityType, QuizAnswer } from "@/types/quiz";

/**
 * TEMPORARY scoring stub — KAN-29 replaces this implementation at this seam.
 * Delete this stub when KAN-29 lands; this ticket is not reopened.
 */
export function scoreQuiz(answers: QuizAnswer[]): PersonalityType {
  void answers;
  return "planner";
}
