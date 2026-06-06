import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuizLandingScreenProps = {
  onStart: () => void;
};

export function QuizLandingScreen({ onStart }: QuizLandingScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="relative w-full bg-quiz-header">
        <div className="mx-auto flex min-h-[32svh] w-full max-w-[430px] flex-col justify-center px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 md:min-h-[34svh] md:pb-20 md:pt-14 lg:min-h-[16rem] lg:max-w-none lg:pb-24 lg:pt-16 xl:min-h-[18rem]">
          <div className="mx-auto w-full max-w-[18rem] rounded-sm bg-background px-3 py-2.5 shadow-sm sm:max-w-xs sm:px-4 sm:py-3 md:max-w-sm lg:max-w-md">
            <h1 className="font-quiz-display text-center text-[1.375rem] leading-none text-foreground">
              <span className="block">FIND YOUR</span>{" "}
              <span className="block">MONEY PERSONALITY</span>
            </h1>
          </div>
        </div>

        <svg
          className="absolute -bottom-px left-0 h-6 w-full text-background sm:h-8 md:h-10 lg:h-12"
          viewBox="0 0 400 32"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,16 C50,32 100,0 150,18 C200,36 250,4 300,20 C350,36 380,12 400,24 L400,32 L0,32 Z"
          />
        </svg>
      </header>

      <div className="mx-auto w-full max-w-[430px] px-4 sm:px-6 lg:max-w-lg lg:px-8 xl:max-w-xl">
        <div className="relative z-10 -mt-10 flex justify-center sm:-mt-11 md:-mt-12 lg:-mt-14">
          <div
            className="flex size-[4.5rem] items-center justify-center rounded-full border-2 border-foreground bg-quiz-brand sm:size-20 md:size-24 lg:size-28"
            aria-hidden="true"
          >
            <Star className="size-9 fill-quiz-brand stroke-foreground stroke-[2.5] sm:size-10 md:size-12 lg:size-14" />
          </div>
        </div>

        <main className="relative flex flex-col items-center pb-8 pt-4 text-center sm:pb-10 sm:pt-6 md:pb-12 lg:pb-14 lg:pt-6">
          <p className="max-w-[18rem] font-quiz-body text-xl font-normal leading-snug text-quiz-copy sm:max-w-xs md:max-w-sm lg:max-w-md">
            How do you really feel about money?
            <br />
            Let&apos;s find out!
          </p>

          <p className="mt-3 max-w-[20rem] font-quiz-body text-xl font-normal leading-relaxed text-quiz-copy sm:mt-4 sm:max-w-sm md:max-w-md lg:mt-5 lg:max-w-lg">
            Take this quick 5-question quiz to uncover your unique money personality — and get
            personalized tips to help you save smarter, stay motivated, and reach your financial
            goals.
          </p>

          <Button
            type="button"
            variant="quiz"
            size="cta"
            className="mt-8 w-full max-w-[18rem] sm:mt-10 sm:max-w-xs md:mt-12 md:max-w-sm lg:mt-14 lg:max-w-md"
            onClick={onStart}
          >
            START QUIZ
          </Button>

          <p className="mt-3 font-quiz-body text-sm font-normal leading-[22px] tracking-[-0.3px] text-quiz-footer sm:mt-4">
            No login required
          </p>
        </main>
      </div>
    </div>
  );
}
