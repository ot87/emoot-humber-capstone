// Toggle this to simulate a signed-in user while developing the bingo flow.
// Flip to `true` to bypass the auth guard without going through the auth page.
const SIMULATE_SIGNED_IN = false;

export interface AuthState {
  user: { uid: string } | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  return SIMULATE_SIGNED_IN
    ? { user: { uid: "dev-user" }, loading: false }
    : { user: null, loading: false };
}
