import type { ReactNode } from "react";
import { BingoShellLayout } from "@/features/bingo/components/BingoShellLayout";
import type { PersonalityType } from "@/types/quiz";

type BingoBoardLayoutProps = {
  personalityType: PersonalityType;
  children: ReactNode;
};

/** Unlocked bingo board — personality hero after the quiz is saved. */
export function BingoBoardLayout({ personalityType, children }: BingoBoardLayoutProps) {
  return (
    <BingoShellLayout variant="board" personalityType={personalityType}>
      {children}
    </BingoShellLayout>
  );
}
