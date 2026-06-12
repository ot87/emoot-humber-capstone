import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type QuizTitleBannerVariant = "default" | "result";

const BRUSH_BY_VARIANT = {
  default: {
    src: "/assets/bg-title-brush.png",
    width: 278,
    height: 40,
    shellClass: "min-h-[72px]",
  },
  result: {
    src: "/assets/bg-title-yellow-brush.svg",
    width: 281,
    height: 74,
    shellClass: "min-h-[74px]",
  },
} as const satisfies Record<
  QuizTitleBannerVariant,
  { src: string; width: number; height: number; shellClass: string }
>;

type QuizTitleBannerProps = {
  children: ReactNode;
  className?: string;
  variant?: QuizTitleBannerVariant;
};

export function QuizTitleBanner({
  children,
  className,
  variant = "default",
}: QuizTitleBannerProps) {
  const brush = BRUSH_BY_VARIANT[variant];

  return (
    <div className={cn("relative mx-auto -rotate-1", className)}>
      <div
        className={cn(
          "relative flex w-full min-w-[280px] max-w-[320px] items-center justify-center px-6 py-4",
          brush.shellClass,
        )}
      >
        <img
          src={brush.src}
          alt=""
          aria-hidden="true"
          width={brush.width}
          height={brush.height}
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-fill select-none"
        />
        <div className="relative z-10 text-center">{children}</div>
      </div>
    </div>
  );
}
