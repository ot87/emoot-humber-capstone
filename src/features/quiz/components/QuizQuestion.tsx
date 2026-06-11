import { cn } from "@/lib/utils";
import type { Question } from "@/types/quiz";

const CONTENT_SHELL = "mx-auto w-full max-w-[430px] px-4 sm:px-6 lg:max-w-lg lg:px-8 xl:max-w-xl";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

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
    <section
      aria-labelledby={heading ? headingId : undefined}
      className={cn(CONTENT_SHELL, "flex flex-col items-center")}
    >
      {heading ? (
        <h2
          id={headingId}
          className="text-center font-quiz-body text-[32px] font-bold leading-tight text-quiz-copy"
        >
          {heading}
        </h2>
      ) : null}

      <p
        className={cn(
          "max-w-[20rem] text-center font-quiz-body text-2xl font-normal leading-snug text-quiz-copy sm:max-w-sm",
          heading ? "mt-4" : undefined,
        )}
      >
        {question.text}
      </p>

      <div
        role="radiogroup"
        aria-label={question.text}
        className="mt-10 grid w-fit grid-cols-2 gap-x-6 gap-y-10"
      >
        {question.options.map((option, index) => {
          const letter = OPTION_LETTERS[index] ?? String(index + 1);
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
    </section>
  );
}
