import { useCallback, useEffect, useMemo, useState } from "react";
import { type AuthAction, type AuthState } from "@/features/auth/auth.context";
import {
  listenToAuthChanges,
  signInWithGoogle,
  signOut as signOutFromService,
} from "@/services/auth.service";
import type { AuthUser } from "@/types/user";

// Internal; call exactly once, from AuthProvider. A second call would open a
// second onAuthStateChanged subscription. Read auth via useAuth.
export function useProvideAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authAction, setAuthAction] = useState<AuthAction>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (): Promise<AuthUser | null> => {
    setError("");
    setAuthAction("signing-in");

    try {
      return await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
      return null;
    } finally {
      setAuthAction("idle");
    }
  }, []);

  const signOut = useCallback(async (): Promise<boolean> => {
    setError("");
    setAuthAction("signing-out");

    try {
      await signOutFromService();
      return true;
    } catch (err) {
      console.error(err);
      setError("Sign out failed. Please try again.");
      return false;
    } finally {
      setAuthAction("idle");
    }
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return useMemo<AuthState>(
    () => ({
      user,
      loading,
      signIn,
      signOut,
      authAction,
      error,
      clearError,
    }),
    [user, loading, signIn, signOut, authAction, error, clearError],
  );
}
