/** Provisional domain types — reconcile with KAN-17 when it closes. */

export type PersonalityType = "planner" | "worrier" | "free-spirit" | "overwhelmed-starter";

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
