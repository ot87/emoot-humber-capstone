import lockIcon from "@/assets/icon-lock-sm.svg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BingoEntryLayout } from "@/features/bingo/components/BingoEntryLayout";
import { BingoLockedGrid } from "@/features/bingo/components/BingoLockedGrid";

function renderCapsCtaLabel(text: string) {
  return text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`}>
      {index > 0 ? " " : null}
      <span className="text-[1.15em]">{word.charAt(0)}</span>
      {word.slice(1)}
    </span>
  ));
}

export function BingoLockedEntryScreen() {
  return (
    <BingoEntryLayout>
      <div className="mx-auto flex w-full max-w-xs flex-col gap-6">
        <section className="flex min-h-36 flex-col justify-center rounded-xl bg-bingo-locked-tile px-4 text-center">
          <img
            src={lockIcon}
            alt=""
            width={17}
            height={17}
            decoding="async"
            className="mx-auto size-4"
            aria-hidden="true"
          />
          <h2 className="mt-2 font-quiz-body text-base font-bold tracking-[-0.3px] text-foreground">
            Emoot Bingo is locked
          </h2>
          <p className="mt-2 font-quiz-body text-base font-normal leading-snug tracking-[-0.3px] text-foreground">
            Take the Money Personality Quiz to unlock your personalized Emoot Bingo, and your chance
            to win $100.
          </p>
        </section>

        <BingoLockedGrid />

        <Button asChild type="button" variant="brand" size="cta" className="w-full text-lg">
          <Link to="/quiz" aria-label="Take the quiz to unlock">
            {renderCapsCtaLabel("TAKE THE QUIZ TO UNLOCK")}
          </Link>
        </Button>
      </div>
    </BingoEntryLayout>
  );
}
