import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";
import type { AuthUser } from "@/types/user";

// Mock services before App/routes load so lib/firebase (initializeApp at import
// time) is never reached without valid VITE_FIREBASE_* env vars.
vi.mock("@/services/quiz.service", () => ({
  getSavedQuizResult: vi.fn(),
  getQuestions: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(null);
    return () => {};
  }),
}));

describe("App", () => {
  it("renders the default route", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /find your money personality/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
  });
});
