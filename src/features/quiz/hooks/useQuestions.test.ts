import { renderHook, waitFor } from "@testing-library/react";
import { getQuestions } from "@/services/quiz.service";
import { testLoadedQuiz, testQuizQuestions } from "@/features/quiz/quiz.test-fixtures";
import { useQuestions } from "./useQuestions";

vi.mock("@/services/quiz.service", () => ({
  getQuestions: vi.fn(),
}));

const mockedGetQuestions = vi.mocked(getQuestions);

describe("useQuestions", () => {
  beforeEach(() => {
    mockedGetQuestions.mockReset();
  });

  it("loads questions from the quiz service and maps them to flow items", async () => {
    mockedGetQuestions.mockResolvedValue(testLoadedQuiz);

    const { result } = renderHook(() => useQuestions());

    expect(result.current.loading).toBe(true);
    expect(result.current.questions).toEqual([]);
    expect(result.current.quizId).toBeNull();
    expect(result.current.error).toBe("");

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetQuestions).toHaveBeenCalledOnce();
    expect(mockedGetQuestions).toHaveBeenCalledWith(undefined);
    expect(result.current.quizId).toBe("moneyPersonalityQuiz");
    expect(result.current.questions).toHaveLength(testQuizQuestions.length);
    expect(result.current.questions[0]?.heading).toBe("Q1");
    expect(result.current.questions[0]?.question).toEqual(testQuizQuestions[0]);
    expect(result.current.error).toBe("");
  });

  it("forwards an explicit quiz id to getQuestions", async () => {
    mockedGetQuestions.mockResolvedValue({ quizId: null, questions: [] });

    const { result } = renderHook(() => useQuestions("moneyPersonalityQuiz"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetQuestions).toHaveBeenCalledWith("moneyPersonalityQuiz");
  });

  it("surfaces a user-facing error when getQuestions rejects", async () => {
    mockedGetQuestions.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useQuestions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questions).toEqual([]);
    expect(result.current.quizId).toBeNull();
    expect(result.current.error).toBe("Could not load quiz questions. Please try again.");
  });
});
