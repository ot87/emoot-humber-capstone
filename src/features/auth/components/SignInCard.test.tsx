import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signInWithGoogle } from "@/services/auth.service";
import type { AuthUser } from "@/types/user";
import { SignInCard } from "./SignInCard";

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

describe("SignInCard", () => {
  beforeEach(() => {
    vi.mocked(signInWithGoogle).mockResolvedValue(signedInUser);
  });

  it('calls signInWithGoogle when "Continue with Google" is clicked', async () => {
    const user = userEvent.setup();

    render(<SignInCard />);
    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(screen.getByText("Powered by Interac e-Transfer®")).toBeInTheDocument();

    expect(signInWithGoogle).toHaveBeenCalledOnce();
  });
});
