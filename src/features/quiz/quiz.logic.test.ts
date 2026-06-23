import { scoreQuiz, toQuizFlowItems } from "./quiz.logic";
import { testQuizQuestions } from "./quiz.test-fixtures";
import type { PersonalityType, Question, QuizAnswersMap } from "@/types/quiz";

const OPTION_PERSONALITY_TYPES: PersonalityType[] = [
  "PLANNER",
  "WORRIER",
  "FREE_SPIRIT",
  "OVERWHELMED_STARTER",
];

function makeQuestion(
  questionId: string,
  optionIds: [string, string, string, string],
): Question {
  return {
    id: questionId,
    text: questionId,
    options: optionIds.map((optionId, index) => ({
      id: optionId,
      text: optionId,
      personalityType: OPTION_PERSONALITY_TYPES[index],
    })),
  };
}

const standardQuestions: Question[] = [
  makeQuestion("q1", ["a", "b", "c", "d"]),
  makeQuestion("q2", ["a", "b", "c", "d"]),
  makeQuestion("q3", ["a", "b", "c", "d"]),
  makeQuestion("q4", ["a", "b", "c", "d"]),
  makeQuestion("q5", ["a", "b", "c", "d"]),
];

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
    expect(scoreQuiz(standardQuestions, allAnswers(optionId))).toBe(personalityType);
  });

  it("scores seeded Firestore option ids using each option's personalityType", () => {
    const seededQuestions: Question[] = [
      makeQuestion("q1", ["q1a", "q1b", "q1c", "q1d"]),
      makeQuestion("q2", ["q2a", "q2b", "q2c", "q2d"]),
      makeQuestion("q3", ["q3a", "q3b", "q3c", "q3d"]),
      makeQuestion("q4", ["q4a", "q4b", "q4c", "q4d"]),
      makeQuestion("q5", ["q5a", "q5b", "q5c", "q5d"]),
    ];

    expect(
      scoreQuiz(seededQuestions, {
        q1: "q1a",
        q2: "q2a",
        q3: "q3a",
        q4: "q4a",
        q5: "q5a",
      }),
    ).toBe("PLANNER");
  });

  it("uses Q1 fallback when double-weighting creates a tied highest score", () => {
    expect(
      scoreQuiz(standardQuestions, {
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
      scoreQuiz(standardQuestions, {
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
      scoreQuiz(standardQuestions, {
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
      scoreQuiz(standardQuestions, {
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
      scoreQuiz(standardQuestions, {
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
    const question = testQuizQuestions[0];

    expect(toQuizFlowItems([question])).toEqual([
      {
        heading: "Q1",
        question,
      },
    ]);
  });

  it("maps each question to a flow item with a one-based heading", () => {
    const questions = testQuizQuestions.slice(0, 2);

    expect(toQuizFlowItems(questions)).toEqual([
      { heading: "Q1", question: questions[0] },
      { heading: "Q2", question: questions[1] },
    ]);
  });
});
