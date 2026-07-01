import { Button } from "@/components/ui/button";
import { BINGO_COMPLETE_COPY } from "@/features/bingo/bingo.complete-copy";
import { cn } from "@/lib/utils";
import type { PersonalityType } from "@/types/quiz";

type BingoBoardCompleteCardProps = {
  personalityType: PersonalityType;
  onViewAchievement: () => void;
  className?: string;
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

export function BingoBoardCompleteCard({
  onViewAchievement,
  className,
}: BingoBoardCompleteCardProps) {
  return (
    <section
      aria-label="Bingo board complete"
      className={cn("flex shrink-0 flex-col items-center gap-4 text-center sm:gap-5", className)}
    >
      <p className="font-quiz-body text-sm font-normal leading-snug text-foreground sm:text-base">
        {BINGO_COMPLETE_COPY.message}
      </p>
      <Button
        type="button"
        variant="brand"
        size="cta"
        className="w-full text-lg"
        aria-label={BINGO_COMPLETE_COPY.viewAchievementLabel}
        onClick={onViewAchievement}
      >
        {renderCapsCtaLabel(BINGO_COMPLETE_COPY.viewAchievementLabel)}
      </Button>
    </section>
  );
}
