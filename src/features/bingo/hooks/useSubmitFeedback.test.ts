import { act, renderHook } from "@testing-library/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { submitFeedback } from "@/services/bingo.service";
import type { AuthUser } from "@/types/user";
import { SUBMIT_FEEDBACK_ERROR, useSubmitFeedback } from "@/features/bingo/hooks/useSubmitFeedback";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/bingo.service", () => ({
  submitFeedback: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedSubmitFeedback = vi.mocked(submitFeedback);

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

describe("useSubmitFeedback", () => {
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
    mockedSubmitFeedback.mockResolvedValue(undefined);
  });

  it("does not call the service when the user is signed out", async () => {
    const { result } = renderHook(() => useSubmitFeedback("PLANNER"));

    let outcome: Awaited<ReturnType<typeof result.current.submitFeedback>> = "submitted";

    await act(async () => {
      outcome = await result.current.submitFeedback("UP");
    });

    expect(outcome).toBe("skipped");
    expect(mockedSubmitFeedback).not.toHaveBeenCalled();
  });

  it("submits a thumbs-up vote for a signed-in user via the service", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useSubmitFeedback("PLANNER"));

    let outcome: Awaited<ReturnType<typeof result.current.submitFeedback>> = "failed";

    await act(async () => {
      outcome = await result.current.submitFeedback("UP");
    });

    expect(outcome).toBe("submitted");
    expect(result.current.submitted).toBe(true);
    expect(result.current.submitting).toBe(false);
    expect(result.current.error).toBe("");
    expect(mockedSubmitFeedback).toHaveBeenCalledOnce();
    expect(mockedSubmitFeedback).toHaveBeenCalledWith("test-uid", "PLANNER", "UP");
  });

  it("passes a thumbs-down vote and the board's personality type through", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useSubmitFeedback("WORRIER"));

    await act(async () => {
      await result.current.submitFeedback("DOWN");
    });

    expect(mockedSubmitFeedback).toHaveBeenCalledWith("test-uid", "WORRIER", "DOWN");
  });

  it("returns failed when the service throws and allows a retry", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });
    mockedSubmitFeedback.mockRejectedValueOnce(new Error("network failure"));

    const { result } = renderHook(() => useSubmitFeedback("PLANNER"));

    let outcome: Awaited<ReturnType<typeof result.current.submitFeedback>> = "submitted";

    await act(async () => {
      outcome = await result.current.submitFeedback("UP");
    });

    expect(outcome).toBe("failed");
    expect(result.current.error).toBe(SUBMIT_FEEDBACK_ERROR);
    expect(result.current.submitted).toBe(false);

    let retryOutcome: Awaited<ReturnType<typeof result.current.submitFeedback>> = "failed";

    await act(async () => {
      retryOutcome = await result.current.submitFeedback("UP");
    });

    expect(retryOutcome).toBe("submitted");
    expect(result.current.submitted).toBe(true);
    expect(mockedSubmitFeedback).toHaveBeenCalledTimes(2);
  });

  it("skips a second submit after a successful one", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useSubmitFeedback("PLANNER"));

    await act(async () => {
      await result.current.submitFeedback("UP");
    });

    let secondOutcome: Awaited<ReturnType<typeof result.current.submitFeedback>> = "submitted";

    await act(async () => {
      secondOutcome = await result.current.submitFeedback("DOWN");
    });

    expect(secondOutcome).toBe("skipped");
    expect(result.current.submitted).toBe(true);
    expect(mockedSubmitFeedback).toHaveBeenCalledOnce();
  });

  it("skips a second submit while the first is still in flight", async () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });

    let resolveSubmit: () => void = () => {};
    mockedSubmitFeedback.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = () => resolve();
        }),
    );

    const { result } = renderHook(() => useSubmitFeedback("PLANNER"));

    let firstOutcome: Awaited<ReturnType<typeof result.current.submitFeedback>> = "failed";
    let firstSubmit: Promise<void> = Promise.resolve();
    let secondOutcome: Awaited<ReturnType<typeof result.current.submitFeedback>> = "submitted";

    await act(async () => {
      firstSubmit = result.current.submitFeedback("UP").then((outcome) => {
        firstOutcome = outcome;
      });
      secondOutcome = await result.current.submitFeedback("DOWN");
    });

    expect(secondOutcome).toBe("skipped");
    expect(mockedSubmitFeedback).toHaveBeenCalledOnce();
    expect(result.current.submitting).toBe(true);

    await act(async () => {
      resolveSubmit();
      await firstSubmit;
    });

    expect(firstOutcome).toBe("submitted");
    expect(result.current.submitted).toBe(true);
    expect(result.current.submitting).toBe(false);
  });

  it("does not call the service on mount", () => {
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useSubmitFeedback("PLANNER"));

    expect(mockedSubmitFeedback).not.toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
    expect(result.current.submitted).toBe(false);
    expect(result.current.error).toBe("");
  });
});
