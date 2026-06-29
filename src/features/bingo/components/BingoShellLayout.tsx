import type { ReactNode } from "react";
import questionIcon from "@/assets/icon-question.svg";
import { QuizLandingBackground } from "@/components/layout/QuizLandingBackground";
import { TornHeroHeader } from "@/components/layout/TornHeroHeader";
import { getPersonalityDisplayName, getPersonalityFaceIcon } from "@/features/bingo/bingo.logic";
import type { PersonalityType } from "@/types/quiz";

const bingoHeroShellProps = {
  className: "relative z-10 min-h-full bg-transparent",
  badgeMarginClassName: "mb-[clamp(1rem,2.5vw+0.75rem,3.5rem)]",
  badgeShellClassName: "size-[97px]",
  contentShellClassName: "min-h-0 flex-1 flex-col",
  titleShellClassName: "items-center text-center",
} as const;

const bingoHeroSubtitle = (
  <p className="mt-2 mb-[35px] text-center font-quiz-body text-xs font-medium leading-snug tracking-[-0.3px] text-foreground">
    Your money saving personality
  </p>
);

type BingoShellLayoutProps = {
  children: ReactNode;
} & ({ variant: "locked" } | { variant: "board"; personalityType: PersonalityType });

/** Shared yellow torn hero for locked entry and unlocked board screens. */
export function BingoShellLayout(props: BingoShellLayoutProps) {
  const { children } = props;

  if (props.variant === "locked") {
    return (
      <QuizLandingBackground variant="full">
        <TornHeroHeader
          {...bingoHeroShellProps}
          title={
            <h1 className="font-quiz-display text-[1.375rem] leading-[1.15] text-foreground">
              What Type Are You?
            </h1>
          }
          subtitle={bingoHeroSubtitle}
          badge={
            <img
              src={questionIcon}
              alt=""
              width={97}
              height={97}
              decoding="async"
              className="size-full object-cover"
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
    <QuizLandingBackground variant="plain">
      <TornHeroHeader
        {...bingoHeroShellProps}
        className="relative z-10 min-h-full bg-background"
        contentShellClassName="relative flex flex-col px-10 sm:px-10"
        title={
          <h1 className="font-quiz-display text-[1.375rem] leading-[1.15] text-foreground uppercase">
            {getPersonalityDisplayName(personalityType)}
          </h1>
        }
        subtitle={bingoHeroSubtitle}
        badge={
          <img
            src={getPersonalityFaceIcon(personalityType)}
            alt=""
            width={97}
            height={97}
            decoding="async"
            className="size-full object-cover"
          />
        }
      >
        {children}
      </TornHeroHeader>
    </QuizLandingBackground>
  );
}
