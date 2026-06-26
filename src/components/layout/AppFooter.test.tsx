import { render, screen } from "@testing-library/react";
import quizNavIcon from "@/assets/icon-nav-quiz.png";
import bingoNavIcon from "@/assets/icon-nav-bingo.png";
import { getAppCopyrightText } from "@/lib/appCopyright";
import { AppFooter } from "./AppFooter";

const defaultProps = {
  quizNav: {
    href: "/quiz",
    label: "Quiz",
    iconSrc: quizNavIcon,
    isActive: true,
  },
  bingoNav: {
    href: "/bingo",
    label: "Bingo",
    iconSrc: bingoNavIcon,
    isActive: false,
  },
};

describe("AppFooter", () => {
  it("renders the navigation bar and copyright line", () => {
    render(<AppFooter {...defaultProps} />);

    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /quiz/i })).toHaveAttribute("href", "/quiz");
    expect(screen.getByRole("link", { name: /bingo/i })).toHaveAttribute("href", "/bingo");
    expect(screen.getByText(getAppCopyrightText())).toBeInTheDocument();
  });

  it("marks the active destination with aria-current", () => {
    render(<AppFooter {...defaultProps} />);

    expect(screen.getByRole("link", { name: /quiz/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /bingo/i })).not.toHaveAttribute("aria-current");
  });
});
