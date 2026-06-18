import type { ReactNode } from "react";
import questionIcon from "@/assets/icon-question.svg";
import { TornHeroHeader } from "@/components/layout/TornHeroHeader";

type BingoEntryLayoutProps = {
  children: ReactNode;
};

export function BingoEntryLayout({ children }: BingoEntryLayoutProps) {
  return (
    <TornHeroHeader
      title={
        <h1 className="font-quiz-display text-[1.375rem] leading-[1.15] text-foreground uppercase whitespace-nowrap">
          What Type Are You?
        </h1>
      }
      subtitle={
        <p className="mt-3 font-quiz-body text-xs font-medium leading-snug tracking-[-0.3px] text-foreground">
          Your money saving personality
        </p>
      }
      titleShellClassName="items-center text-center"
      badge={
        <img
          src={questionIcon}
          alt=""
          width={69}
          height={69}
          decoding="async"
          className="size-[65px] object-contain"
        />
      }
      contentShellClassName="pb-3 sm:pb-4"
    >
      {children}
    </TornHeroHeader>
  );
}
