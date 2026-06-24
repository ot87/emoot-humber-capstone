import { act, renderHook } from "@testing-library/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getSavedQuizResult, saveQuizResult } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";
import { useSaveQuizResult } from "./useSaveQuizResult";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/quiz.service", () => ({
  getSavedQuizResult: vi.fn(),
  saveQuizResult: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetSavedQuizResult = vi.mocked(getSavedQuizResult);
const mockedSaveQuizResult = vi.mocked(saveQuizResult);

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

const savedResult = {
  userId: "test-uid",
  quizId: "moneyPersonalityQuiz",
  personalityType: "PLANNER" as const,
  answers: { q1: "q1a" },
  completedAt: new Date("2026-01-01T10:00:00.000Z"),
  updatedAt: new Date("2026-01-02T10:00:00.000Z"),
};

describe("useSaveQuizResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });
    mockedSaveQuizResult.mockResolvedValue(savedResult);
  });

  it("does not call the service when the user is signed out", async () => {
    const { result } = renderHook(() => useSaveQuizResult());

    let outcome: Awaited<ReturnType<typeof result.current.saveCompletion>> = "saved";

    await act(async () => {
      outcome = await result.current.saveCompletion(
        {
          personalityType: "PLANNER",
          answers: { q1: "q1a" },
        },
        "moneyPersonalityQuiz",
      );
    });

    expect(outcome).toBe("skipped");
    expect(mockedSaveQuizResult).not.toHaveBeenCalled();
  });

  it("saves a completion for a signed-in user via the service", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });

    const { result } = renderHook(() => useSaveQuizResult());

    let outcome: Awaited<ReturnType<typeof result.current.saveCompletion>> = "failed";

    await act(async () => {
      outcome = await result.current.saveCompletion(
        {
          personalityType: "WORRIER",
          answers: { q1: "q1b" },
        },
        "moneyPersonalityQuiz",
      );
    });

    expect(outcome).toBe("saved");
    expect(mockedSaveQuizResult).toHaveBeenCalledWith(
      "test-uid",
      "moneyPersonalityQuiz",
      { q1: "q1b" },
      "WORRIER",
      expect.any(Date),
    );
  });

  it("overwrites the prior save when the user completes the quiz again", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });
    mockedSaveQuizResult.mockResolvedValueOnce(savedResult).mockResolvedValueOnce({
      ...savedResult,
      personalityType: "WORRIER",
      answers: { q1: "q1b", q2: "q2a" },
    });

    const { result } = renderHook(() => useSaveQuizResult());

    await act(async () => {
      await result.current.saveCompletion(
        {
          personalityType: "PLANNER",
          answers: { q1: "q1a" },
        },
        "moneyPersonalityQuiz",
      );
    });

    let secondOutcome: Awaited<ReturnType<typeof result.current.saveCompletion>> = "failed";

    await act(async () => {
      secondOutcome = await result.current.saveCompletion(
        {
          personalityType: "WORRIER",
          answers: { q1: "q1b", q2: "q2a" },
        },
        "moneyPersonalityQuiz",
      );
    });

    expect(secondOutcome).toBe("saved");
    expect(mockedSaveQuizResult).toHaveBeenCalledTimes(2);
    expect(mockedSaveQuizResult).toHaveBeenNthCalledWith(
      2,
      "test-uid",
      "moneyPersonalityQuiz",
      { q1: "q1b", q2: "q2a" },
      "WORRIER",
      expect.any(Date),
    );
  });

  it("returns failed when saving throws", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });
    mockedSaveQuizResult.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useSaveQuizResult());

    let outcome: Awaited<ReturnType<typeof result.current.saveCompletion>> = "saved";

    await act(async () => {
      outcome = await result.current.saveCompletion(
        {
          personalityType: "PLANNER",
          answers: { q1: "q1a" },
        },
        "moneyPersonalityQuiz",
      );
    });

    expect(outcome).toBe("failed");
    expect(mockedSaveQuizResult).toHaveBeenCalledOnce();
  });

  it("does not trigger a saved-result load on mount", () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });

    renderHook(() => useSaveQuizResult());

    expect(mockedGetSavedQuizResult).not.toHaveBeenCalled();
    expect(mockedSaveQuizResult).not.toHaveBeenCalled();
  });
});
