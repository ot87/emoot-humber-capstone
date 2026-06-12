import { useCallback, useMemo, useState } from "react";
import type { QuizFlowItem } from "@/features/quiz/quiz.questions";
import { scoreQuiz } from "@/features/quiz/quiz.logic";
import type { QuizAnswer, QuizCompletionResult } from "@/types/quiz";

type QuizStep = "landing" | "questions";

export type UseQuizState = {
  step: QuizStep;
  currentIndex: number;
  totalQuestions: number;
  currentItem: QuizFlowItem | null;
  selectedOptionId: string | null;
  answers: QuizAnswer[];
  progressPercent: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  start: () => void;
  selectOption: (optionId: string) => void;
  goBack: () => void;
  goNext: () => void;
  complete: () => QuizCompletionResult | null;
};

function allQuestionsAnswered(items: QuizFlowItem[], answers: QuizAnswer[]): boolean {
  return items.every((item) => answers.some((answer) => answer.questionId === item.question.id));
}

export function useQuiz(items: QuizFlowItem[]): UseQuizState {
  const [step, setStep] = useState<QuizStep>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const currentItem = step === "questions" ? (items[currentIndex] ?? null) : null;

  const selectedOptionId = useMemo(() => {
    if (!currentItem) {
      return null;
    }

    return (
      answers.find((answer) => answer.questionId === currentItem.question.id)?.optionId ?? null
    );
  }, [answers, currentItem]);

  const progressPercent =
    items.length === 0 ? 0 : Math.round(((currentIndex + 1) / items.length) * 100);

  const canGoBack = currentIndex > 0;
  const canGoNext = selectedOptionId !== null;
  const isLastQuestion = currentIndex === items.length - 1;

  const start = useCallback(() => {
    setStep("questions");
    setCurrentIndex(0);
    setAnswers([]);
  }, []);

  const selectOption = useCallback(
    (optionId: string) => {
      const item = items[currentIndex];
      if (!item) {
        return;
      }

      const questionId = item.question.id;
      setAnswers((previous) => [
        ...previous.filter((answer) => answer.questionId !== questionId),
        { questionId, optionId },
      ]);
    },
    [currentIndex, items],
  );

  const goBack = useCallback(() => {
    setCurrentIndex((index) => (index > 0 ? index - 1 : index));
  }, []);

  const goNext = useCallback(() => {
    if (selectedOptionId === null) {
      return;
    }

    setCurrentIndex((index) => (index < items.length - 1 ? index + 1 : index));
  }, [items.length, selectedOptionId]);

  const complete = useCallback((): QuizCompletionResult | null => {
    if (!allQuestionsAnswered(items, answers)) {
      return null;
    }

    return {
      personalityType: scoreQuiz(answers),
      answers,
    };
  }, [answers, items]);

  return {
    step,
    currentIndex,
    totalQuestions: items.length,
    currentItem,
    selectedOptionId,
    answers,
    progressPercent,
    canGoBack,
    canGoNext,
    isLastQuestion,
    start,
    selectOption,
    goBack,
    goNext,
    complete,
  };
}
