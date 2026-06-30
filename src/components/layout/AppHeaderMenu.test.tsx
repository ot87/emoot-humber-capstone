import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { listenToAuthChanges, signOut } from "@/services/auth.service";
import { AuthProvider } from "@/features/auth/AuthProvider";
import type { AuthUser } from "@/types/user";
import { AppHeaderMenu } from "./AppHeaderMenu";

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(null);
    return () => {};
  }),
}));

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

function renderMenu() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <AppHeaderMenu />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("AppHeaderMenu", () => {
  beforeEach(() => {
    vi.mocked(signOut).mockResolvedValue(undefined);
  });

  it("renders a layout spacer when the user is signed out", () => {
    const { container } = renderMenu();

    expect(screen.queryByRole("button", { name: /open menu/i })).not.toBeInTheDocument();
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("opens a menu with sign out when the user is signed in", async () => {
    const user = userEvent.setup();

    vi.mocked(listenToAuthChanges).mockImplementation((callback) => {
      callback(signedInUser);
      return () => {};
    });

    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(screen.getByRole("menuitem", { name: /sign out/i })).toBeInTheDocument();
  });

  it("signs out and navigates to /auth when sign out is selected", async () => {
    const user = userEvent.setup();

    vi.mocked(listenToAuthChanges).mockImplementation((callback) => {
      callback(signedInUser);
      return () => {};
    });

    renderMenu();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.click(screen.getByRole("menuitem", { name: /sign out/i }));

    expect(signOut).toHaveBeenCalledOnce();
  });
});
