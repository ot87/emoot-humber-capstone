import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BingoGridShellProps = {
  children: ReactNode;
  "aria-label": string;
  className?: string;
};

export function BingoGridShell({
  children,
  "aria-label": ariaLabel,
  className,
}: BingoGridShellProps) {
  return (
    <div className={cn("grid w-full grid-cols-3 gap-2 sm:gap-3", className)} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
