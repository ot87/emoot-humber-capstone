import type { ReactNode } from "react";
import quizLandingBg from "@/assets/bg-quiz-landing.svg";

type QuizLandingBackgroundProps = {
  children: ReactNode;
};

/** Yellow full-page background used on the quiz landing hero — reused on bingo screens. */
export function QuizLandingBackground({ children }: QuizLandingBackgroundProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background">
      <img
        src={quizLandingBg}
        alt=""
        aria-hidden="true"
        width={402}
        height={873}
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top select-none"
      />
      {children}
    </div>
  );
}
