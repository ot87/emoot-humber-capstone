import type { ReactNode } from "react";
import quizLandingBg from "@/assets/bg-quiz-landing.svg";
import { cn } from "@/lib/utils";

type QuizLandingBackgroundProps = {
  children: ReactNode;
  /** `full` shows decorative smiley art; `plain` is a clean white body (bingo board). */
  variant?: "full" | "plain";
};

/** Yellow full-page background used on the quiz landing hero — reused on bingo screens. */
export function QuizLandingBackground({ children, variant = "full" }: QuizLandingBackgroundProps) {
  return (
    <div className={cn("relative flex flex-1 flex-col bg-background", "min-h-full")}>
      {variant === "full" ? (
        <img
          src={quizLandingBg}
          alt=""
          aria-hidden="true"
          width={402}
          height={873}
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top select-none"
        />
      ) : null}
      {children}
    </div>
  );
}
