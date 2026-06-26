import type { ReactNode } from "react";
import headerTornBg from "@/assets/bg-header-torn.svg";
import { AppContentShell } from "@/components/layout/AppContentShell";
import { TitleBanner } from "@/components/layout/TitleBanner";
import { cn } from "@/lib/utils";

type TornHeroHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  badge: ReactNode;
  badgeMarginClassName?: string;
  titleShellClassName?: string;
  contentShellClassName?: string;
  children?: ReactNode;
};

export function TornHeroHeader({
  title,
  subtitle,
  badge,
  badgeMarginClassName = "mb-4",
  titleShellClassName,
  contentShellClassName,
  children,
}: TornHeroHeaderProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="relative w-full min-h-[32svh] sm:min-h-[34svh] lg:min-h-[16rem] xl:min-h-[18rem]">
        <img
          src={headerTornBg}
          alt=""
          aria-hidden="true"
          width={402}
          height={150}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 size-full object-cover object-bottom select-none"
        />

        <AppContentShell
          className={cn(
            "relative flex h-full min-h-[inherit] flex-col justify-center pb-14 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-14 lg:max-w-none lg:pb-24 lg:pt-16",
            titleShellClassName,
          )}
        >
          <TitleBanner>{title}</TitleBanner>
          {subtitle}
        </AppContentShell>
      </header>

      <AppContentShell className={cn("relative flex flex-col", contentShellClassName)}>
        <div
          className={cn("relative z-10 -mt-14 flex justify-center", badgeMarginClassName)}
          aria-hidden="true"
        >
          <div className="flex size-28 items-center justify-center rounded-full border-4 border-quiz-badge-ring bg-quiz-header">
            {badge}
          </div>
        </div>

        {children}
      </AppContentShell>
    </div>
  );
}
