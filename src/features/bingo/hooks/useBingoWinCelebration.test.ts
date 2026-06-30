import { act, renderHook } from "@testing-library/react";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import { useBingoWinCelebration } from "@/features/bingo/hooks/useBingoWinCelebration";

describe("useBingoWinCelebration", () => {
  it("does not celebrate on the initial completed state", () => {
    const { result } = renderHook(() =>
      useBingoWinCelebration(testPlannerBingoChallenges, ["planner-0", "planner-1", "planner-2"]),
    );

    expect(result.current.isCelebrating).toBe(false);
    expect(result.current.activeCelebration).toBeNull();
  });

  it("celebrates when a new line is completed", () => {
    const { result, rerender } = renderHook(
      ({ completed }) => useBingoWinCelebration(testPlannerBingoChallenges, completed),
      { initialProps: { completed: ["planner-0", "planner-1"] as string[] } },
    );

    rerender({ completed: ["planner-0", "planner-1", "planner-2"] });

    expect(result.current.isCelebrating).toBe(true);
    expect(result.current.activeCelebration?.id).toBe("row0");
  });

  it("does not celebrate when a challenge is un-completed", () => {
    const { result, rerender } = renderHook(
      ({ completed }) => useBingoWinCelebration(testPlannerBingoChallenges, completed),
      {
        initialProps: {
          completed: ["planner-0", "planner-1", "planner-2"] as string[],
        },
      },
    );

    rerender({ completed: ["planner-0", "planner-1"] });

    expect(result.current.isCelebrating).toBe(false);
  });

  it("queues two celebrations when a corner completes two lines at once", () => {
    const { result, rerender } = renderHook(
      ({ completed }) => useBingoWinCelebration(testPlannerBingoChallenges, completed),
      {
        initialProps: {
          completed: ["planner-1", "planner-2", "planner-3", "planner-6"] as string[],
        },
      },
    );

    rerender({
      completed: ["planner-0", "planner-1", "planner-2", "planner-3", "planner-6"],
    });

    expect(result.current.activeCelebration?.id).toBe("row0");
    expect(result.current.queuedCelebrationCount).toBe(2);

    act(() => {
      result.current.dismissCelebration();
    });

    expect(result.current.activeCelebration?.id).toBe("col0");
    expect(result.current.queuedCelebrationCount).toBe(1);
  });

  it("celebrates again after a line is un-completed and re-completed", () => {
    const { result, rerender } = renderHook(
      ({ completed }) => useBingoWinCelebration(testPlannerBingoChallenges, completed),
      {
        initialProps: {
          completed: ["planner-0", "planner-1", "planner-2"] as string[],
        },
      },
    );

    rerender({ completed: ["planner-0", "planner-1"] });
    expect(result.current.isCelebrating).toBe(false);

    rerender({ completed: ["planner-0", "planner-1", "planner-2"] });
    expect(result.current.isCelebrating).toBe(true);
    expect(result.current.activeCelebration?.id).toBe("row0");
  });
});
