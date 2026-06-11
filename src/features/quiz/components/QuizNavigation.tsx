import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const activeNavButton = "bg-quiz-brand text-quiz-brand-foreground hover:bg-quiz-brand/90";
const disabledNavButton = "cursor-not-allowed bg-quiz-brand/30 text-quiz-footer";

type QuizNavigationProps = {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function QuizNavigation({
  canGoBack,
  canGoNext,
  isLastQuestion,
  onBack,
  onNext,
}: QuizNavigationProps) {
  return (
    <nav
      aria-label="Quiz navigation"
      className="mx-auto flex w-full max-w-[430px] shrink-0 items-center justify-between px-4 pb-8 sm:px-6 lg:max-w-lg lg:px-8 xl:max-w-xl"
    >
      <button
        type="button"
        aria-label="Previous question"
        disabled={!canGoBack}
        onClick={onBack}
        className={cn(
          "flex size-12 items-center justify-center rounded-full transition-colors",
          canGoBack ? activeNavButton : disabledNavButton,
        )}
      >
        <ChevronLeft className={cn("size-6", !canGoBack && "stroke-[1.75]")} aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label={isLastQuestion ? "Finish quiz" : "Next question"}
        disabled={!canGoNext}
        onClick={onNext}
        className={cn(
          "flex size-12 items-center justify-center rounded-full transition-colors",
          canGoNext ? activeNavButton : disabledNavButton,
        )}
      >
        <ChevronRight className={cn("size-6", canGoNext && "stroke-[2.5]")} aria-hidden="true" />
      </button>
    </nav>
  );
}
