import type { PersonalityTypeDoc, PersonalityTypeKey, QuizDoc, QuizQuestion } from "./schema";

// =============================================================================
// personalityTypes - FINAL copy (from the result screens). Nothing to fill here.
// =============================================================================
export const personalityTypes: Record<PersonalityTypeKey, PersonalityTypeDoc> = {
  PLANNER: {
    personalityType: "PLANNER",
    displayName: "The Planner",
    description: "You save better with advanced goal-tracking and streak rewards.",
  },
  WORRIER: {
    personalityType: "WORRIER",
    displayName: "The Worrier",
    description: "You save better with comforting nudges and stress-reducing insights.",
  },
  FREE_SPIRIT: {
    personalityType: "FREE_SPIRIT",
    displayName: "The Free Spirit",
    description: "You save better with emotion support, fun challenges, and social engagement.",
  },
  OVERWHELMED_STARTER: {
    personalityType: "OVERWHELMED_STARTER",
    displayName: "The Overwhelmed Starter",
    description: "You save better with micro-steps, simple plans, and supportive guidance.",
  },
};

// =============================================================================
// quiz - metadata is final; questions need your copy + the option->type mapping.
// =============================================================================
export const quiz: QuizDoc = {
  quizId: "moneyPersonalityQuiz",
  title: "Money Personality Quiz",
  version: 1,
  active: true,
  questionCount: 5,
};

// FLAG: paste the exact question text and option labels from the Figma/quiz spec,
// and CONFIRM each option's personalityType. The A/B/C/D -> type mapping below is a
// placeholder guess; scoring is wrong if it is off, and Q1 is weighted x2.
export const questions: QuizQuestion[] = [
  {
    questionId: "q1",
    text: "FLAG (Saving Style): paste question text",
    displayOrder: 1,
    options: [
      { optionId: "q1a", label: "FLAG", personalityType: "PLANNER" },
      { optionId: "q1b", label: "FLAG", personalityType: "WORRIER" },
      { optionId: "q1c", label: "FLAG", personalityType: "FREE_SPIRIT" },
      { optionId: "q1d", label: "FLAG", personalityType: "OVERWHELMED_STARTER" },
    ],
  },
  {
    questionId: "q2",
    text: "FLAG (Spending Habits): paste question text",
    displayOrder: 2,
    options: [
      { optionId: "q2a", label: "FLAG", personalityType: "PLANNER" },
      { optionId: "q2b", label: "FLAG", personalityType: "WORRIER" },
      { optionId: "q2c", label: "FLAG", personalityType: "FREE_SPIRIT" },
      { optionId: "q2d", label: "FLAG", personalityType: "OVERWHELMED_STARTER" },
    ],
  },
  {
    questionId: "q3",
    text: "FLAG (Money Mindset): paste question text",
    displayOrder: 3,
    options: [
      { optionId: "q3a", label: "FLAG", personalityType: "PLANNER" },
      { optionId: "q3b", label: "FLAG", personalityType: "WORRIER" },
      { optionId: "q3c", label: "FLAG", personalityType: "FREE_SPIRIT" },
      { optionId: "q3d", label: "FLAG", personalityType: "OVERWHELMED_STARTER" },
    ],
  },
  {
    questionId: "q4",
    text: "FLAG (Financial Goals): paste question text",
    displayOrder: 4,
    options: [
      { optionId: "q4a", label: "FLAG", personalityType: "PLANNER" },
      { optionId: "q4b", label: "FLAG", personalityType: "WORRIER" },
      { optionId: "q4c", label: "FLAG", personalityType: "FREE_SPIRIT" },
      { optionId: "q4d", label: "FLAG", personalityType: "OVERWHELMED_STARTER" },
    ],
  },
  {
    questionId: "q5",
    text: "FLAG (Q5): paste question text",
    displayOrder: 5,
    options: [
      { optionId: "q5a", label: "FLAG", personalityType: "PLANNER" },
      { optionId: "q5b", label: "FLAG", personalityType: "WORRIER" },
      { optionId: "q5c", label: "FLAG", personalityType: "FREE_SPIRIT" },
      { optionId: "q5d", label: "FLAG", personalityType: "OVERWHELMED_STARTER" },
    ],
  },
];
