import type { PersonalityTypeDoc, PersonalityTypeKey, QuizDoc, QuizQuestion } from "./schema";

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

export const quiz: QuizDoc = {
  quizId: "moneyPersonalityQuiz",
  title: "Money Personality Quiz",
  version: 1,
  active: true,
  questionCount: 5,
};

export const questions: QuizQuestion[] = [
  {
    questionId: "q1",
    text: "When you think about saving money, what emotion shows up first?",
    displayOrder: 1,
    options: [
      {
        optionId: "q1a",
        label: "Optimistic. Everything will be okay",
        personalityType: "PLANNER",
      },
      {
        optionId: "q1b",
        label: "Anxious. I worry I won’t have enough",
        personalityType: "WORRIER",
      },
      {
        optionId: "q1c",
        label: "Confident. I will reach my goal in time!",
        personalityType: "FREE_SPIRIT",
      },
      {
        optionId: "q1d",
        label: "Overwhelmed. I don’t know where to start",
        personalityType: "OVERWHELMED_STARTER",
      },
    ],
  },
  {
    questionId: "q2",
    text: "How do you usually approach saving money?",
    displayOrder: 2,
    options: [
      {
        optionId: "q2a",
        label: "I set a goal and work toward it constantly",
        personalityType: "PLANNER",
      },
      {
        optionId: "q2b",
        label: "I save when I feel stressed about money",
        personalityType: "WORRIER",
      },
      {
        optionId: "q2c",
        label: "I save only when I have extra left over",
        personalityType: "FREE_SPIRIT",
      },
      {
        optionId: "q2d",
        label: "I intend to save, but rarely follow through",
        personalityType: "OVERWHELMED_STARTER",
      },
    ],
  },
  {
    questionId: "q3",
    text: "When you get unexpected money, what do you typically do?",
    displayOrder: 3,
    options: [
      {
        optionId: "q3a",
        label: "Put most or all of it toward a goal",
        personalityType: "PLANNER",
      },
      {
        optionId: "q3b",
        label: "Save a bit, spend a bit. Balance is key",
        personalityType: "WORRIER",
      },
      {
        optionId: "q3c",
        label: "Spend it on something fun",
        personalityType: "FREE_SPIRIT",
      },
      {
        optionId: "q3d",
        label: "Decide later and often forget about it",
        personalityType: "OVERWHELMED_STARTER",
      },
    ],
  },
  {
    questionId: "q4",
    text: "How does your social circle affect your money choices?",
    displayOrder: 4,
    options: [
      {
        optionId: "q4a",
        label: "I set my own pace, others don’t influence me much",
        personalityType: "PLANNER",
      },
      {
        optionId: "q4b",
        label: "I try to keep up, but I feel guilty after spending",
        personalityType: "WORRIER",
      },
      {
        optionId: "q4c",
        label: "I enjoy shared experiences even if it means saving less",
        personalityType: "FREE_SPIRIT",
      },
      {
        optionId: "q4d",
        label: "I avoid thinking about money until I have to",
        personalityType: "OVERWHELMED_STARTER",
      },
    ],
  },
  {
    questionId: "q5",
    text: "What motivates you most to save?",
    displayOrder: 5,
    options: [
      {
        optionId: "q5a",
        label: "Reaching a clear goal (trip, laptop, moving out)",
        personalityType: "PLANNER",
      },
      {
        optionId: "q5b",
        label: "Reducing stress and creating stability",
        personalityType: "WORRIER",
      },
      {
        optionId: "q5c",
        label: "Having freedom to enjoy life without limits",
        personalityType: "FREE_SPIRIT",
      },
      {
        optionId: "q5d",
        label: "Pressure. I save only when something urgent comes up",
        personalityType: "OVERWHELMED_STARTER",
      },
    ],
  },
];
