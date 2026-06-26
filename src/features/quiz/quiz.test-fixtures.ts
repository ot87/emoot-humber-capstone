import { toQuizFlowItems } from "@/features/quiz/quiz.logic";
import type { PersonalityType, Question, QuizResultDefinition } from "@/types/quiz";

const OPTION_PERSONALITY_TYPES: PersonalityType[] = [
  "PLANNER",
  "WORRIER",
  "FREE_SPIRIT",
  "OVERWHELMED_STARTER",
];

function fourOptions(texts: [string, string, string, string]): Question["options"] {
  return OPTION_PERSONALITY_TYPES.map((personalityType, index) => ({
    id: String.fromCharCode(97 + index),
    text: texts[index],
    personalityType,
  }));
}

export const testQuizQuestions: Question[] = [
  {
    id: "q1",
    text: "How do you usually approach saving?",
    category: "Emotional Trigger",
    options: fourOptions([
      "I set a goal and work toward it constantly",
      "I save when I feel stressed about money",
      "I save only when I have extra left over.",
      "I intend to save, but rarely follow through",
    ]),
  },
  {
    id: "q2",
    text: "When you get unexpected money, what do you usually do?",
    category: "Saving Style",
    options: fourOptions([
      "Put most of it straight into savings",
      "Worry about whether I should save or spend it",
      "Treat myself — I deserve it",
      "Feel overwhelmed and leave it sitting in my account",
    ]),
  },
  {
    id: "q3",
    text: "How do you feel when checking your bank balance?",
    category: "Spending Behaviour",
    options: fourOptions([
      "Calm — I know where I stand",
      "Anxious — I brace myself",
      "Indifferent — money comes and goes",
      "Confused — I avoid looking when I can",
    ]),
  },
  {
    id: "q4",
    text: "Which best describes your approach to financial goals?",
    category: "Social Influence",
    options: fourOptions([
      "I write them down and track progress regularly",
      "I think about them often but rarely act",
      "I prefer flexible goals that leave room for fun",
      "I find goal-setting stressful and avoid it",
    ]),
  },
  {
    id: "q5",
    text: "What role does money play in your daily decisions?",
    category: "Goal Motivation",
    options: fourOptions([
      "A tool I use deliberately to reach my plans",
      "A source of worry that influences most choices",
      "Something I try not to let limit my experiences",
      "A complicated topic I prefer not to think about",
    ]),
  },
];

export const testLoadedQuiz = {
  quizId: "moneyPersonalityQuiz",
  questions: testQuizQuestions,
};

export const testResultDefinitions: QuizResultDefinition[] = [
  {
    personalityType: "PLANNER",
    displayName: "The Planner",
    description: "You save better with advanced goal-tracking and streak rewards.",
  },
  {
    personalityType: "WORRIER",
    displayName: "The Worrier",
    description: "You save better with comforting nudges and stress-reducing insights.",
  },
  {
    personalityType: "FREE_SPIRIT",
    displayName: "The Free Spirit",
    description: "You save better with emotion support, fun challenges, and social engagement.",
  },
  {
    personalityType: "OVERWHELMED_STARTER",
    displayName: "The Overwhelmed Starter",
    description: "You save better with micro-steps, simple plans, and supportive guidance.",
  },
];

export const testResultDefinitionsByType = Object.fromEntries(
  testResultDefinitions.map((definition) => [definition.personalityType, definition]),
) as Record<PersonalityType, QuizResultDefinition>;

export const testQuizFlowItems = toQuizFlowItems(testQuizQuestions);
