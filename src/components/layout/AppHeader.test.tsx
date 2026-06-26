import { render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";
import type { AppNavLinkProps } from "@/components/layout/appNavLink";
import { listenToAuthChanges } from "@/services/auth.service";
import type { AuthUser } from "@/types/user";
import { AppHeader } from "./AppHeader";

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(null);
    return () => {};
  }),
}));

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
    render(
      <MemoryRouter>
        <AppHeader navLink={StubNavLink} homeTo="/quiz" />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /emoot home/i })).toHaveAttribute(
      "data-nav-kind",
      "client",
    );
  });

  it("renders the hamburger menu when a user is signed in", () => {
    const signedInUser: AuthUser = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: null,
    };

    vi.mocked(listenToAuthChanges).mockImplementation((callback) => {
      callback(signedInUser);
      return () => {};
    });

    render(
      <MemoryRouter>
        <AppHeader navLink={Link} homeTo="/quiz" />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });
});
