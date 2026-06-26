import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import {
  testLoadedQuiz,
  testQuizQuestions,
  testResultDefinitions,
} from "@/features/quiz/quiz.test-fixtures";
import { getQuestions, getResultDefinitions, getSavedQuizResult } from "@/services/quiz.service";
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

describe("bingo result gate", () => {
  beforeEach(() => {
    authMock.user = authMock.signedInUser;
    vi.mocked(getSavedQuizResult).mockResolvedValue(null);
    vi.mocked(getQuestions).mockResolvedValue(testLoadedQuiz);
    vi.mocked(getResultDefinitions).mockResolvedValue(testResultDefinitions);
  });

  it("redirects /bingo/board to the locked entry when no saved result exists", async () => {
    render(
      <MemoryRouter initialEntries={["/bingo/board"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

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

    render(
      <MemoryRouter initialEntries={["/bingo/board"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: /bingo board/i })).toBeInTheDocument();
  });

  it("redirects unauthenticated /bingo visitors to auth", async () => {
    authMock.user = null;

    render(
      <MemoryRouter initialEntries={["/bingo"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: /hi there!/i })).toBeInTheDocument();
  });

  it("renders login outside the shared app shell", async () => {
    authMock.user = null;

    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

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
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/result",
            state: {
              personalityType: "PLANNER",
              answers: { q1: "a", q2: "a", q3: "a", q4: "a", q5: "a" },
            },
          },
        ]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: /the planner/i })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("shows footer navigation for signed-in visitors on /quiz", async () => {
    authMock.user = authMock.signedInUser;

    render(
      <MemoryRouter initialEntries={["/quiz"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
  });

  it("shows footer navigation for signed-in visitors on /bingo", async () => {
    authMock.user = authMock.signedInUser;

    render(
      <MemoryRouter initialEntries={["/bingo"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: /emoot bingo is locked/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
  });

  it("hides footer navigation for signed-out visitors during quiz questions", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/quiz"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: /start quiz/i });
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText(`Q1. ${testQuizQuestions[0].category}`)).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });
});
