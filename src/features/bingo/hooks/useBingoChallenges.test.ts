import { act, renderHook, waitFor } from "@testing-library/react";

import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import {
  LOAD_BINGO_CHALLENGES_ERROR,
  useBingoChallenges,
} from "@/features/bingo/hooks/useBingoChallenges";
import { getChallenges } from "@/services/bingo.service";
import type { BingoChallenge } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

vi.mock("@/services/bingo.service", () => ({
  getChallenges: vi.fn(),
}));

const mockedGetChallenges = vi.mocked(getChallenges);

describe("useBingoChallenges", () => {
  beforeEach(() => {
    mockedGetChallenges.mockReset();
  });

  it("loads the challenges for a personality type from the bingo service", async () => {
    mockedGetChallenges.mockResolvedValue(testPlannerBingoChallenges);

    const { result } = renderHook(() => useBingoChallenges("PLANNER"));

    expect(result.current.loading).toBe(true);
    expect(result.current.challenges).toEqual([]);
    expect(result.current.error).toBe("");

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetChallenges).toHaveBeenCalledOnce();
    expect(result.current.challenges).toHaveLength(9);
    expect(result.current.challenges).toEqual(testPlannerBingoChallenges);
    expect(result.current.error).toBe("");
  });

  it("forwards the personality type to getChallenges", async () => {
    mockedGetChallenges.mockResolvedValue([]);

    const { result } = renderHook(() => useBingoChallenges("WORRIER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetChallenges).toHaveBeenCalledWith("WORRIER");
  });

  it("surfaces a user-facing error when getChallenges rejects", async () => {
    mockedGetChallenges.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useBingoChallenges("PLANNER"));

    expect(result.current.loading).toBe(true);
    expect(result.current.challenges).toEqual([]);
    expect(result.current.error).toBe("");

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual([]);
    expect(result.current.error).toBe(LOAD_BINGO_CHALLENGES_ERROR);
  });

  it("refetches when the personality type changes and drops the stale in-flight result", async () => {
    const worrierChallenges = testPlannerBingoChallenges.slice(0, 3);

    let resolvePlanner: (challenges: BingoChallenge[]) => void = () => {};
    let resolveWorrier: (challenges: BingoChallenge[]) => void = () => {};
    const plannerPromise = new Promise<BingoChallenge[]>((resolve) => {
      resolvePlanner = resolve;
    });
    const worrierPromise = new Promise<BingoChallenge[]>((resolve) => {
      resolveWorrier = resolve;
    });
    mockedGetChallenges.mockImplementation((personalityType) =>
      personalityType === "WORRIER" ? worrierPromise : plannerPromise,
    );

    const { result, rerender } = renderHook(({ type }) => useBingoChallenges(type), {
      initialProps: { type: "PLANNER" as PersonalityType },
    });

    // Switch type while the PLANNER fetch is still in flight.
    rerender({ type: "WORRIER" });

    await act(async () => {
      resolveWorrier(worrierChallenges);
      await worrierPromise;
    });

    await waitFor(() => {
      expect(result.current.challenges).toEqual(worrierChallenges);
    });

    // The stale PLANNER fetch resolves last; cancellation must discard it.
    await act(async () => {
      resolvePlanner(testPlannerBingoChallenges);
      await plannerPromise;
    });

    expect(mockedGetChallenges).toHaveBeenCalledTimes(2);
    expect(mockedGetChallenges).toHaveBeenNthCalledWith(1, "PLANNER");
    expect(mockedGetChallenges).toHaveBeenNthCalledWith(2, "WORRIER");
    expect(result.current.challenges).toEqual(worrierChallenges);
    expect(result.current.challenges).not.toEqual(testPlannerBingoChallenges);
  });
});
