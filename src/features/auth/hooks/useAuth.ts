import { useEffect, useState } from "react";
import {
  listenToAuthChanges,
  signInWithGoogle,
  signOut as signOutFromService,
} from "@/services/auth.service";
import type { AuthUser } from "@/types/user";

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
  isSigningIn: boolean;
  isSigningOut: boolean;
  error: string;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(): Promise<boolean> {
    setError("");
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
      return true;
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
      return false;
    } finally {
      setIsSigningIn(false);
    }
  }

  async function signOut(): Promise<boolean> {
    setError("");
    setIsSigningOut(true);

    try {
      await signOutFromService();
      return true;
    } catch (err) {
      console.error(err);
      setError("Sign out failed. Please try again.");
      return false;
    } finally {
      setIsSigningOut(false);
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isSigningIn,
    isSigningOut,
    error,
  };
}
