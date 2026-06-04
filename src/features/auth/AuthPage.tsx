import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/services/auth.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

 



      const redirectTo =
  (location.state as { from?: string } | null)?.from ?? "/bingo";


  
  async function handleGoogleSignIn() {
    setError("");
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  }

  if (loading) {
    return <p>Checking sign-in status...</p>;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-center">
          Sign in to continue
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Use your Google account to access your Money Bingo progress.
        </p>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-6 w-full"
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? "Signing in..." : "Continue with Google"}
        </Button>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}




