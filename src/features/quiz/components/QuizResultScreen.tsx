import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuizTitleBanner } from "@/features/quiz/components/QuizTitleBanner";
import { QUIZ_CONTENT_SHELL, QUIZ_DISPLAY_TITLE_CLASS } from "@/features/quiz/quiz.layout";
import { getPersonalityResultContent } from "@/features/quiz/quiz.result";
import { cn } from "@/lib/utils";
import type { PersonalityType } from "@/types/quiz";

type QuizResultScreenProps = {
  personalityType: PersonalityType;
};

export function QuizResultScreen({ personalityType }: QuizResultScreenProps) {
  const content = getPersonalityResultContent(personalityType);

  return (
    <div className={cn("flex min-h-dvh flex-col", content.surfaceClass)}>
      <div
        className={cn(
          QUIZ_CONTENT_SHELL,
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
            <h1 className={cn(QUIZ_DISPLAY_TITLE_CLASS, "whitespace-pre-line")}>
              {content.title}
            </h1>
          </QuizTitleBanner>

          <p className="max-w-[20rem] text-center font-quiz-body text-xl font-normal leading-snug text-quiz-copy sm:max-w-sm">
            {content.description}
          </p>
        </div>

        <Button
          asChild
          variant="brand"
          size="cta"
          className="w-full max-w-[18rem] uppercase sm:max-w-xs md:max-w-sm"
        >
          <Link to="/auth" state={{ from: "/bingo" }}>
            Sign up to play Emoot Bingo
          </Link>
        </Button>
      </div>

      <footer className="shrink-0 bg-quiz-result-footer px-4 py-3 text-center">
        <p className="font-quiz-body text-xs text-quiz-result-footer-foreground">
          © Emoot | Happy Path Ventures Incorporated {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
