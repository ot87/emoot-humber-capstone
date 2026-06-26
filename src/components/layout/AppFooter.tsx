import { getAppCopyrightText } from "@/lib/appCopyright";
import { cn } from "@/lib/utils";
import type { AppNavLinkComponent, AppNavLinkProps } from "@/components/layout/appNavLink";

export type AppFooterNavItem = {
  to: string;
  label: string;
  iconSrc: string;
  isActive: boolean;
};

export type AppFooterProps = {
  navLink: AppNavLinkComponent;
  quizNav: AppFooterNavItem;
  bingoNav: AppFooterNavItem;
  className?: string;
};

type AppFooterNavLinkProps = {
  navLink: AppNavLinkComponent;
  item: AppFooterNavItem;
};

function AppFooterNavLink({ navLink: NavLink, item }: AppFooterNavLinkProps) {
  const linkProps: AppNavLinkProps = {
    to: item.to,
    "aria-label": item.label,
    "aria-current": item.isActive ? "page" : undefined,
    className: cn(
      "flex h-[63px] w-[65px] flex-col items-center justify-center gap-1 rounded-xl transition-colors",
      item.isActive ? "bg-app-footer-nav-selected" : "hover:bg-app-footer-nav-selected/70",
    ),
    children: (
      <>
        <img
          src={item.iconSrc}
          alt=""
          width={30}
          height={30}
          decoding="async"
          aria-hidden="true"
          className="size-[30px] object-contain"
        />
        <span className="font-app-footer text-xs font-normal leading-none text-foreground">
          {item.label}
        </span>
      </>
    ),
  };

  return <NavLink {...linkProps} />;
}

export function AppFooter({ navLink, quizNav, bingoNav, className }: AppFooterProps) {
  return (
    <footer className={cn("w-full shrink-0", className)}>
      <nav aria-label="App navigation" className="w-full bg-app-footer-nav-bg">
        <div className="flex h-[70px] w-full items-center justify-center gap-8">
          <AppFooterNavLink navLink={navLink} item={quizNav} />
          <AppFooterNavLink navLink={navLink} item={bingoNav} />
        </div>
      </nav>

      <div className="w-full bg-app-footer-copyright px-4 py-3 text-center">
        <p className="font-app-footer text-xs font-normal text-app-footer-copyright-foreground">
          {getAppCopyrightText()}
        </p>
      </div>
    </footer>
  );
}
