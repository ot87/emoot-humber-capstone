import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Welcome to Emoot</h1>

        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue.</p>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-6 w-full"
          onClick={handleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? "Signing in..." : "Sign in with Google"}
        </Button>
      </section>
    </main>
  );
}
