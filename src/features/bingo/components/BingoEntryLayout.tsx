import type { ReactNode } from "react";
import { BingoShellLayout } from "@/features/bingo/components/BingoShellLayout";

type BingoEntryLayoutProps = {
  children: ReactNode;
};

/** Locked bingo entry — torn hero before the quiz is taken. */
export function BingoEntryLayout({ children }: BingoEntryLayoutProps) {
  return <BingoShellLayout variant="locked">{children}</BingoShellLayout>;
}
