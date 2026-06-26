import { act, renderHook } from "@testing-library/react";
import { useSaveQuizResult } from "@/features/quiz/hooks/useSaveQuizResult";
import { usePersistPendingQuizResult } from "./usePersistPendingQuizResult";

vi.mock("@/features/quiz/hooks/useSaveQuizResult", () => ({
  SAVE_QUIZ_RESULT_ERROR: "Could not save your quiz result. Please try again.",
  useSaveQuizResult: vi.fn(),
}));

const mockedUseSaveQuizResult = vi.mocked(useSaveQuizResult);
const mockSaveCompletion = vi.fn();

describe("usePersistPendingQuizResult", () => {
  beforeEach(() => {
    mockSaveCompletion.mockReset();
    mockSaveCompletion.mockResolvedValue("saved");
    mockedUseSaveQuizResult.mockReturnValue({
      saveCompletion: mockSaveCompletion,
    });
  });

  it("skips when no pending completion is provided", async () => {
    const { result } = renderHook(() => usePersistPendingQuizResult());

    let outcome: Awaited<ReturnType<typeof result.current.persistPending>> = "saved";

    await act(async () => {
      outcome = await result.current.persistPending(null);
    });

    expect(outcome).toBe("skipped");
    expect(mockSaveCompletion).not.toHaveBeenCalled();
  });

  it("persists pending completion through the save hook", async () => {
    const { result } = renderHook(() => usePersistPendingQuizResult());

    await act(async () => {
      await result.current.persistPending(
        {
          personalityType: "PLANNER",
          answers: { q1: "a" },
          quizId: "moneyPersonalityQuiz",
        },
        "fresh-uid",
      );
    });

    expect(mockSaveCompletion).toHaveBeenCalledWith(
      {
        personalityType: "PLANNER",
        answers: { q1: "a" },
      },
      "moneyPersonalityQuiz",
      "fresh-uid",
    );
  });
});
