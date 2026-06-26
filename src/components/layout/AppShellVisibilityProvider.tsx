import { useMemo, type ReactNode } from "react";
import { AppShellVisibilityContext } from "@/components/layout/appShellVisibility.context";

type AppShellVisibilityProviderProps = {
  setHeaderVisible: (visible: boolean) => void;
  children: ReactNode;
};

export function AppShellVisibilityProvider({
  setHeaderVisible,
  children,
}: AppShellVisibilityProviderProps) {
  const value = useMemo(() => ({ setHeaderVisible }), [setHeaderVisible]);

  return (
    <AppShellVisibilityContext.Provider value={value}>
      {children}
    </AppShellVisibilityContext.Provider>
  );
}
