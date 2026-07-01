import { act, renderHook, waitFor } from "@testing-library/react";

import type { AuthUser } from "@/types/user";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import {
  LOAD_BINGO_PROGRESS_ERROR,
  useBingoProgress,
} from "@/features/bingo/hooks/useBingoProgress";

import * as bingoService from "@/services/bingo.service";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/bingo.service", () => ({
  getBoardState: vi.fn(),
  createBoard: vi.fn(),
  updateChallengeStatus: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetBoardState = vi.mocked(bingoService.getBoardState);
const mockedCreateBoard = vi.mocked(bingoService.createBoard);
const mockedUpdateChallengeStatus = vi.mocked(bingoService.updateChallengeStatus);

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

const emptyBoard = {
  userId: "test-uid",
  personalityType: "PLANNER" as const,
  challengeStatuses: Object.fromEntries(
    testPlannerBingoChallenges.map((challenge) => [challenge.challengeId, "NOT_STARTED" as const]),
  ),
  celebratedLines: [],
  feedbackSubmitted: false,
  completedAt: null,
  createdAt: null,
  updatedAt: null,
};

const boardWithFirstCompleted = {
  ...emptyBoard,
  challengeStatuses: {
    ...emptyBoard.challengeStatuses,
    "planner-0": "COMPLETED" as const,
  },
};

describe("useBingoProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      user: signedInUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });
    mockedGetBoardState.mockResolvedValue(emptyBoard);
    mockedCreateBoard.mockResolvedValue(emptyBoard);
  });

  it("loads the completed set from an existing board without creating one", async () => {
    mockedGetBoardState.mockResolvedValue(boardWithFirstCompleted);

    const { result } = renderHook(() => useBingoProgress("PLANNER"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetBoardState).toHaveBeenCalledWith("test-uid");
    expect(mockedCreateBoard).not.toHaveBeenCalled();
    expect(result.current.completed).toEqual(["planner-0"]);
    expect(result.current.error).toBe("");
  });

  it("creates a board only when getBoardState returns null", async () => {
    mockedGetBoardState.mockResolvedValue(null);

    const { result } = renderHook(() => useBingoProgress("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedCreateBoard).toHaveBeenCalledWith("test-uid", "PLANNER");
    expect(mockedCreateBoard).toHaveBeenCalledTimes(1);
    expect(result.current.completed).toEqual([]);
  });

  it("surfaces a user-facing error when getBoardState fails", async () => {
    mockedGetBoardState.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useBingoProgress("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.completed).toEqual([]);
    expect(result.current.error).toBe(LOAD_BINGO_PROGRESS_ERROR);
  });

  it("persists a toggle on and reflects the board the service returns", async () => {
    mockedUpdateChallengeStatus.mockResolvedValue(boardWithFirstCompleted);

    const { result } = renderHook(() => useBingoProgress("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleChallenge("planner-0");
    });

    expect(mockedUpdateChallengeStatus).toHaveBeenCalledWith("test-uid", "planner-0", "COMPLETED");
    expect(result.current.completed).toEqual(["planner-0"]);
    expect(result.current.error).toBe("");
  });

  it("persists a toggle off through the service", async () => {
    mockedGetBoardState.mockResolvedValue(boardWithFirstCompleted);
    mockedUpdateChallengeStatus.mockResolvedValue(emptyBoard);

    const { result } = renderHook(() => useBingoProgress("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.completed).toEqual(["planner-0"]);

    await act(async () => {
      await result.current.toggleChallenge("planner-0");
    });

    expect(mockedUpdateChallengeStatus).toHaveBeenCalledWith(
      "test-uid",
      "planner-0",
      "NOT_STARTED",
    );
    expect(result.current.completed).toEqual([]);
  });

  it("reverts the optimistic toggle and surfaces an error when the write fails", async () => {
    mockedUpdateChallengeStatus.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useBingoProgress("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleChallenge("planner-0");
    });

    expect(mockedUpdateChallengeStatus).toHaveBeenCalledWith("test-uid", "planner-0", "COMPLETED");
    expect(result.current.completed).toEqual([]);
    expect(result.current.error).toBe(LOAD_BINGO_PROGRESS_ERROR);
  });

  it("does not touch the service when the user is signed out", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      authAction: "idle",
      error: "",
      clearError: vi.fn(),
    });

    const { result } = renderHook(() => useBingoProgress("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleChallenge("planner-0");
    });

    expect(mockedGetBoardState).not.toHaveBeenCalled();
    expect(mockedCreateBoard).not.toHaveBeenCalled();
    expect(mockedUpdateChallengeStatus).not.toHaveBeenCalled();
    expect(result.current.completed).toEqual([]);
  });
});
