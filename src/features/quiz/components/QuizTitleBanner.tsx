import type { ReactNode } from "react";

type QuizTitleBannerProps = {
  children: ReactNode;
};

export function QuizTitleBanner({ children }: QuizTitleBannerProps) {
  return (
    <div className="relative mx-auto -rotate-1">
      <div className="relative flex min-h-[72px] w-[320px] items-center justify-center px-6 py-4">
        <img
          src="/assets/bg-title-brush.png"
          alt=""
          aria-hidden="true"
          width={278}
          height={40}
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-fill select-none"
        />
        <div className="relative z-10 text-center">{children}</div>
      </div>
    </div>
  );
}
