import { BINGO_TASK_ICON } from "@/features/bingo/bingo.icons";
import { getRemainingChallengeCount } from "@/features/bingo/bingo.logic";
import { getPersonalityResultTheme } from "@/features/quiz/quiz.result";
import { cn } from "@/lib/utils";
import type { PersonalityType } from "@/types/quiz";

type BingoProgressCardProps = {
  personalityType: PersonalityType;
  completedCount: number;
  totalCount: number;
  className?: string;
};

export function BingoProgressCard({
  personalityType,
  completedCount,
  totalCount,
  className,
}: BingoProgressCardProps) {
  const remaining = getRemainingChallengeCount(completedCount, totalCount);
  const theme = getPersonalityResultTheme(personalityType);

  return (
    <section
      aria-label="Bingo progress"
      className={cn(
        "flex shrink-0 flex-col items-center gap-3 rounded-2xl px-4 py-3 text-center sm:gap-4 sm:px-5 sm:py-4",
        theme.surfaceClass,
        className,
      )}
    >
      <img
        src={BINGO_TASK_ICON.trophy}
        alt=""
        width={36}
        height={36}
        decoding="async"
        className="size-8 shrink-0 sm:size-9"
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <p className="font-quiz-body text-sm font-bold leading-snug text-foreground sm:text-base">
          Complete all {totalCount} for your chance to win.
        </p>
        <p className="mt-0.5 font-quiz-body text-xs font-normal leading-snug text-foreground sm:text-sm">
          {remaining === 0
            ? "All challenges complete — good luck in the draw!"
            : `${remaining} more to go. You're getting close!`}
        </p>
      </div>
    </section>
  );
}
