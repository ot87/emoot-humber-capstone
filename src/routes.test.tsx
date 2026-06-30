import type { ComponentProps } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { AuthProvider } from "@/features/auth/AuthProvider";
import {
  testLoadedQuiz,
  testQuizQuestions,
  testResultDefinitions,
} from "@/features/quiz/quiz.test-fixtures";
import { getQuestions, getResultDefinitions, getSavedQuizResult } from "@/services/quiz.service";
import { listenToAuthChanges } from "@/services/auth.service";
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
    user: signedInUser as AuthUser | null,
  };
});

vi.mock("@/services/quiz.service", () => ({
  getSavedQuizResult: vi.fn(),
  getQuestions: vi.fn(),
  getResultDefinitions: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(authMock.user);
    return () => {};
  }),
}));

function renderRoutes(initialEntries: ComponentProps<typeof MemoryRouter>["initialEntries"]) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("bingo result gate", () => {
  beforeEach(() => {
    authMock.user = authMock.signedInUser;
    vi.mocked(getSavedQuizResult).mockResolvedValue(null);
    vi.mocked(getQuestions).mockResolvedValue(testLoadedQuiz);
    vi.mocked(getResultDefinitions).mockResolvedValue(testResultDefinitions);
  });

  it("redirects /bingo/board to the locked entry when no saved result exists", async () => {
    renderRoutes(["/bingo/board"]);

    expect(
      await screen.findByRole("heading", { name: /emoot bingo is locked/i }),
    ).toBeInTheDocument();
  });

  it("allows /bingo/board when a saved quiz result exists", async () => {
    vi.mocked(getSavedQuizResult).mockResolvedValue({
      userId: "test-uid",
      quizId: "money-personality",
      personalityType: "PLANNER",
      answers: { q1: "a" },
      completedAt: null,
      updatedAt: null,
    });

    renderRoutes(["/bingo/board"]);

    expect(await screen.findByRole("heading", { name: /bingo board/i })).toBeInTheDocument();
  });

  it("redirects unauthenticated /bingo visitors to auth", async () => {
    authMock.user = null;

    renderRoutes(["/bingo"]);

    expect(await screen.findByRole("heading", { name: /hi there!/i })).toBeInTheDocument();
  });

  it("renders login outside the shared app shell", async () => {
    authMock.user = null;

    renderRoutes(["/auth"]);

    expect(await screen.findByRole("heading", { name: /hi there!/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /emoot home/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/happy path ventures incorporated/i)).not.toBeInTheDocument();
  });
});

describe("quiz footer navigation", () => {
  beforeEach(() => {
    authMock.user = null;
    vi.mocked(getQuestions).mockResolvedValue(testLoadedQuiz);
    vi.mocked(getResultDefinitions).mockResolvedValue(testResultDefinitions);
  });

  it("hides footer navigation for signed-out visitors on /result", async () => {
    renderRoutes([
      {
        pathname: "/result",
        state: {
          personalityType: "PLANNER",
          answers: { q1: "a", q2: "a", q3: "a", q4: "a", q5: "a" },
        },
      },
    ]);

    expect(await screen.findByRole("heading", { name: /the planner/i })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("shows footer navigation for signed-in visitors on /quiz", async () => {
    authMock.user = authMock.signedInUser;

    renderRoutes(["/quiz"]);

    expect(await screen.findByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
  });

  it("shows footer navigation for signed-in visitors on /bingo", async () => {
    authMock.user = authMock.signedInUser;

    renderRoutes(["/bingo"]);

    expect(
      await screen.findByRole("heading", { name: /emoot bingo is locked/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
  });

  it("hides footer navigation for signed-out visitors during quiz questions", async () => {
    const user = userEvent.setup();

    renderRoutes(["/quiz"]);

    await screen.findByRole("button", { name: /start quiz/i });
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText(`Q1. ${testQuizQuestions[0].category}`)).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });
});

describe("auth guard loading state", () => {
  beforeEach(() => {
    vi.mocked(getSavedQuizResult).mockResolvedValue(null);
  });

  it("shows the loading spinner on a guarded route until auth resolves", async () => {
    let resolveAuth: ((user: AuthUser | null) => void) | undefined;
    // Defer auth: capture the listener callback instead of resolving synchronously.
    // mockImplementationOnce only affects this mount; later tests fall back to the
    // synchronous factory mock.
    vi.mocked(listenToAuthChanges).mockImplementationOnce((callback) => {
      resolveAuth = callback;
      return () => {};
    });

    renderRoutes(["/bingo"]);

    // The spinner here is RequireAuth's, before auth resolves.
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /emoot bingo is locked/i }),
    ).not.toBeInTheDocument();

    act(() => {
      resolveAuth?.(authMock.signedInUser);
    });

    expect(
      await screen.findByRole("heading", { name: /emoot bingo is locked/i }),
    ).toBeInTheDocument();
  });
});
