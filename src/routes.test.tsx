import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { getSavedQuizResult } from "@/services/quiz.service";
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
});
