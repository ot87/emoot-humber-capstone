import { AppContentShell } from "@/components/layout/AppContentShell";
import { Button } from "@/components/ui/button";
import {
  BINGO_DETAIL_ICON,
  getBingoTaskCompletedIcon,
  getBingoTaskPendingIconForChallenge,
} from "@/features/bingo/bingo.icons";
import { getPersonalityDisplayName } from "@/features/bingo/bingo.logic";
import { getPersonalityResultTheme } from "@/features/quiz/quiz.result";
import { cn } from "@/lib/utils";
import type { BingoChallenge } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

export type BingoChallengeDetailProps = {
  challenge: BingoChallenge;
  personalityType: PersonalityType;
  isCompleted: boolean;
  onToggleComplete: () => void | Promise<void>;
  onClose: () => void;
};

function renderCapsCtaLabel(text: string) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`}>
      {index > 0 ? " " : null}
      <span className="text-[1.15em]">{word.charAt(0)}</span>
      {word.slice(1)}
    </span>
  ));
}

export function BingoChallengeDetail({
  challenge,
  personalityType,
  isCompleted,
  onToggleComplete,
  onClose,
}: BingoChallengeDetailProps) {
  const theme = getPersonalityResultTheme(personalityType);
  const taskIcon = isCompleted
    ? getBingoTaskCompletedIcon()
    : getBingoTaskPendingIconForChallenge(challenge);
  const challengeNumber = challenge.position + 1;

  return (
    <section
      aria-label="Challenge detail"
      className="flex min-h-0 flex-1 flex-col bg-background"
    >
      <AppContentShell className="relative flex flex-1 flex-col gap-5 pb-6 pt-1 sm:gap-6 sm:pb-8">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close challenge detail"
            onClick={onClose}
          >
            <img
              src={BINGO_DETAIL_ICON.close}
              alt=""
              width={30}
              height={30}
              decoding="async"
              className="size-4"
              aria-hidden="true"
            />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-bingo-tile-completed">
            <img
              src={taskIcon}
              alt=""
              width={48}
              height={48}
              decoding="async"
              className="size-12"
              aria-hidden="true"
            />
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <h2 className="font-quiz-body text-lg font-bold leading-snug text-foreground sm:text-xl">
              {challenge.title}
            </h2>
            <p
              className={cn(
                "flex h-[39px] min-h-[39px] w-full max-w-[321px] items-center justify-center rounded-[13px] border-2 border-quiz-brand font-quiz-body text-xs font-medium text-foreground",
                theme.surfaceClass,
              )}
            >
              {getPersonalityDisplayName(personalityType)} · Challenge #{challengeNumber}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <div className="w-full rounded-2xl bg-surface px-4 py-4 sm:px-5">
            <h3 className="font-quiz-body text-sm font-bold text-foreground">What to do?</h3>
            <p className="mt-2 font-quiz-body text-sm font-normal leading-snug text-foreground">
              {challenge.whatToDo}
            </p>
          </div>

          <div className={cn("w-full rounded-2xl px-4 py-4 sm:px-5", theme.surfaceClass)}>
            <h3 className="flex items-center gap-1.5 font-quiz-body text-sm font-bold text-foreground">
              <img
                src={BINGO_DETAIL_ICON.brain}
                alt=""
                width={21}
                height={21}
                decoding="async"
                className="size-4 shrink-0"
                aria-hidden="true"
              />
              Why it matters?
            </h3>
            <p className="mt-2 font-quiz-body text-sm font-normal leading-snug text-foreground">
              {challenge.whyItMatters}
            </p>
          </div>
        </div>

        <div className="mt-auto flex w-full gap-2 pt-2">
          <Button
            type="button"
            variant="brand"
            size="cta"
            className="min-w-0 flex-1 text-base sm:text-lg"
            aria-label={isCompleted ? "Challenge completed" : "Mark challenge as complete"}
            disabled={isCompleted}
            onClick={onToggleComplete}
          >
            {isCompleted ? "COMPLETED" : renderCapsCtaLabel("MARK AS COMPLETE")}
          </Button>
          {isCompleted ? (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className={cn("size-14 shrink-0 border-quiz-brand sm:size-16", theme.surfaceClass)}
              aria-label="Mark challenge as not started"
              onClick={onToggleComplete}
            >
              <img
                src={BINGO_DETAIL_ICON.reset}
                alt=""
                width={62}
                height={62}
                decoding="async"
                className="size-8 sm:size-9"
                aria-hidden="true"
              />
            </Button>
          ) : null}
        </div>
      </AppContentShell>
    </section>
  );
}
