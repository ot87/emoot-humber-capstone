import type { Question } from "@/types/quiz";

export type QuizFlowItem = {
  heading: string;
  question: Question;
};

const fourOptions = (texts: [string, string, string, string]): Question["options"] => [
  { id: "a", text: texts[0] },
  { id: "b", text: texts[1] },
  { id: "c", text: texts[2] },
  { id: "d", text: texts[3] },
];

/** TEMPORARY mock data — consumed only via quiz.questions.ts; KAN-28 deletes this file. */
export const mockQuizItems: QuizFlowItem[] = [
  {
    heading: "Q1. Saving Style",
    question: {
      id: "q1",
      text: "How do you usually approach saving?",
      options: fourOptions([
        "I set a goal and work toward it constantly",
        "I save when I feel stressed about money",
        "I save only when I have extra left over.",
        "I intend to save, but rarely follow through",
      ]),
    },
  },
  {
    heading: "Q2. Spending Habits",
    question: {
      id: "q2",
      text: "When you get unexpected money, what do you usually do?",
      options: fourOptions([
        "Put most of it straight into savings",
        "Worry about whether I should save or spend it",
        "Treat myself — I deserve it",
        "Feel overwhelmed and leave it sitting in my account",
      ]),
    },
  },
  {
    heading: "Q3. Money Mindset",
    question: {
      id: "q3",
      text: "How do you feel when checking your bank balance?",
      options: fourOptions([
        "Calm — I know where I stand",
        "Anxious — I brace myself",
        "Indifferent — money comes and goes",
        "Confused — I avoid looking when I can",
      ]),
    },
  },
  {
    heading: "Q4. Financial Goals",
    question: {
      id: "q4",
      text: "Which best describes your approach to financial goals?",
      options: fourOptions([
        "I write them down and track progress regularly",
        "I think about them often but rarely act",
        "I prefer flexible goals that leave room for fun",
        "I find goal-setting stressful and avoid it",
      ]),
    },
  },
  {
    heading: "Q5. Money & Emotions",
    question: {
      id: "q5",
      text: "What role does money play in your daily decisions?",
      options: fourOptions([
        "A tool I use deliberately to reach my plans",
        "A source of worry that influences most choices",
        "Something I try not to let limit my experiences",
        "A complicated topic I prefer not to think about",
      ]),
    },
  },
];
