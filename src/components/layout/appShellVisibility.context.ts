import { createContext } from "react";

export type AppShellVisibilityContextValue = {
  setHeaderVisible: (visible: boolean) => void;
};

export const AppShellVisibilityContext = createContext<AppShellVisibilityContextValue | null>(null);
