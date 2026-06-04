// Toggle this to simulate a signed-in user while developing the bingo flow.
// Flip to `true` to bypass the auth guard without going through the auth page.
import { useEffect, useState } from "react";
import { listenToAuthChanges } from "@/services/auth.service";
import type { AuthUser } from "@/types/user";
const SIMULATE_SIGNED_IN = false;

export interface AuthState {
  user: { uid: string } | null;
  loading: boolean;
}

// export function useAuth(): AuthState {
//   return SIMULATE_SIGNED_IN
//     ? { user: { uid: "dev-user" }, loading: false }
//     : { user: null, loading: false };
// }






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
