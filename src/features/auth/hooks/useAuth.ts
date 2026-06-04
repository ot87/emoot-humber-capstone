import { useEffect, useState } from "react";
import { listenToAuthChanges } from "@/services/auth.service";
import type { AuthUser } from "@/types/user";

export interface AuthState {
  user: { uid: string } | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
