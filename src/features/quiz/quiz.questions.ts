import type { Question } from "@/types/quiz";

export type QuizFlowItem = {
  heading: string;
  question: Question;
};

export function toQuizFlowItems(questions: Question[]): QuizFlowItem[] {
  return questions.map((question, index) => ({
    heading: `Q${index + 1}`,
    question,
  }));
}
