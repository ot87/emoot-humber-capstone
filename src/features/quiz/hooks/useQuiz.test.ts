import { act, renderHook } from "@testing-library/react";
import { quizQuestions } from "@/features/quiz/quiz.questions";
import { scoreQuiz } from "@/features/quiz/quiz.logic";
import type { QuizCompletionResult } from "@/types/quiz";
import { useQuiz } from "./useQuiz";

vi.mock("@/features/quiz/quiz.logic", () => ({
  scoreQuiz: vi.fn(() => "worrier" as const),
}));

const mockedScoreQuiz = vi.mocked(scoreQuiz);

function answerCurrent(result: { current: ReturnType<typeof useQuiz> }, optionId: string): void {
  act(() => {
    result.current.selectOption(optionId);
  });
}

function goNext(result: { current: ReturnType<typeof useQuiz> }): void {
  act(() => {
    result.current.goNext();
  });
}

function goBack(result: { current: ReturnType<typeof useQuiz> }): void {
  act(() => {
    result.current.goBack();
  });
}

describe("useQuiz", () => {
  beforeEach(() => {
    mockedScoreQuiz.mockClear();
  });

  it("moves forward through all questions while preserving answers", () => {
    const { result } = renderHook(() => useQuiz(quizQuestions));

    act(() => {
      result.current.start();
    });

    const optionIds = ["a", "b", "c", "d", "a"] as const;

    optionIds.forEach((optionId, index) => {
      expect(result.current.currentItem?.question.id).toBe(`q${index + 1}`);
      answerCurrent(result, optionId);
      if (index < quizQuestions.length - 1) {
        goNext(result);
      }
    });

    expect(result.current.answers).toEqual([
      { questionId: "q1", optionId: "a" },
      { questionId: "q2", optionId: "b" },
      { questionId: "q3", optionId: "c" },
      { questionId: "q4", optionId: "d" },
      { questionId: "q5", optionId: "a" },
    ]);
    expect(result.current.progressPercent).toBe(100);
  });

  it("reflects current question position in progress percent", () => {
    const { result } = renderHook(() => useQuiz(quizQuestions));

    act(() => {
      result.current.start();
    });

    expect(result.current.progressPercent).toBe(20);

    answerCurrent(result, "a");
    expect(result.current.progressPercent).toBe(20);

    goNext(result);
    expect(result.current.progressPercent).toBe(40);

    answerCurrent(result, "b");
    goNext(result);
    answerCurrent(result, "c");

    expect(result.current.progressPercent).toBe(60);
  });

  it("restores a prior answer on back navigation and allows changing it", () => {
    const { result } = renderHook(() => useQuiz(quizQuestions));

    act(() => {
      result.current.start();
    });

    answerCurrent(result, "a");
    goNext(result);
    answerCurrent(result, "b");
    goNext(result);
    answerCurrent(result, "c");

    goBack(result);
    goBack(result);

    expect(result.current.currentItem?.question.id).toBe("q1");
    expect(result.current.progressPercent).toBe(20);
    expect(result.current.selectedOptionId).toBe("a");

    answerCurrent(result, "d");
    goNext(result);

    expect(result.current.selectedOptionId).toBe("b");
    expect(result.current.answers).toContainEqual({ questionId: "q1", optionId: "d" });
  });

  it("derives the personality type on completion via scoreQuiz", () => {
    const { result } = renderHook(() => useQuiz(quizQuestions));

    act(() => {
      result.current.start();
    });

    ["a", "b", "c", "d", "a"].forEach((optionId, index) => {
      answerCurrent(result, optionId);
      if (index < quizQuestions.length - 1) {
        goNext(result);
      }
    });

    let completion: QuizCompletionResult | null = null;

    act(() => {
      completion = result.current.complete();
    });

    const expectedAnswers = [
      { questionId: "q1", optionId: "a" },
      { questionId: "q2", optionId: "b" },
      { questionId: "q3", optionId: "c" },
      { questionId: "q4", optionId: "d" },
      { questionId: "q5", optionId: "a" },
    ];

    expect(completion).toEqual({
      personalityType: "worrier",
      answers: expectedAnswers,
    });
    expect(mockedScoreQuiz).toHaveBeenCalledOnce();
    expect(mockedScoreQuiz).toHaveBeenCalledWith({
      q1: "a",
      q2: "b",
      q3: "c",
      q4: "d",
      q5: "a",
    });
  });
});
