import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import quizNavIcon from "@/assets/icon-nav-quiz.png";
import bingoNavIcon from "@/assets/icon-nav-bingo.png";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppShellVisibilityProvider } from "@/components/layout/AppShellVisibilityProvider";

function getBingoNavActive(pathname: string): boolean {
  return pathname === "/bingo" || pathname.startsWith("/bingo/");
}

export function AppLayout() {
  const location = useLocation();
  const [headerVisible, setHeaderVisible] = useState(true);
  const bingoNavActive = getBingoNavActive(location.pathname);

  return (
    <AppShellVisibilityProvider setHeaderVisible={setHeaderVisible}>
      <div className="flex min-h-dvh flex-col bg-background">
        {headerVisible ? <AppHeader homeHref="/quiz" /> : null}

        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>

        <AppFooter
          quizNav={{
            href: "/quiz",
            label: "Quiz",
            iconSrc: quizNavIcon,
            isActive: !bingoNavActive,
          }}
          bingoNav={{
            href: "/bingo",
            label: "Bingo",
            iconSrc: bingoNavIcon,
            isActive: bingoNavActive,
          }}
        />
      </div>
    </AppShellVisibilityProvider>
  );
}
