import { getAppCopyrightText } from "@/lib/appCopyright";
import { cn } from "@/lib/utils";

export type AppFooterNavItem = {
  href: string;
  label: string;
  iconSrc: string;
  isActive: boolean;
};

export type AppFooterProps = {
  quizNav: AppFooterNavItem;
  bingoNav: AppFooterNavItem;
  className?: string;
};

type AppFooterNavLinkProps = {
  item: AppFooterNavItem;
};

function AppFooterNavLink({ item }: AppFooterNavLinkProps) {
  return (
    <a
      href={item.href}
      aria-label={item.label}
      aria-current={item.isActive ? "page" : undefined}
      className={cn(
        "flex h-[63px] w-[65px] flex-col items-center justify-center gap-1 rounded-xl transition-colors",
        item.isActive ? "bg-app-footer-nav-selected" : "hover:bg-app-footer-nav-selected/70",
      )}
    >
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
    </a>
  );
}

export function AppFooter({ quizNav, bingoNav, className }: AppFooterProps) {
  return (
    <footer className={cn("shrink-0", className)}>
      <nav aria-label="App navigation" className="border-t border-border/40 bg-quiz-header">
        <div className="mx-auto flex h-[70px] w-full max-w-[402px] items-center justify-center gap-8">
          <AppFooterNavLink item={quizNav} />
          <AppFooterNavLink item={bingoNav} />
        </div>
      </nav>

      <div className="bg-quiz-result-footer px-4 py-3 text-center">
        <p className="font-app-footer text-xs font-normal text-quiz-result-footer-foreground">
          {getAppCopyrightText()}
        </p>
      </div>
    </footer>
  );
}
