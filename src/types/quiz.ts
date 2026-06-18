/** Provisional domain types — reconcile with KAN-17 when it closes. */

export const PERSONALITY_TYPES = [
  "PLANNER",
  "WORRIER",
  "FREE_SPIRIT",
  "OVERWHELMED_STARTER",
] as const;

export type PersonalityType = (typeof PERSONALITY_TYPES)[number];

export type QuizOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  options: QuizOption[];
};

export type QuizAnswer = {
  questionId: string;
  optionId: string;
};

/** User answers keyed by question id — input shape for scoreQuiz. */
export type QuizAnswersMap = Record<string, string>;

export type QuizCompletionResult = {
  personalityType: PersonalityType;
  answers: QuizAnswer[];
};

/** Persisted quiz result — matches userQuizResults/{uid} in docs/data-model/quiz.md */
export type SavedQuizResult = {
  userId: string;
  quizId: string;
  personalityType: PersonalityType;
  answers: QuizAnswersMap;
  completedAt: Date | null;
  updatedAt: Date | null;
};
