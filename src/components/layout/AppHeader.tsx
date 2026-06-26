import emootLogo from "@/assets/logo-emoot.svg";
import { AppHeaderMenu } from "@/components/layout/AppHeaderMenu";
import { cn } from "@/lib/utils";
import type { AppNavLinkComponent } from "@/components/layout/appNavLink";

export type AppHeaderProps = {
  navLink: AppNavLinkComponent;
  homeTo: string;
  className?: string;
};

export function AppHeader({ navLink: NavLink, homeTo, className }: AppHeaderProps) {
  return (
    <header
      className={cn("shrink-0 border-b border-border bg-background shadow-app-header", className)}
    >
      <div className="relative flex h-15 w-full items-center px-4">
        <div className="relative z-10 shrink-0">
          <AppHeaderMenu />
        </div>

        <NavLink
          to={homeTo}
          aria-label="EMOOT home"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none"
        >
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
