import { scoreQuiz } from "./quiz.logic";

describe("scoreQuiz", () => {
  it("returns the stub personality type until KAN-29 replaces this seam", () => {
    expect(
      scoreQuiz([
        { questionId: "q1", optionId: "a" },
        { questionId: "q2", optionId: "b" },
      ]),
    ).toBe("planner");
  });
});
