/** Provisional domain types — reconcile with KAN-17 when it closes. */

export const PERSONALITY_TYPES = [
  "planner",
  "worrier",
  "free-spirit",
  "overwhelmed-starter",
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

export type QuizCompletionResult = {
  personalityType: PersonalityType;
  answers: QuizAnswer[];
};
