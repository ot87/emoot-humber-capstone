import { useContext } from "react";
import { AppShellVisibilityContext } from "@/components/layout/appShellVisibility.context";

export function useAppShellFooterNavVisibility(): {
  setFooterNavVisible: (visible: boolean) => void;
} {
  const context = useContext(AppShellVisibilityContext);

  if (!context) {
    return { setFooterNavVisible: () => {} };
  }

  return { setFooterNavVisible: context.setFooterNavVisible };
}
