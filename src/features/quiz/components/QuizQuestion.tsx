import { AppContentShell } from "@/components/layout/AppContentShell";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/quiz";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

/** Figma option tile — reconcile in KAN-14 if the frame updates. */
const OPTION_BOX = "size-[147.76px]";

type QuizQuestionProps = {
  question: Question;
  selectedOptionId?: string | null;
  heading?: string;
  onSelect: (optionId: string) => void;
};

export function QuizQuestion({
  question,
  selectedOptionId = null,
  heading,
  onSelect,
}: QuizQuestionProps) {
  const headingId = `${question.id}-heading`;

  return (
    <AppContentShell
      as="section"
      aria-labelledby={heading ? headingId : undefined}
      className="flex min-h-0 flex-1 flex-col items-center justify-evenly overflow-y-auto py-8 sm:py-10 lg:py-12"
    >
      <div className="flex w-full flex-col items-center gap-4">
        {heading ? (
          <h2
            id={headingId}
            className="text-center font-quiz-body text-[32px] font-bold leading-tight text-quiz-copy"
          >
            {heading}
          </h2>
        ) : null}

        <p className="max-w-[20rem] text-center font-quiz-body text-2xl font-normal leading-snug text-quiz-copy sm:max-w-sm [@media(max-height:700px)]:text-xl">
          {question.text}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={question.text}
        className="grid w-fit grid-cols-2 gap-x-6 gap-y-10"
      >
        {question.options.map((option, index) => {
          const letter = OPTION_LETTERS[index];
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.id)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl px-2 text-center transition-colors",
                OPTION_BOX,
                isSelected ? "bg-quiz-option-selected" : "bg-quiz-option hover:bg-quiz-option/90",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute -top-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-quiz-option-badge font-quiz-body text-base font-normal text-quiz-copy shadow-sm"
              >
                {letter}
              </span>
              <span
                className={cn(
                  "font-quiz-body text-base font-normal leading-snug",
                  isSelected ? "text-quiz-option-selected-foreground" : "text-quiz-copy",
                )}
              >
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </AppContentShell>
  );
}
