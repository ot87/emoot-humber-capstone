import { scoreQuiz } from "./quiz.logic";
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

  it("weights question 1 twice when breaking a count tie", () => {
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
});
