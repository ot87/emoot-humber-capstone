import { scoreQuiz, toQuizFlowItems } from "./quiz.logic";
import type { QuizAnswersMap } from "@/types/quiz";

function allAnswers(optionId: string): QuizAnswersMap {
  return {
    q1: optionId,
    q2: optionId,
    q3: optionId,
    q4: optionId,
    q5: optionId,
  };
}

describe("scoreQuiz", () => {
  it.each([
    ["PLANNER", "a"],
    ["WORRIER", "b"],
    ["FREE_SPIRIT", "c"],
    ["OVERWHELMED_STARTER", "d"],
  ] as const)("returns %s when every answer is %s", (personalityType, optionId) => {
    expect(scoreQuiz(allAnswers(optionId))).toBe(personalityType);
  });

  it("uses Q1 fallback when double-weighting creates a tied highest score", () => {
    expect(
      scoreQuiz({
        q1: "b",
        q2: "b",
        q3: "a",
        q4: "a",
        q5: "a",
      }),
    ).toBe("WORRIER");
  });

  it("uses question 1 as the tie-breaker when weighted counts are equal", () => {
    expect(
      scoreQuiz({
        q1: "c",
        q2: "a",
        q3: "a",
        q4: "b",
        q5: "b",
      }),
    ).toBe("FREE_SPIRIT");
  });

  it("does not use question 1 when one type has the highest weighted count", () => {
    expect(
      scoreQuiz({
        q1: "b",
        q2: "a",
        q3: "a",
        q4: "a",
        q5: "a",
      }),
    ).toBe("PLANNER");
  });

  it("throws when an answer uses an unknown option id", () => {
    expect(() =>
      scoreQuiz({
        q1: "a",
        q2: "b",
        q3: "z",
        q4: "d",
        q5: "a",
      }),
    ).toThrow("Unknown quiz option id: z");
  });

  it("throws when question 1 is missing from the answers map", () => {
    expect(() =>
      scoreQuiz({
        q2: "a",
        q3: "a",
        q4: "a",
        q5: "a",
      }),
    ).toThrow("Missing answer for question 1");
  });
});

describe("toQuizFlowItems", () => {
  it("returns an empty array for no questions", () => {
    expect(toQuizFlowItems([])).toEqual([]);
  });

  it("assigns sequential Q headings and preserves each question", () => {
    const question = {
      id: "q1",
      text: "Sample question",
      options: [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
        { id: "c", text: "Option C" },
        { id: "d", text: "Option D" },
      ],
    };

    expect(toQuizFlowItems([question])).toEqual([
      {
        heading: "Q1",
        question,
      },
    ]);
  });

  it("maps each question to a flow item with a one-based heading", () => {
    const questions = [
      { id: "q1", text: "First", options: [{ id: "a", text: "A" }] },
      { id: "q2", text: "Second", options: [{ id: "a", text: "A" }] },
    ];

    expect(toQuizFlowItems(questions)).toEqual([
      { heading: "Q1", question: questions[0] },
      { heading: "Q2", question: questions[1] },
    ]);
  });
});
