import { Button } from "@/components/ui/button";
import {
  AUTH_CONTENT_SHELL,
  AUTH_MAIN_MIN_CLASS,
  AUTH_SIGN_IN_CARD_CLASS,
  AUTH_SURFACE_BG,
  AUTH_SURFACE_CLASS,
} from "@/features/auth/auth.layout";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { GoogleIcon } from "@/features/auth/components/GoogleIcon";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

type SignInCardProps = {
  onSuccess: () => void;
};

export function SignInCard({ onSuccess }: SignInCardProps) {
  const { signIn, isSigningIn, error } = useAuth();

  async function handleSignIn() {
    if (await signIn()) {
      onSuccess();
    }
  }

  return (
    <div className={cn("relative min-h-dvh", AUTH_SURFACE_CLASS)}>
      <img
        src={AUTH_SURFACE_BG}
        alt=""
        aria-hidden="true"
        width={580}
        height={870}
        decoding="async"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <AuthHeader />

        <main
          className={cn(
            AUTH_CONTENT_SHELL,
            AUTH_MAIN_MIN_CLASS,
            "flex flex-1 flex-col items-center pb-4 pt-2 sm:pt-3",
          )}
        >
          <section className={AUTH_SIGN_IN_CARD_CLASS}>
            <div>
              <h2 className="font-quiz-body text-2xl font-bold leading-tight text-foreground">
                Hi there!
              </h2>

              <p className="mt-3 font-quiz-body text-base font-normal leading-snug text-foreground">
                Log in or Sign Up with Google.
              </p>

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

              <Button
                type="button"
                variant="outline"
                className="mt-6 h-12 w-full gap-3 rounded-full border border-foreground bg-card px-6 font-quiz-body text-base font-normal text-foreground shadow-none"
                onClick={handleSignIn}
                disabled={isSigningIn}
              >
                <GoogleIcon />
                {isSigningIn ? "Signing in..." : "Continue with Google"}
              </Button>
            </div>

            <div aria-hidden="true" className="min-h-8 flex-1" />

            <hr className="border-0 border-t border-[#E5E5E5]" aria-hidden="true" />
          </section>

          <div aria-hidden="true" className="flex-1" />
        </main>

        <AuthFooter />
      </div>
    </div>
  );
}
