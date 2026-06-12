import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { QuizTitleBanner } from "@/features/quiz/components/QuizTitleBanner";
import {
  QUIZ_CONTENT_SHELL,
  QUIZ_DISPLAY_TITLE_CLASS,
  QUIZ_RESULT_CTA_CLASS,
} from "@/features/quiz/quiz.layout";
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

        <div className="flex w-full flex-col items-center">
          <Link
            to="/auth"
            state={{ from: "/bingo" }}
            className={cn(buttonVariants({ variant: "brand" }), QUIZ_RESULT_CTA_CLASS)}
          >
            Sign up to play Emoot Bingo
          </Link>
        </div>
      </div>

      <footer className="shrink-0 bg-quiz-result-footer px-4 py-3 text-center">
        <p className="font-quiz-body text-xs text-quiz-result-footer-foreground">
          © Emoot | Happy Path Ventures Incorporated {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
