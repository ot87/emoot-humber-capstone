import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { testLoadedQuiz, testQuizQuestions } from "@/features/quiz/quiz.test-fixtures";
import { getQuestions } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";

const authMock = vi.hoisted(() => {
  const signedInUser: AuthUser = {
    uid: "test-uid",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
  };

  return {
    signedInUser,
    user: null as AuthUser | null,
  };
});

// Mock services before App/routes load so lib/firebase (initializeApp at import
// time) is never reached without valid VITE_FIREBASE_* env vars.
vi.mock("@/services/quiz.service", () => ({
  getSavedQuizResult: vi.fn(),
  getQuestions: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(authMock.user);
    return () => {};
  }),
}));

const mockedGetQuestions = vi.mocked(getQuestions);

describe("App", () => {
  beforeEach(() => {
    authMock.user = null;
    mockedGetQuestions.mockResolvedValue(testLoadedQuiz);
  });

  it("renders the default route", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /find your money personality/i }),
      ).toBeInTheDocument();
    });

    expect(await screen.findByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /emoot home/i })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("hides footer navigation for signed-out visitors during quiz questions", async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText(`Q1. ${testQuizQuestions[0].category}`)).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("shows footer navigation for signed-in visitors on the quiz landing page", async () => {
    authMock.user = authMock.signedInUser;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    });

    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });
});
