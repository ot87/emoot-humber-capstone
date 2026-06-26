import emootLogo from "@/assets/logo-emoot.svg";
import { cn } from "@/lib/utils";

export type AppHeaderProps = {
  homeHref: string;
  className?: string;
};

export function AppHeader({ homeHref, className }: AppHeaderProps) {
  return (
    <header className={cn("shrink-0 border-b border-border/60 bg-background", className)}>
      <div className="mx-auto flex h-15 w-full max-w-[402px] items-center justify-center">
        <a href={homeHref} aria-label="EMOOT home" className="leading-none">
          <img
            src={emootLogo}
            alt="EMOOT"
            width={78.36}
            height={38}
            decoding="async"
            className="h-[38px] w-[78.36px]"
          />
        </a>
      </div>
    </header>
  );
}
