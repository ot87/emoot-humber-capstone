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
  personalityType: PersonalityType;
};

export type Question = {
  id: string;
  text: string;
  options: QuizOption[];
};

/** User answers keyed by question id — input shape for scoreQuiz. */
export type QuizAnswersMap = Record<string, string>;

export type QuizAnswer = {
  questionId: string;
  optionId: string;
};

export type QuizCompletionResult = {
  personalityType: PersonalityType;
  answers: QuizAnswersMap;
};

export type QuizResultDefinition = {
  personalityType: PersonalityType;
  displayName: string;
  description: string;
};

/** Persisted quiz result keyed by Auth uid. */
export type SavedQuizResult = {
  userId: string;
  quizId: string;
  personalityType: PersonalityType;
  answers: QuizAnswersMap;
  completedAt: Date | null;
  updatedAt: Date | null;
};
