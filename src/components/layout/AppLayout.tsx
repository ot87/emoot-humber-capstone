import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import quizNavIcon from "@/assets/icon-nav-quiz.png";
import bingoNavIcon from "@/assets/icon-nav-bingo.png";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppShellVisibilityProvider } from "@/components/layout/AppShellVisibilityProvider";

function getQuizNavActive(pathname: string): boolean {
  return pathname === "/quiz";
}

function getBingoNavActive(pathname: string): boolean {
  return pathname === "/bingo" || pathname.startsWith("/bingo/");
}

export function AppLayout() {
  const location = useLocation();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [footerNavVisible, setFooterNavVisible] = useState(true);
  const quizNavActive = getQuizNavActive(location.pathname);
  const bingoNavActive = getBingoNavActive(location.pathname);

  return (
    <AppShellVisibilityProvider
      setHeaderVisible={setHeaderVisible}
      setFooterNavVisible={setFooterNavVisible}
    >
      <div className="flex h-svh w-full flex-col overflow-hidden bg-background">
        {headerVisible ? <AppHeader navLink={Link} homeTo="/quiz" /> : null}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex min-h-full flex-1 flex-col">
            <Outlet />
          </div>
        </div>

        <AppFooter
          navLink={Link}
          navVisible={footerNavVisible}
          quizNav={{
            to: "/quiz",
            label: "Quiz",
            iconSrc: quizNavIcon,
            isActive: quizNavActive,
          }}
          bingoNav={{
            to: "/bingo",
            label: "Bingo",
            iconSrc: bingoNavIcon,
            isActive: bingoNavActive,
          }}
        />
      </div>
    </AppShellVisibilityProvider>
  );
}
