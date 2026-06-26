import emootLogo from "@/assets/logo-emoot.svg";
import { cn } from "@/lib/utils";
import type { AppNavLinkComponent } from "@/components/layout/appNavLink";

export type AppHeaderProps = {
  navLink: AppNavLinkComponent;
  homeTo: string;
  className?: string;
};

export function AppHeader({ navLink: NavLink, homeTo, className }: AppHeaderProps) {
  return (
    <header className={cn("shrink-0 border-b border-border bg-background shadow-app-header", className)}>
      <div className="mx-auto flex h-15 w-full max-w-[402px] items-center justify-center">
        <NavLink to={homeTo} aria-label="EMOOT home" className="leading-none">
          <img
            src={emootLogo}
            alt="EMOOT"
            width={78.36}
            height={38}
            decoding="async"
            className="h-[38px] w-[78.36px]"
          />
        </NavLink>
      </div>
    </header>
  );
}
