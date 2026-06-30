import { useEffect } from "react";
import authSurfaceBg from "@/assets/bg-auth-surface.svg";
import { AppContentShell } from "@/components/layout/AppContentShell";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { GoogleIcon } from "@/features/auth/components/GoogleIcon";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

export function SignInCard() {
  const { signIn, authAction, error, clearError } = useAuth();
  const isSigningIn = authAction === "signing-in";

  // Shared auth error now lives in the provider, so a stale message from an
  // earlier failed attempt could outlive this card. Reset it on a fresh visit
  // (signIn() also clears it at the start of each retry-in-place).
  useEffect(() => {
    clearError();
  }, [clearError]);

  async function handleSignIn() {
    await signIn();
  }

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col bg-surface")}>
      <img
        src={authSurfaceBg}
        alt=""
        aria-hidden="true"
        width={580}
        height={870}
        decoding="async"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <AuthHeader />

        <AppContentShell as="main" className="flex flex-1 flex-col items-center pb-4">
          <section className="mt-12 flex h-72 w-full max-w-85.5 flex-col items-center bg-white px-6 pb-8 pt-14 text-center shadow-sm sm:mt-14 sm:pt-16">
            <h2 className="font-quiz-body text-2xl font-bold leading-tight tracking-[-0.3px] text-foreground">
              Hi there!
            </h2>

            <p className="mt-2 font-quiz-body text-base font-normal leading-[22px] tracking-[-0.3px] text-foreground">
              Log in or Sign Up with Google.
            </p>

            {error && (
              <p className="mt-3 font-quiz-body text-sm tracking-[-0.3px] text-destructive">
                {error}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              className="mt-6 h-12 w-56 gap-3 rounded-full border border-foreground bg-card px-6 font-quiz-body text-base font-normal tracking-[-0.3px] text-foreground shadow-none"
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              <GoogleIcon />
              {isSigningIn ? "Signing in..." : "Continue with Google"}
            </Button>

            <hr className="mt-8 w-full border-0 border-t border-surface" aria-hidden="true" />
          </section>
        </AppContentShell>
      </div>
    </div>
  );
}
