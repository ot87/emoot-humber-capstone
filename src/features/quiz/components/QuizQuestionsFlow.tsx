import type { QuizFlowItem } from "@/features/quiz/quiz.questions";
import { QuizNavigation } from "@/features/quiz/components/QuizNavigation";
import { QuizProgressBar } from "@/features/quiz/components/QuizProgressBar";
import { QuizQuestion } from "@/features/quiz/components/QuizQuestion";

type QuizQuestionsFlowProps = {
  item: QuizFlowItem;
  currentQuestionNumber: number;
  totalQuestions: number;
  progressPercent: number;
  selectedOptionId: string | null;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onSelect: (optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function QuizQuestionsFlow({
  item,
  currentQuestionNumber,
  totalQuestions,
  progressPercent,
  selectedOptionId,
  canGoBack,
  canGoNext,
  isLastQuestion,
  onSelect,
  onBack,
  onNext,
}: QuizQuestionsFlowProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <QuizProgressBar
        currentQuestion={currentQuestionNumber}
        totalQuestions={totalQuestions}
        percent={progressPercent}
      />
      <QuizQuestion
        question={item.question}
        heading={item.heading}
        selectedOptionId={selectedOptionId}
        onSelect={onSelect}
      />
      <QuizNavigation
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        isLastQuestion={isLastQuestion}
        onBack={onBack}
        onNext={onNext}
      />
    </main>
  );
}
