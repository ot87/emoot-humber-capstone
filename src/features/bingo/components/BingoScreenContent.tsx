import type { ReactNode } from "react";

type BingoScreenContentProps = {
  children: ReactNode;
};

/** Shared scrollable body column for locked entry and unlocked board screens. */
export function BingoScreenContent({ children }: BingoScreenContentProps) {
  return <div className="mx-auto flex w-full max-w-xs flex-col gap-6">{children}</div>;
}
