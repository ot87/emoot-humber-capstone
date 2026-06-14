import { AUTH_CONTENT_SHELL, AUTH_SURFACE_CLASS } from "@/features/auth/auth.layout";
import { cn } from "@/lib/utils";

type AuthFooterProps = {
  className?: string;
};

export function AuthFooter({ className }: AuthFooterProps) {
  return (
    <footer className={cn("shrink-0 px-4 pb-6 pt-2 sm:pb-8", AUTH_SURFACE_CLASS, className)}>
      <div className={cn(AUTH_CONTENT_SHELL, "flex justify-center")}>
        <img
          src="/assets/logo-interac-etransfer.svg"
          alt="Powered by Interac e-Transfer"
          width={390}
          height={66}
          decoding="async"
          className="h-auto w-full max-w-[16rem] sm:max-w-xs"
        />
      </div>
    </footer>
  );
}
