import type { ReactNode } from "react";
import bingoHeaderTornBg from "@/assets/bg-header-torn.svg";
import questionIcon from "@/assets/icon-question.svg";
import { AppContentShell } from "@/components/layout/AppContentShell";
import { TitleBanner } from "@/components/layout/TitleBanner";

type BingoEntryLayoutProps = {
  children: ReactNode;
};

export function BingoEntryLayout({ children }: BingoEntryLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="relative w-full min-h-[32svh] sm:min-h-[34svh] lg:min-h-[16rem] xl:min-h-[18rem]">
        <img
          src={bingoHeaderTornBg}
          alt=""
          aria-hidden="true"
          width={402}
          height={150}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom select-none"
        />

        <AppContentShell className="relative flex h-full min-h-[inherit] flex-col items-center justify-center pb-14 pt-8 text-center sm:pb-16 sm:pt-10 md:pb-20 md:pt-14 lg:max-w-none lg:pb-24 lg:pt-16">
          <TitleBanner>
            <h1 className="font-quiz-display text-[1.375rem] leading-[1.15] text-foreground uppercase whitespace-nowrap">
              What Type Are You?
            </h1>
          </TitleBanner>

          <p className="mt-3 font-quiz-body text-base font-normal leading-snug tracking-[-0.3px] text-foreground">
            Your money saving personality
          </p>
        </AppContentShell>
      </header>

      <AppContentShell className="relative flex flex-col pb-3 sm:pb-4">
        <div
          className="relative z-10 -mt-14 mb-4 flex justify-center"
          aria-hidden="true"
        >
          <div className="flex h-[111.71px] w-[108.38px] items-center justify-center rounded-full border-[5px] border-quiz-badge-ring bg-quiz-header">
            <img
              src={questionIcon}
              alt=""
              width={75}
              height={75}
              decoding="async"
              className="size-[65px]"
            />
          </div>
        </div>

        {children}
      </AppContentShell>
    </div>
  );
}
