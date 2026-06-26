import { render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import quizNavIcon from "@/assets/icon-nav-quiz.png";
import bingoNavIcon from "@/assets/icon-nav-bingo.png";
import { getAppCopyrightText } from "@/lib/appCopyright";
import type { AppNavLinkProps } from "@/components/layout/appNavLink";
import { AppFooter } from "./AppFooter";

const defaultProps = {
  navLink: Link,
  quizNav: {
    to: "/quiz",
    label: "Quiz",
    iconSrc: quizNavIcon,
    isActive: true,
  },
  bingoNav: {
    to: "/bingo",
    label: "Bingo",
    iconSrc: bingoNavIcon,
    isActive: false,
  },
};

function StubNavLink({ to, children, ...props }: AppNavLinkProps) {
  return (
    <a href={to} data-nav-kind="client" {...props}>
      {children}
    </a>
  );
}

describe("AppFooter", () => {
  it("renders the navigation bar and copyright line", () => {
    render(
      <MemoryRouter>
        <AppFooter {...defaultProps} />
      </MemoryRouter>,
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("w-full");
    expect(screen.getByRole("navigation", { name: /app navigation/i })).toHaveClass("w-full");
    expect(
      screen.getByRole("navigation", { name: /app navigation/i }).firstElementChild,
    ).toHaveClass("h-app-footer-nav");
    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /quiz/i })).toHaveAttribute("href", "/quiz");
    expect(screen.getByRole("link", { name: /bingo/i })).toHaveAttribute("href", "/bingo");
    expect(screen.getByText(getAppCopyrightText())).toBeInTheDocument();
  });

  it("marks the active destination with aria-current", () => {
    render(
      <MemoryRouter>
        <AppFooter {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /quiz/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /bingo/i })).not.toHaveAttribute("aria-current");
  });

  it("renders footer targets through the supplied client nav link component", () => {
    render(<AppFooter {...defaultProps} navLink={StubNavLink} />);

    const links = screen.getAllByRole("link", { name: /quiz|bingo/i });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute("data-nav-kind", "client");
    }
  });

  it("renders only the copyright line when navigation is hidden", () => {
    render(
      <MemoryRouter>
        <AppFooter {...defaultProps} navVisible={false} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(getAppCopyrightText())).toBeInTheDocument();
  });
});
