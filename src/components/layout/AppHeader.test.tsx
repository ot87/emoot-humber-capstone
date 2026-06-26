import { render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import type { AppNavLinkProps } from "@/components/layout/appNavLink";
import { AppHeader } from "./AppHeader";

function StubNavLink({ to, children, ...props }: AppNavLinkProps) {
  return (
    <a href={to} data-nav-kind="client" {...props}>
      {children}
    </a>
  );
}

describe("AppHeader", () => {
  it("renders the centered EMOOT logo linking home", () => {
    render(
      <MemoryRouter>
        <AppHeader navLink={Link} homeTo="/quiz" />
      </MemoryRouter>,
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("border-b", "border-border", "shadow-app-header");
    expect(screen.getByRole("link", { name: /emoot home/i })).toHaveAttribute("href", "/quiz");
    expect(screen.getByRole("img", { name: /emoot/i })).toHaveAttribute("width", "78.36");
    expect(screen.getByRole("img", { name: /emoot/i })).toHaveAttribute("height", "38");
  });

  it("renders the home target through the supplied client nav link component", () => {
    render(<AppHeader navLink={StubNavLink} homeTo="/quiz" />);

    expect(screen.getByRole("link", { name: /emoot home/i })).toHaveAttribute(
      "data-nav-kind",
      "client",
    );
  });
});
