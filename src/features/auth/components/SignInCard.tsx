import { useState } from "react";
import { signInWithGoogle } from "../../../services/auth.service";

export function SignInCard() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
   
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
    <section className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-foreground">
        Welcome to Emoot
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to continue.
      </p>


      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button type="button" onClick={handleSignIn} disabled={isSigningIn} className="mt-6 w-full">
        {isSigningIn ? "Signing in..." : "Sign in with Google"}
      </button>
    </section>
    </main>
  );
}