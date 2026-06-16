import type { ReactNode } from "react";
import bgAuthTitleBrush from "@/assets/bg-auth-title-brush.svg";
import bgTitleBrush from "@/assets/bg-title-brush.png";
import bgTitleYellowBrush from "@/assets/bg-title-yellow-brush.svg";
import { cn } from "@/lib/utils";

type TitleBannerVariant = "default" | "result" | "auth";

const BRUSH_BY_VARIANT = {
  default: {
    src: bgTitleBrush,
    width: 278,
    height: 40,
    shellClass:
      "relative flex min-h-[72px] min-w-[280px] max-w-[320px] items-center justify-center px-6 py-4",
  },
  result: {
    src: bgTitleYellowBrush,
    width: 281,
    height: 74,
    shellClass:
      "relative flex min-h-[74px] min-w-[280px] max-w-[320px] items-center justify-center px-6 py-4",
  },
  auth: {
    src: bgAuthTitleBrush,
    width: 281,
    height: 74,
    shellClass: "relative flex h-[4.625rem] w-[18.4375rem] items-center justify-center py-2.5",
  },
} as const satisfies Record<
  TitleBannerVariant,
  { src: string; width: number; height: number; shellClass: string }
>;

type TitleBannerProps = {
  children: ReactNode;
  className?: string;
  variant?: TitleBannerVariant;
};

export function TitleBanner({ children, className, variant = "default" }: TitleBannerProps) {
  const brush = BRUSH_BY_VARIANT[variant];

  return (
    <div className={cn("relative mx-auto -rotate-1", className)}>
      <div className={brush.shellClass}>
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
