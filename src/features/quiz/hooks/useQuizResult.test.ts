import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getActiveQuizId, getSavedQuizResult, saveQuizResult } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";
import { useQuizResult } from "./useQuizResult";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/quiz.service", () => ({
  getActiveQuizId: vi.fn(),
  getSavedQuizResult: vi.fn(),
  saveQuizResult: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetActiveQuizId = vi.mocked(getActiveQuizId);
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

describe("useQuizResult", () => {
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
    mockedGetSavedQuizResult.mockResolvedValue(null);
    mockedGetActiveQuizId.mockResolvedValue("moneyPersonalityQuiz");
    mockedSaveQuizResult.mockResolvedValue(savedResult);
  });

  it("loads the saved quiz result for a signed-in user", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });
    mockedGetSavedQuizResult.mockResolvedValue(savedResult);

    const { result } = renderHook(() => useQuizResult());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetSavedQuizResult).toHaveBeenCalledWith("test-uid");
    expect(result.current.savedResult).toEqual(savedResult);
    expect(result.current.hasSavedResult).toBe(true);
    expect(result.current.error).toBe("");
  });

  it("does not load a saved result when the user is signed out", async () => {
    const { result } = renderHook(() => useQuizResult());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetSavedQuizResult).not.toHaveBeenCalled();
    expect(result.current.savedResult).toBeNull();
    expect(result.current.hasSavedResult).toBe(false);
  });

  it("surfaces a user-facing error when loading fails", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });
    mockedGetSavedQuizResult.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useQuizResult());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.savedResult).toBeNull();
    expect(result.current.error).toBe("Could not load your quiz result. Please try again.");
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

    const { result } = renderHook(() => useQuizResult());

    let saved = false;

    await act(async () => {
      saved = await result.current.saveCompletion({
        personalityType: "WORRIER",
        answers: { q1: "q1b" },
      });
    });

    expect(saved).toBe(true);
    expect(mockedGetActiveQuizId).toHaveBeenCalledOnce();
    expect(mockedSaveQuizResult).toHaveBeenCalledWith(
      "test-uid",
      "moneyPersonalityQuiz",
      { q1: "q1b" },
      "WORRIER",
      expect.any(Date),
    );
    expect(result.current.savedResult).toEqual(savedResult);
    expect(result.current.error).toBe("");
  });

  it("uses an explicit quiz id when saving", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });

    const { result } = renderHook(() => useQuizResult());

    await act(async () => {
      await result.current.saveCompletion(
        {
          personalityType: "PLANNER",
          answers: { q1: "q1a" },
        },
        "custom-quiz-id",
      );
    });

    expect(mockedGetActiveQuizId).not.toHaveBeenCalled();
    expect(mockedSaveQuizResult).toHaveBeenCalledWith(
      "test-uid",
      "custom-quiz-id",
      { q1: "q1a" },
      "PLANNER",
      expect.any(Date),
    );
  });

  it("does not save when the user is signed out", async () => {
    const { result } = renderHook(() => useQuizResult());

    let saved = true;

    await act(async () => {
      saved = await result.current.saveCompletion({
        personalityType: "PLANNER",
        answers: { q1: "q1a" },
      });
    });

    expect(saved).toBe(false);
    expect(mockedSaveQuizResult).not.toHaveBeenCalled();
  });
});
