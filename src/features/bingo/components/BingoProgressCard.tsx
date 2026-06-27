import { BINGO_TASK_ICON, getRemainingChallengeCount } from "@/features/bingo/bingo.logic";
import { cn } from "@/lib/utils";

type BingoProgressCardProps = {
  completedCount: number;
  totalCount: number;
  className?: string;
};

export function BingoProgressCard({
  completedCount,
  totalCount,
  className,
}: BingoProgressCardProps) {
  const remaining = getRemainingChallengeCount(completedCount, totalCount);

  return (
    <section
      aria-label="Bingo progress"
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-2xl bg-bingo-progress px-4 py-3 sm:gap-4 sm:px-5 sm:py-4",
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
      <div className="min-w-0 text-left">
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
