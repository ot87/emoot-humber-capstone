import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BingoEntryLayout } from "@/features/bingo/components/BingoEntryLayout";
import { getPersonalityResultContent } from "@/features/quiz/quiz.result";
import type { PersonalityType } from "@/types/quiz";

type BingoUnlockedEntryScreenProps = {
  personalityType: PersonalityType;
};

export function BingoUnlockedEntryScreen({ personalityType }: BingoUnlockedEntryScreenProps) {
  const content = getPersonalityResultContent(personalityType);

  return (
    <BingoEntryLayout>
      <div className="flex flex-col items-center gap-6 text-center">
        <img
          src={content.iconSrc}
          alt=""
          width={120}
          height={120}
          decoding="async"
          className="size-24 sm:size-28"
        />

        <div className="w-full rounded-xl bg-surface px-5 py-6 sm:px-6">
          <h2 className="font-quiz-body text-xl font-bold tracking-[-0.3px] text-foreground">
            Your bingo board is ready
          </h2>
          <p className="mt-3 font-quiz-body text-base font-normal leading-snug tracking-[-0.3px] text-foreground">
            {content.description}
          </p>
        </div>

        <Button
          asChild
          type="button"
          variant="brand"
          size="cta"
          className="w-full uppercase"
        >
          <Link to="/bingo/board">Play Emoot Bingo</Link>
        </Button>
      </div>
    </BingoEntryLayout>
  );
}
