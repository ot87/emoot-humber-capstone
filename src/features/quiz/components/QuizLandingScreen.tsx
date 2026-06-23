import quizStarIcon from "@/assets/icon-star.svg";
import { TornHeroHeader } from "@/components/layout/TornHeroHeader";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type QuizLandingScreenProps = {
  loading?: boolean;
  itemCount: number;
  onStart: () => void;
};

export function QuizLandingScreen({ loading = false, itemCount, onStart }: QuizLandingScreenProps) {
  const hasQuestions = itemCount > 0;
  return (
    <TornHeroHeader
      title={
        <h1
          aria-label="Find Your Money Personality"
          className="font-quiz-display text-[1.375rem] leading-[1.15] text-foreground"
        >
          <span className="block whitespace-nowrap">Find Your Money</span>
          <span className="block whitespace-nowrap">Personality</span>
        </h1>
      }
      badge={
        <img
          src={quizStarIcon}
          alt=""
          width={75}
          height={75}
          decoding="async"
          className="size-[65px]"
        />
      }
      badgeMarginClassName="mb-[clamp(1rem,2.5vw+0.75rem,3.5rem)]"
      contentShellClassName="min-h-0 flex-1 flex-col"
    >
      {loading ? (
        <>
          <LoadingSpinner className="min-h-0 flex-1 py-8" />

          <div className="flex w-full flex-col items-center pb-3 sm:pb-4" />
        </>
      ) : (
        <>
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
            {hasQuestions ? (
              <>
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
              </>
            ) : (
              <p
                role="status"
                className="max-w-[20rem] font-quiz-body text-xl font-normal leading-[22px] tracking-[-0.3px] text-quiz-copy sm:max-w-sm md:max-w-md lg:max-w-lg"
              >
                No quiz questions are available right now. Please check back later.
              </p>
            )}
          </div>
        </>
      )}
    </TornHeroHeader>
  );
}
