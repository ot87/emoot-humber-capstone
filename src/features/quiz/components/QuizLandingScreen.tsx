import { Button } from "@/components/ui/button";
import { TitleBanner } from "@/components/TitleBanner";
import { QUIZ_CONTENT_SHELL, QUIZ_DISPLAY_TITLE_CLASS } from "@/features/quiz/quiz.layout";
import { cn } from "@/lib/utils";

type QuizLandingScreenProps = {
  onStart: () => void;
};

export function QuizLandingScreen({ onStart }: QuizLandingScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="relative w-full min-h-[32svh] sm:min-h-[34svh] lg:min-h-[16rem] xl:min-h-[18rem]">
        <img
          src="/assets/bg-header-torn.svg"
          alt=""
          aria-hidden="true"
          width={402}
          height={150}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom select-none"
        />

        <div
          className={cn(
            QUIZ_CONTENT_SHELL,
            "relative flex h-full min-h-[inherit] flex-col justify-center pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-14 lg:max-w-none lg:pb-24 lg:pt-16",
          )}
        >
          <TitleBanner>
            <h1 aria-label="Find Your Money Personality" className={QUIZ_DISPLAY_TITLE_CLASS}>
              <span className="block whitespace-nowrap">Find Your Money</span>
              <span className="block whitespace-nowrap">Personality</span>
            </h1>
          </TitleBanner>
        </div>
      </header>

      <div className={cn(QUIZ_CONTENT_SHELL, "relative flex min-h-0 flex-1 flex-col")}>
        <div
          className="relative z-10 -mt-14 mb-[clamp(1rem,2.5vw+0.75rem,3.5rem)] flex justify-center"
          aria-hidden="true"
        >
          <div className="flex h-[111.71px] w-[108.38px] items-center justify-center rounded-full border-[5px] border-quiz-badge-ring bg-quiz-header">
            <img
              src="/assets/icon-star.svg"
              alt=""
              width={75}
              height={75}
              decoding="async"
              className="size-[65px]"
            />
          </div>
        </div>

        <main className="relative flex flex-col items-center gap-[clamp(1.25rem,2vw+0.75rem,2.5rem)] text-center">
          <p className="max-w-[18rem] font-quiz-body text-xl font-normal leading-[22px] tracking-[-0.3px] text-quiz-copy sm:max-w-xs md:max-w-sm lg:max-w-md">
            How do you really feel about money?
            <br />
            Let&apos;s find out!
          </p>

          <p className="max-w-[20rem] font-quiz-body text-xl font-normal leading-[22px] tracking-[-0.3px] text-quiz-copy sm:max-w-sm md:max-w-md lg:max-w-lg">
            Take this quick 5-question quiz to uncover your unique money personality — and get
            personalized tips to help you save smarter, stay motivated, and reach your financial
            goals.
          </p>
        </main>

        <div aria-hidden="true" className="flex-1" />

        <div className="flex w-full flex-col items-center pb-3 sm:pb-4">
          <Button
            type="button"
            variant="brand"
            size="cta"
            className="w-full max-w-[18rem] sm:max-w-xs md:max-w-sm lg:max-w-md"
            onClick={onStart}
          >
            Start Quiz
          </Button>

          <p className="mt-3 font-quiz-body text-sm font-normal leading-[22px] tracking-[-0.3px] text-quiz-footer sm:mt-4">
            No login required
          </p>
        </div>
      </div>
    </div>
  );
}
