import {
  buildAuthLocationState,
  parseAuthLocationState,
  parsePendingQuizCompletion,
  parseQuizResultRouteState,
} from "./quiz.route-state";

const sampleCompletion = {
  personalityType: "PLANNER" as const,
  answers: { q1: "a" },
};

describe("quiz.route-state", () => {
  it("builds auth state with pending completion when deferred save is needed", () => {
    expect(buildAuthLocationState(sampleCompletion, true, "moneyPersonalityQuiz")).toEqual({
      from: "/bingo",
      pendingQuizCompletion: {
        ...sampleCompletion,
        quizId: "moneyPersonalityQuiz",
      },
    });
  });

  it("omits pending completion when deferred save is not needed", () => {
    expect(buildAuthLocationState(sampleCompletion, false, "moneyPersonalityQuiz")).toEqual({
      from: "/bingo",
    });
  });

  it("parses pending completion from auth location state", () => {
    expect(
      parseAuthLocationState({
        from: "/bingo",
        pendingQuizCompletion: {
          ...sampleCompletion,
          quizId: "moneyPersonalityQuiz",
        },
      }),
    ).toEqual({
      from: "/bingo",
      pendingQuizCompletion: {
        ...sampleCompletion,
        quizId: "moneyPersonalityQuiz",
      },
    });
  });

  it("rejects malformed pending completion payloads", () => {
    expect(parsePendingQuizCompletion({ personalityType: "PLANNER" })).toBeNull();
    expect(parsePendingQuizCompletion({ ...sampleCompletion, quizId: "" })).toBeNull();
  });

  it("parses quiz result route state with deferred-save metadata", () => {
    expect(
      parseQuizResultRouteState({
        ...sampleCompletion,
        quizId: "moneyPersonalityQuiz",
        needsDeferredSave: true,
      }),
    ).toEqual({
      ...sampleCompletion,
      quizId: "moneyPersonalityQuiz",
      needsDeferredSave: true,
    });
  });
});
