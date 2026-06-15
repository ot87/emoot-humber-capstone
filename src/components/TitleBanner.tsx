import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TitleBannerVariant = "default" | "result" | "auth";

const BRUSH_BY_VARIANT = {
  default: {
    src: "/assets/bg-title-brush.png",
    width: 278,
    height: 40,
    shellClass: "min-h-[72px] min-w-[280px] max-w-[320px]",
    innerClass: "px-6 py-4",
  },
  result: {
    src: "/assets/bg-title-yellow-brush.svg",
    width: 281,
    height: 74,
    shellClass: "min-h-[74px] min-w-[280px] max-w-[320px]",
    innerClass: "px-6 py-4",
  },
  auth: {
    src: "/assets/bg-auth-title-brush.svg",
    width: 281,
    height: 74,
    shellClass: "h-[4.625rem] w-[17.5625rem]",
    innerClass: "py-2.5",
  },
} as const satisfies Record<
  TitleBannerVariant,
  { src: string; width: number; height: number; shellClass: string; innerClass: string }
>;

type TitleBannerProps = {
  children: ReactNode;
  className?: string;
  variant?: TitleBannerVariant;
};

const CONTENT_CLASS_BY_VARIANT = {
  default: "relative z-10 text-center",
  result: "relative z-10 text-center",
  auth: "relative z-10 text-center",
} as const satisfies Record<TitleBannerVariant, string>;

export function TitleBanner({ children, className, variant = "default" }: TitleBannerProps) {
  const brush = BRUSH_BY_VARIANT[variant];

  return (
    <div className={cn("relative mx-auto -rotate-1", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center",
          brush.innerClass,
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
        <div className={CONTENT_CLASS_BY_VARIANT[variant]}>{children}</div>
      </div>
    </div>
  );
}
