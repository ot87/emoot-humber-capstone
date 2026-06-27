import type { ComponentProps, ReactNode } from "react";
import headerTornBg from "@/assets/bg-header-torn.svg";
import { AppContentShell } from "@/components/layout/AppContentShell";
import { TitleBanner } from "@/components/layout/TitleBanner";
import { cn } from "@/lib/utils";

type TitleBannerVariant = ComponentProps<typeof TitleBanner>["variant"];

type TornHeroHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  badge: ReactNode;
  badgeMarginClassName?: string;
  badgeShellClassName?: string;
  titleBannerVariant?: TitleBannerVariant;
  titleShellClassName?: string;
  headerClassName?: string;
  contentShellClassName?: string;
  className?: string;
  children?: ReactNode;
};

export function TornHeroHeader({
  title,
  subtitle,
  badge,
  badgeMarginClassName = "mb-4",
  badgeShellClassName = "size-28",
  titleBannerVariant,
  titleShellClassName,
  headerClassName,
  contentShellClassName,
  className,
  children,
}: TornHeroHeaderProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col bg-background", className)}>
      <header
        className={cn(
          "relative w-full min-h-3/12 sm:min-h-1/3 lg:min-h-64 xl:min-h-72",
          headerClassName,
        )}
      >
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
          <TitleBanner variant={titleBannerVariant}>{title}</TitleBanner>
          {subtitle}
        </AppContentShell>
      </header>

      <AppContentShell className={cn("relative flex flex-col", contentShellClassName)}>
        <div
          className={cn("relative z-10 -mt-14 flex justify-center", badgeMarginClassName)}
          aria-hidden="true"
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-full border-4 border-quiz-badge-ring bg-quiz-header",
              badgeShellClassName,
            )}
          >
            {badge}
          </div>
        </div>

        {children}
      </AppContentShell>
    </div>
  );
}
