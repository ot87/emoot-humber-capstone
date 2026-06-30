import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signInWithGoogle } from "@/services/auth.service";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
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

const SIGN_IN_ERROR = /google sign-in failed/i;

// Exercises the provider error living across mounts.
function StaleErrorHarness() {
  const { signIn, error } = useAuth();
  const [showCard, setShowCard] = useState(false);

  return (
    <>
      <span data-testid="provider-error">{error || "none"}</span>
      <button type="button" onClick={() => void signIn()}>
        seed error
      </button>
      <button type="button" onClick={() => setShowCard(true)}>
        mount card
      </button>
      {showCard ? <SignInCard /> : null}
    </>
  );
}

describe("SignInCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signInWithGoogle).mockResolvedValue(signedInUser);
  });

  it('calls signInWithGoogle when "Continue with Google" is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <SignInCard />
      </AuthProvider>,
    );
    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(screen.getByText("Powered by Interac e-Transfer®")).toBeInTheDocument();

    expect(signInWithGoogle).toHaveBeenCalledOnce();
  });

  it("clears a stale shared auth error when the card mounts", async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithGoogle).mockRejectedValue(new Error("popup closed"));

    render(
      <AuthProvider>
        <StaleErrorHarness />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: /seed error/i }));
    await waitFor(() => {
      expect(screen.getByTestId("provider-error")).toHaveTextContent(SIGN_IN_ERROR);
    });

    // Mounting the card resets it, so a fresh /auth visit shows no stale error.
    await user.click(screen.getByRole("button", { name: /mount card/i }));

    expect(screen.queryByText(SIGN_IN_ERROR)).not.toBeInTheDocument();
    expect(screen.getByTestId("provider-error")).toHaveTextContent("none");
  });

  it("clears the error at the start of a sign-in retry", async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithGoogle)
      .mockRejectedValueOnce(new Error("popup closed"))
      .mockResolvedValueOnce(signedInUser);

    render(
      <AuthProvider>
        <SignInCard />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: /continue with google/i }));
    expect(await screen.findByText(SIGN_IN_ERROR)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /continue with google/i }));
    await waitFor(() => {
      expect(screen.queryByText(SIGN_IN_ERROR)).not.toBeInTheDocument();
    });
  });
});
