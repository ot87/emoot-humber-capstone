import { type ReactNode } from "react";
import { AuthContext } from "@/features/auth/auth.context";
import { useProvideAuth } from "@/features/auth/hooks/useProvideAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useProvideAuth();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
