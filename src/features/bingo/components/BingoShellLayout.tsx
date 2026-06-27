import type { ReactNode } from "react";
import questionIcon from "@/assets/icon-question.svg";
import { QuizLandingBackground } from "@/components/layout/QuizLandingBackground";
import { TornHeroHeader } from "@/components/layout/TornHeroHeader";
import { getPersonalityDisplayName, getPersonalityFaceIcon } from "@/features/bingo/bingo.logic";
import type { PersonalityType } from "@/types/quiz";

const bingoSubtitle = (
  <p className="mt-2 font-quiz-body text-xs font-medium leading-snug tracking-[-0.3px] text-foreground">
    Your money saving personality
  </p>
);

const heroShellProps = {
  className: "relative z-10 min-h-full bg-transparent",
  badgeMarginClassName: "mb-[clamp(1rem,2.5vw+0.75rem,3.5rem)]",
  contentShellClassName: "min-h-0 flex-1 flex-col",
} as const;

type BingoShellLayoutProps = {
  children: ReactNode;
} & ({ variant: "locked" } | { variant: "board"; personalityType: PersonalityType });

export function BingoShellLayout(props: BingoShellLayoutProps) {
  const { children } = props;

  if (props.variant === "locked") {
    return (
      <QuizLandingBackground>
        <TornHeroHeader
          {...heroShellProps}
          title={
            <h1 className="font-quiz-display text-[1.375rem] leading-[1.15] text-foreground">
              What Type Are You?
            </h1>
          }
          subtitle={bingoSubtitle}
          badge={
            <img
              src={questionIcon}
              alt=""
              width={65}
              height={65}
              decoding="async"
              className="size-[65px]"
            />
          }
        >
          {children}
        </TornHeroHeader>
      </QuizLandingBackground>
    );
  }

  const { personalityType } = props;

  return (
    <QuizLandingBackground>
      <TornHeroHeader
        {...heroShellProps}
        titleBannerVariant="result"
        title={
          <h1 className="font-quiz-display text-[1.375rem] leading-[1.15] text-foreground uppercase">
            {getPersonalityDisplayName(personalityType)}
          </h1>
        }
        subtitle={bingoSubtitle}
        badge={
          <img
            src={getPersonalityFaceIcon(personalityType)}
            alt=""
            width={69}
            height={69}
            decoding="async"
            className="size-14 object-contain sm:size-16"
          />
        }
        badgeShellClassName="size-20 sm:size-24"
      >
        {children}
      </TornHeroHeader>
    </QuizLandingBackground>
  );
}
