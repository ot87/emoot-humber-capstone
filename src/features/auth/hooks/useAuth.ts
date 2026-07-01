import { useContext } from "react";
import { AuthContext, type AuthState } from "@/features/auth/auth.context";

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
