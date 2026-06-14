import { QuizTitleBanner } from "@/features/quiz/components/QuizTitleBanner";
import { QUIZ_DISPLAY_TITLE_CLASS } from "@/features/quiz/quiz.layout";
import { AUTH_CONTENT_SHELL } from "@/features/auth/auth.layout";
import { cn } from "@/lib/utils";

export function AuthHeader() {
  return (
    <header className="relative">
      <img
        src="/assets/decoration-auth-zigzag.svg"
        alt=""
        aria-hidden="true"
        width={68}
        height={45}
        decoding="async"
        className="pointer-events-none absolute right-3 top-3 select-none sm:right-5 sm:top-5"
      />

      <div
        className={cn(
          AUTH_CONTENT_SHELL,
          "flex flex-col items-center pt-8 pb-2 text-center sm:pt-10 sm:pb-3",
        )}
      >
        <h1 className="font-quiz-display text-[2.5rem] leading-none tracking-wide text-foreground sm:text-[2.75rem]">
          EMOOT
        </h1>

        <QuizTitleBanner variant="result" className="mt-4 max-w-[min(100%,20rem)] sm:mt-5">
          <p
            className={cn(
              QUIZ_DISPLAY_TITLE_CLASS,
              "text-[0.65rem] uppercase leading-tight tracking-[0.04em] sm:text-xs",
            )}
          >
            Emotion-First Cash Transfer
          </p>
        </QuizTitleBanner>

        <p className="mt-2 font-quiz-body text-[0.65rem] font-normal leading-snug text-foreground sm:mt-3 sm:text-xs">
          Powered by Interac e-Transfer®
        </p>
      </div>
    </header>
  );
}
