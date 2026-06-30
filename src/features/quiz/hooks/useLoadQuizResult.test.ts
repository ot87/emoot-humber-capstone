import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getSavedQuizResult } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";
import { useLoadQuizResult } from "./useLoadQuizResult";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/quiz.service", () => ({
  getSavedQuizResult: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetSavedQuizResult = vi.mocked(getSavedQuizResult);

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

describe("useLoadQuizResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });
    mockedGetSavedQuizResult.mockResolvedValue(null);
  });

  it("loads the saved quiz result for a signed-in user", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });
    mockedGetSavedQuizResult.mockResolvedValue(savedResult);

    const { result } = renderHook(() => useLoadQuizResult());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetSavedQuizResult).toHaveBeenCalledWith("test-uid");
    expect(result.current.savedResult).toEqual(savedResult);
    expect(result.current.hasSavedResult).toBe(true);
    expect(result.current.error).toBe("");
  });

  it("does not load a saved result when the user is signed out", async () => {
    const { result } = renderHook(() => useLoadQuizResult());

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
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });
    mockedGetSavedQuizResult.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useLoadQuizResult());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.savedResult).toBeNull();
    expect(result.current.error).toBe("Could not load your quiz result. Please try again.");
  });
});
