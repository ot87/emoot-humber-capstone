import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BingoScreenContentProps = {
  children: ReactNode;
  variant?: "default" | "board";
};

/** Shared body column for locked entry and unlocked board screens. */
export function BingoScreenContent({ children, variant = "default" }: BingoScreenContentProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col",
        variant === "board"
          ? "shrink-0 gap-3 pb-6 sm:gap-4 sm:pb-8"
          : "max-w-[18rem] gap-4 sm:max-w-xs sm:gap-5",
      )}
    >
      {children}
    </div>
  );
}
