import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { saveQuizResult } from "@/services/quiz.service";
import { signInWithGoogle, listenToAuthChanges } from "@/services/auth.service";
import type { AuthUser } from "@/types/user";
import { AuthPage } from "./AuthPage";

let authCallbacks: Array<(user: AuthUser | null) => void> = [];

function notifyAuthListeners(user: AuthUser | null) {
  authCallbacks.forEach((callback) => callback(user));
}

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    authCallbacks.push(callback);
    callback(null);
    return () => {
      authCallbacks = authCallbacks.filter((registered) => registered !== callback);
    };
  }),
}));

vi.mock("@/services/quiz.service", () => ({
  saveQuizResult: vi.fn(),
  getSavedQuizResult: vi.fn(),
  getQuestions: vi.fn(),
}));

const mockedSignInWithGoogle = vi.mocked(signInWithGoogle);
const mockedListenToAuthChanges = vi.mocked(listenToAuthChanges);
const mockedSaveQuizResult = vi.mocked(saveQuizResult);

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

const pendingAuthState = {
  from: "/bingo",
  pendingQuizCompletion: {
    personalityType: "PLANNER" as const,
    answers: { q1: "a", q2: "a", q3: "a", q4: "a", q5: "a" },
    quizId: "moneyPersonalityQuiz",
  },
};

function BingoStub() {
  const location = useLocation();
  return <div>Bingo page {JSON.stringify(location.state)}</div>;
}

function renderAuthPage(state: unknown = pendingAuthState) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/auth", state }]}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/bingo" element={<BingoStub />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authCallbacks = [];
    mockedListenToAuthChanges.mockImplementation((callback) => {
      authCallbacks.push(callback);
      callback(null);
      return () => {
        authCallbacks = authCallbacks.filter((registered) => registered !== callback);
      };
    });
    mockedSignInWithGoogle.mockImplementation(async () => {
      notifyAuthListeners(signedInUser);
      return signedInUser;
    });
    mockedSaveQuizResult.mockResolvedValue({
      userId: "test-uid",
      quizId: "moneyPersonalityQuiz",
      personalityType: "PLANNER",
      answers: pendingAuthState.pendingQuizCompletion.answers,
      completedAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it("persists pending quiz completion once after Google sign-in and routes to bingo", async () => {
    const user = userEvent.setup();

    renderAuthPage();

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    await waitFor(() => {
      expect(screen.getByText(/bingo page/i)).toBeInTheDocument();
    });

    expect(mockedSaveQuizResult).toHaveBeenCalledOnce();
    expect(mockedSaveQuizResult).toHaveBeenCalledWith(
      "test-uid",
      "moneyPersonalityQuiz",
      pendingAuthState.pendingQuizCompletion.answers,
      "PLANNER",
      expect.any(Date),
    );
  });

  it("persists pending quiz completion once when user is already signed in", async () => {
    mockedListenToAuthChanges.mockImplementation((callback) => {
      authCallbacks.push(callback);
      callback(signedInUser);
      return () => {
        authCallbacks = authCallbacks.filter((registered) => registered !== callback);
      };
    });

    renderAuthPage();

    await waitFor(() => {
      expect(screen.getByText(/bingo page/i)).toBeInTheDocument();
    });

    expect(mockedSignInWithGoogle).not.toHaveBeenCalled();
    expect(mockedSaveQuizResult).toHaveBeenCalledOnce();
    expect(mockedSaveQuizResult).toHaveBeenCalledWith(
      "test-uid",
      "moneyPersonalityQuiz",
      pendingAuthState.pendingQuizCompletion.answers,
      "PLANNER",
      expect.any(Date),
    );
  });

  it("routes to bingo without saving when no pending completion is present", async () => {
    const user = userEvent.setup();

    renderAuthPage({ from: "/bingo" });

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    await waitFor(() => {
      expect(screen.getByText(/bingo page/i)).toBeInTheDocument();
    });

    expect(mockedSaveQuizResult).not.toHaveBeenCalled();
  });

  it("routes to bingo with a save error when deferred persistence fails", async () => {
    const user = userEvent.setup();

    mockedSaveQuizResult.mockRejectedValue(new Error("network failure"));

    renderAuthPage();

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    await waitFor(() => {
      expect(screen.getByText(/bingo page/i)).toHaveTextContent(/could not save your quiz result/i);
    });

    expect(mockedSaveQuizResult).toHaveBeenCalledOnce();
  });
});
