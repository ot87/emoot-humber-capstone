import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppShellFooterNavVisibility } from "@/components/layout/useAppShellFooterNavVisibility";

export function useAnonymousQuizVisitorFooterNav(): void {
  const { user, loading } = useAuth();
  const { setFooterNavVisible } = useAppShellFooterNavVisibility();

  useEffect(() => {
    const hideFooterNav = !loading && user === null;
    setFooterNavVisible(!hideFooterNav);

    return () => {
      setFooterNavVisible(true);
    };
  }, [loading, setFooterNavVisible, user]);
}
