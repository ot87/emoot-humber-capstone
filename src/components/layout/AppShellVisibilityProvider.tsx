import { useMemo, type ReactNode } from "react";
import { AppShellVisibilityContext } from "@/components/layout/appShellVisibility.context";

type AppShellVisibilityProviderProps = {
  setHeaderVisible: (visible: boolean) => void;
  setFooterNavVisible: (visible: boolean) => void;
  children: ReactNode;
};

export function AppShellVisibilityProvider({
  setHeaderVisible,
  setFooterNavVisible,
  children,
}: AppShellVisibilityProviderProps) {
  const value = useMemo(
    () => ({ setHeaderVisible, setFooterNavVisible }),
    [setHeaderVisible, setFooterNavVisible],
  );

  return (
    <AppShellVisibilityContext.Provider value={value}>
      {children}
    </AppShellVisibilityContext.Provider>
  );
}
