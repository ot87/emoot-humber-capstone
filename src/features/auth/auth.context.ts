import { createContext } from "react";
import type { AuthUser } from "@/types/user";

export type AuthAction = "idle" | "signing-in" | "signing-out";

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signIn: () => Promise<AuthUser | null>;
  signOut: () => Promise<boolean>;
  authAction: AuthAction;
  error: string;
  clearError: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);
