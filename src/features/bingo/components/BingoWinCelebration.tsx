import { BINGO_TASK_ICON } from "@/features/bingo/bingo.icons";
import { BINGO_WIN_COPY, getWinLineHeadline } from "@/features/bingo/bingo.win-copy";
import { getPersonalityResultTheme } from "@/features/quiz/quiz.result";
import { cn } from "@/lib/utils";
import type { BingoLine } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

type BingoWinCelebrationProps = {
  personalityType: PersonalityType;
  className?: string;
};

type BingoWinCelebrationTopProps = BingoWinCelebrationProps & {
  line: BingoLine;
};

/** Congratulations banner shown above the grid when a line is newly completed. */
export function BingoWinCelebrationTop({
  personalityType,
  line,
  className,
}: BingoWinCelebrationTopProps) {
  const theme = getPersonalityResultTheme(personalityType);

  return (
    <section
      aria-label="Bingo win congratulations"
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 sm:gap-4 sm:px-5 sm:py-4",
        theme.surfaceClass,
        className,
      )}
    >
      <img
        src={BINGO_TASK_ICON.speechBubble}
        alt=""
        width={36}
        height={36}
        decoding="async"
        className="size-8 shrink-0 sm:size-9"
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-col text-left">
        <p className="font-quiz-body text-sm font-bold leading-snug text-foreground sm:text-base">
          {getWinLineHeadline(line)}
        </p>
        <p className="mt-0.5 font-quiz-body text-xs font-normal leading-snug text-foreground sm:text-sm">
          {BINGO_WIN_COPY.congratulationsSubtitle}
        </p>
      </div>
    </section>
  );
}

/** Motivational prompt shown below the grid during a win celebration. */
export function BingoWinCelebrationBottom({
  personalityType,
  className,
}: BingoWinCelebrationProps) {
  const theme = getPersonalityResultTheme(personalityType);

  return (
    <section
      aria-label="Bingo win motivation"
      className={cn(
        "flex shrink-0 flex-col items-center gap-3 rounded-2xl px-4 py-3 text-center sm:gap-4 sm:px-5 sm:py-4",
        theme.surfaceClass,
        className,
      )}
    >
      <img
        src={BINGO_TASK_ICON.lightbulb}
        alt=""
        width={36}
        height={36}
        decoding="async"
        className="size-8 shrink-0 sm:size-9"
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <p className="font-quiz-body text-sm font-bold leading-snug text-foreground sm:text-base">
          {BINGO_WIN_COPY.streakTitle}
        </p>
        <p className="mt-0.5 font-quiz-body text-xs font-normal leading-snug text-foreground sm:text-sm">
          {BINGO_WIN_COPY.streakSubtitle}
        </p>
      </div>
    </section>
  );
}
