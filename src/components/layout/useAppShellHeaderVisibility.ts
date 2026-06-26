import { useContext } from "react";
import {
  AppShellVisibilityContext,
  type AppShellVisibilityContextValue,
} from "@/components/layout/appShellVisibility.context";

export function useAppShellHeaderVisibility(): AppShellVisibilityContextValue {
  const context = useContext(AppShellVisibilityContext);

  if (!context) {
    return { setHeaderVisible: () => {} };
  }

  return context;
}
