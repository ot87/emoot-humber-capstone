import { act, renderHook, waitFor } from "@testing-library/react";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import { useBingoBoard } from "@/features/bingo/hooks/useBingoBoard";

describe("useBingoBoard", () => {
  it("loads fixture challenges for PLANNER", async () => {
    const { result } = renderHook(() => useBingoBoard("PLANNER"));

    expect(result.current.loading).toBe(true);
    expect(result.current.challenges).toEqual([]);
    expect(result.current.completed).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual(testPlannerBingoChallenges);
    expect(result.current.completed).toEqual([]);
    expect(result.current.error).toBe("");
  });

  it("returns an empty board for personality types without fixture data", async () => {
    const { result } = renderHook(() => useBingoBoard("WORRIER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.challenges).toEqual([]);
    expect(result.current.error).toBe("");
  });

  it("toggleChallenge marks a challenge complete and incomplete", async () => {
    const { result } = renderHook(() => useBingoBoard("PLANNER"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleChallenge("planner-0");
    });

    expect(result.current.completed).toEqual(["planner-0"]);

    await act(async () => {
      await result.current.toggleChallenge("planner-0");
    });

    expect(result.current.completed).toEqual([]);
  });
});
