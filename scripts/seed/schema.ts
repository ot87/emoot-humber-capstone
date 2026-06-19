import { z } from "zod";

// The four personality keys. UPPERCASE, matches the data model and the doc IDs.
export const PERSONALITY_TYPE_KEYS = [
  "PLANNER",
  "WORRIER",
  "FREE_SPIRIT",
  "OVERWHELMED_STARTER",
] as const;

export const personalityTypeKeySchema = z.enum(PERSONALITY_TYPE_KEYS);
export type PersonalityTypeKey = z.infer<typeof personalityTypeKeySchema>;

// personalityTypes/{TYPE}
export const personalityTypeDocSchema = z.object({
  personalityType: personalityTypeKeySchema,
  displayName: z.string().min(1),
  description: z.string().min(1),
});
export type PersonalityTypeDoc = z.infer<typeof personalityTypeDocSchema>;

// One option embedded in a question's options array.
export const quizOptionSchema = z.object({
  optionId: z.string().min(1),
  label: z.string().min(1),
  // The type this answer scores. Drives the weighted result (Q1 counts x2).
  personalityType: personalityTypeKeySchema,
});
export type QuizOption = z.infer<typeof quizOptionSchema>;

// quizzes/{quizId}/questions/{questionId}
export const quizQuestionSchema = z.object({
  questionId: z.string().min(1),
  text: z.string().min(1),
  displayOrder: z.number().int().positive(),
  options: z.array(quizOptionSchema).length(4),
});
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

// quizzes/{quizId}
export const quizDocSchema = z.object({
  quizId: z.string().min(1),
  title: z.string().min(1),
  version: z.number().int().positive(),
  active: z.boolean(),
  questionCount: z.number().int().positive(),
});
export type QuizDoc = z.infer<typeof quizDocSchema>;

// One challenge embedded in a bingo board's challenges array.
export const bingoChallengeSchema = z.object({
  challengeId: z.string().min(1),
  position: z.number().int().min(0).max(8),
  title: z.string().min(1), // "Bingo Card" - the short tile label
  whatToDo: z.string().min(1), // "What to Do" - the action
  whyItMatters: z.string().min(1), // "Why it Matters" - the rationale
});
export type BingoChallenge = z.infer<typeof bingoChallengeSchema>;

// bingoChallenges/{TYPE}
export const bingoChallengesDocSchema = z.object({
  personalityType: personalityTypeKeySchema,
  challenges: z.array(bingoChallengeSchema).length(9),
});
export type BingoChallengesDoc = z.infer<typeof bingoChallengesDocSchema>;
