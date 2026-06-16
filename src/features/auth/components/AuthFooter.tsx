import interacLogo from "@/assets/logo-interac.png";
import { AUTH_INTERAC_ATTRIBUTION } from "@/features/auth/auth.logic";
import { AppContentShell } from "@/components/layout/AppContentShell";
import { cn } from "@/lib/utils";

type AuthFooterProps = {
  className?: string;
};

export function AuthFooter({ className }: AuthFooterProps) {
  return (
    <footer className={cn("shrink-0 px-4 pb-6 pt-2 sm:pb-8", className)}>
      <AppContentShell className="flex justify-center">
        <div className="flex max-w-xs flex-col items-center gap-1.5 text-center sm:gap-2">
          <img
            src={interacLogo}
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            decoding="async"
            className="size-12 object-contain"
          />
          <p className="auth-interac-attribution">{AUTH_INTERAC_ATTRIBUTION}</p>
        </div>
      </AppContentShell>
    </footer>
  );
}
