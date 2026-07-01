import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import { LOAD_BINGO_BOARD_ERROR, useBingoBoard } from "@/features/bingo/hooks/useBingoBoard";
import * as bingoService from "@/services/bingo.service";
import type { AuthUser } from "@/types/user";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/services/bingo.service", () => ({
  getBoardState: vi.fn(),
  createBoard: vi.fn(),
  getChallenges: vi.fn(),
  updateChallengeStatus: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetBoardState = vi.mocked(bingoService.getBoardState);
const mockedCreateBoard = vi.mocked(bingoService.createBoard);
const mockedGetChallenges = vi.mocked(bingoService.getChallenges);
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

describe("useBingoBoard", () => {
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
    mockedGetChallenges.mockResolvedValue(testPlannerBingoChallenges);
    mockedCreateBoard.mockResolvedValue(emptyBoard);
  });

  it("loads challenges and completed state from the service", async () => {
    mockedGetBoardState.mockResolvedValue({
      ...emptyBoard,
      challengeStatuses: {
        ...emptyBoard.challengeStatuses,
        "planner-0": "COMPLETED",
      },
    });

    const { result } = renderHook(() => useBingoBoard("PLANNER"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetBoardState).toHaveBeenCalledWith("test-uid");
    expect(mockedCreateBoard).not.toHaveBeenCalled();
    expect(mockedGetChallenges).toHaveBeenCalledWith("PLANNER");
    expect(result.current.challenges).toEqual(testPlannerBingoChallenges);
    expect(result.current.completed).toEqual(["planner-0"]);
    expect(result.current.error).toBe("");
  });

  it("creates a board when the user has none yet", async () => {
    mockedGetBoardState.mockResolvedValue(null);

    const { result } = renderHook(() => useBingoBoard("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedCreateBoard).toHaveBeenCalledWith("test-uid", "PLANNER");
    expect(result.current.challenges).toEqual(testPlannerBingoChallenges);
    expect(result.current.completed).toEqual([]);
  });

  it("returns an empty board when no challenges exist for the personality type", async () => {
    mockedGetChallenges.mockResolvedValue([]);

    const { result } = renderHook(() => useBingoBoard("WORRIER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual([]);
    expect(result.current.completed).toEqual([]);
    expect(result.current.error).toBe("");
  });

  it("surfaces a user-facing error when getBoardState fails", async () => {
    vi.spyOn(bingoService, "getBoardState").mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useBingoBoard("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual([]);
    expect(result.current.completed).toEqual([]);
    expect(result.current.error).toBe(LOAD_BINGO_BOARD_ERROR);
  });

  it("surfaces a user-facing error when getChallenges fails", async () => {
    vi.spyOn(bingoService, "getChallenges").mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useBingoBoard("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual([]);
    expect(result.current.completed).toEqual([]);
    expect(result.current.error).toBe(LOAD_BINGO_BOARD_ERROR);
  });

  it("toggleChallenge persists status changes through the service", async () => {
    mockedUpdateChallengeStatus.mockResolvedValue({
      ...emptyBoard,
      challengeStatuses: {
        ...emptyBoard.challengeStatuses,
        "planner-0": "COMPLETED",
      },
    });

    const { result } = renderHook(() => useBingoBoard("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleChallenge("planner-0");
    });

    expect(mockedUpdateChallengeStatus).toHaveBeenCalledWith("test-uid", "planner-0", "COMPLETED");
    expect(result.current.completed).toEqual(["planner-0"]);

    mockedUpdateChallengeStatus.mockResolvedValue(emptyBoard);

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
});
