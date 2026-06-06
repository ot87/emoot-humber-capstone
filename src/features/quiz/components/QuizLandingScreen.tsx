import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CONTENT_SHELL = "mx-auto w-full max-w-[430px] px-4 sm:px-6 lg:max-w-lg lg:px-8 xl:max-w-xl";

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
          width={1083}
          height={172}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom select-none"
        />

        <div
          className={cn(
            CONTENT_SHELL,
            "relative flex h-full min-h-[inherit] flex-col justify-center pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-14 lg:max-w-none lg:pb-24 lg:pt-16",
          )}
        >
          <div className="relative mx-auto w-[278px] -rotate-1">
            <img
              src="/assets/bg-title-brush.svg"
              alt=""
              aria-hidden="true"
              width={278}
              height={40}
              decoding="async"
              className="pointer-events-none absolute inset-0 size-full object-fill select-none"
            />
            <h1
              aria-label="FIND YOUR MONEY PERSONALITY"
              className="relative z-10 px-3 py-2 text-center font-quiz-display text-[1.375rem] leading-[1.1] text-foreground"
            >
              <span className="block whitespace-nowrap">FIND YOUR MONEY</span>
              <span className="block whitespace-nowrap">PERSONALITY</span>
            </h1>
          </div>
        </div>
      </header>

      <div className={cn(CONTENT_SHELL, "relative flex flex-1 flex-col")}>
        <div className="relative z-10 -mt-14 flex justify-center" aria-hidden="true">
          <div className="flex h-[111.71px] w-[108.38px] items-center justify-center rounded-full border-[5px] border-white bg-quiz-header">
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

        <main className="relative flex flex-1 flex-col items-center pt-2 text-center sm:pt-3 lg:pt-4">
          <p className="max-w-[18rem] font-quiz-body text-xl font-normal leading-[22px] tracking-[-0.3px] text-quiz-copy sm:max-w-xs md:max-w-sm lg:max-w-md">
            How do you really feel about money?
            <br />
            Let&apos;s find out!
          </p>

          <p className="mt-2 max-w-[20rem] font-quiz-body text-xl font-normal leading-[22px] tracking-[-0.3px] text-quiz-copy sm:max-w-sm md:max-w-md lg:max-w-lg">
            Take this quick 5-question quiz to uncover your unique money personality — and get
            personalized tips to help you save smarter, stay motivated, and reach your financial
            goals.
          </p>

          <div className="mt-auto flex w-full flex-col items-center pb-8 pt-8 sm:pb-10 md:pb-12 lg:pb-14">
            <Button
              type="button"
              variant="brand"
              size="cta"
              className="w-full max-w-[18rem] sm:max-w-xs md:max-w-sm lg:max-w-md"
              onClick={onStart}
            >
              START QUIZ
            </Button>

            <p className="mt-3 font-quiz-body text-sm font-normal leading-[22px] tracking-[-0.3px] text-quiz-footer sm:mt-4">
              No login required
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
