import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TitleBannerVariant = "default" | "result" | "auth";

const BRUSH_BY_VARIANT = {
  default: {
    src: "/assets/bg-title-brush.png",
    width: 278,
    height: 40,
    shellClass: "min-h-[72px] min-w-[280px] max-w-[320px]",
  },
  result: {
    src: "/assets/bg-title-yellow-brush.svg",
    width: 281,
    height: 74,
    shellClass: "min-h-[74px] min-w-[280px] max-w-[320px]",
  },
  auth: {
    src: "/assets/bg-auth-title-brush.svg",
    width: 281,
    height: 74,
    shellClass: "min-h-[4.625rem] min-w-[17.5rem] max-w-[20rem]",
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
      <div
        className={cn(
          "relative flex w-full items-center justify-center px-6 py-4",
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
