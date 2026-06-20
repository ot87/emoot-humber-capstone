/** Provisional domain types — reconcile with KAN-17 when it closes. */

export const PERSONALITY_TYPES = [
  "PLANNER",
  "WORRIER",
  "FREE_SPIRIT",
  "OVERWHELMED_STARTER",
] as const;

export type PersonalityType = (typeof PERSONALITY_TYPES)[number];

export type QUIZ_OPTION = {
  id: string;
  text: string;
};

export type QUIZ_QUESTION = {
  id: string;
  text: string;
  options: QUIZ_OPTION[];
};

export type QUIZ_ANSWER_MAP = Record<string, string>;

export type QuizAnswer = {
  questionId: string;
  optionId: string;
};

export type QUIZ_COMPLETION_RESULT = {
  personalityType: PersonalityType;
  answers: QUIZ_ANSWER_MAP;
};

export type QUIZ_RESULT_DEFINITION = {
  personalityType: PersonalityType;
  displayName: string;
  description: string;
};

/** Persisted quiz result keyed by Auth uid. */
export type SAVED_QUIZ_RESULT = {
  userId: string;
  quizId: string;
  personalityType: PersonalityType;
  answers: QUIZ_ANSWER_MAP;
  completedAt: Date | null;
  updatedAt: Date | null;
};

export type SAVE_QUIZ_RESULT_INPUT = {
  uid: string;
  quizId: string;
  personalityType: PersonalityType;
  answers: QUIZ_ANSWER_MAP;
  completedAt: Date;
};

// Legacy camelCase aliases used across the app; keep them as
// aliases to the canonical QUIZ_* types to avoid duplication.

export type QuizOption = QUIZ_OPTION;

export type Question = QUIZ_QUESTION;

/** User answers keyed by question id — input shape for scoreQuiz. */
export type QuizAnswersMap = QUIZ_ANSWER_MAP;

export type QuizCompletionResult = QUIZ_COMPLETION_RESULT;

export type QuizResultDefinition = QUIZ_RESULT_DEFINITION;

export type SavedQuizResult = SAVED_QUIZ_RESULT;

export type SaveQuizResultInput = SAVE_QUIZ_RESULT_INPUT;
