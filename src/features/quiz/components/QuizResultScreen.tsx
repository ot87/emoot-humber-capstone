import { Button } from "@/components/ui/button";
import { QuizTitleBanner } from "@/features/quiz/components/QuizTitleBanner";
import { getPersonalityResultContent } from "@/features/quiz/quiz.result";
import { cn } from "@/lib/utils";
import type { PersonalityType } from "@/types/quiz";

const CONTENT_SHELL = "mx-auto w-full max-w-[430px] px-4 sm:px-6 lg:max-w-lg lg:px-8 xl:max-w-xl";

type QuizResultScreenProps = {
  personalityType: PersonalityType;
  onSignUp: () => void;
};

export function QuizResultScreen({ personalityType, onSignUp }: QuizResultScreenProps) {
  const content = getPersonalityResultContent(personalityType);

  return (
    <div className={cn("flex min-h-dvh flex-col", content.surfaceClass)}>
      <div
        className={cn(
          CONTENT_SHELL,
          "flex min-h-0 flex-1 flex-col items-center justify-evenly py-8 sm:py-10 lg:py-12",
        )}
      >
        <div className="flex w-full flex-col items-center gap-6">
          <img
            src={content.iconSrc}
            alt=""
            width={120}
            height={120}
            decoding="async"
            className="size-[7.5rem] sm:size-[8.5rem]"
          />

          <QuizTitleBanner variant="result" className="max-w-[min(100%,22rem)]">
            <p className="font-quiz-display text-lg leading-tight whitespace-pre-line text-foreground sm:text-xl">
              {content.title}
            </p>
          </QuizTitleBanner>

          <p className="max-w-[20rem] text-center font-quiz-body text-xl font-normal leading-snug text-quiz-copy sm:max-w-sm">
            {content.description}
          </p>
        </div>

        <Button
          type="button"
          variant="brand"
          size="cta"
          className="w-full max-w-[18rem] sm:max-w-xs md:max-w-sm"
          onClick={onSignUp}
        >
          Sign up to play Emoot Bingo
        </Button>
      </div>

      <footer className="shrink-0 bg-quiz-result-footer px-4 py-3 text-center">
        <p className="font-quiz-body text-xs text-quiz-result-footer-foreground">
          © Emoot | Happy Path Ventures Incorporated 2026
        </p>
      </footer>
    </div>
  );
}
