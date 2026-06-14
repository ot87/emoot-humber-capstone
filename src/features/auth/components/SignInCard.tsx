import { Button } from "@/components/ui/button";
import { AUTH_CONTENT_SHELL, AUTH_SURFACE_CLASS } from "@/features/auth/auth.layout";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { AuthProductIcons } from "@/features/auth/components/AuthProductIcons";
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
    <div className={cn("flex min-h-dvh flex-col", AUTH_SURFACE_CLASS)}>
      <AuthHeader />

      <main
        className={cn(
          AUTH_CONTENT_SHELL,
          "flex flex-1 flex-col items-center px-4 pb-4 pt-4 sm:px-6 sm:pt-5",
        )}
      >
        <AuthProductIcons className="mb-5 sm:mb-6" />

        <section className="w-full max-w-sm bg-white px-6 py-8 text-center shadow-md sm:px-8 sm:py-10">
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
            className="mt-6 h-12 w-full gap-3 rounded-full border border-foreground bg-white px-6 font-quiz-body text-base font-normal text-foreground shadow-none hover:bg-white/90"
            onClick={handleSignIn}
            disabled={isSigningIn}
          >
            <GoogleIcon />
            {isSigningIn ? "Signing in..." : "Continue with Google"}
          </Button>

          <hr className="mt-8 border-0 border-t border-[#E5E5E5]" aria-hidden="true" />
        </section>

        <div aria-hidden="true" className="flex-1" />
      </main>

      <AuthFooter />
    </div>
  );
}
