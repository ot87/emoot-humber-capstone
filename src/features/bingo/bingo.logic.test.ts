import {
  BINGO_CENTRE_POSITION,
  detectNewlyCompletedLines,
  getCompletedLines,
  getPersonalityDisplayName,
  getRemainingChallengeCount,
  isBoardComplete,
  isCentreChallenge,
  isChallengeCompleted,
  isLineComplete,
  sortChallengesByPosition,
} from "@/features/bingo/bingo.logic";
import {
  testCompletedPartial,
  testCompletedOneLine,
  testPlannerBingoChallenges,
} from "@/features/bingo/bingo.test-fixtures";

describe("sortChallengesByPosition", () => {
  it("returns challenges ordered by position ascending", () => {
    const shuffled = [
      testPlannerBingoChallenges[2],
      testPlannerBingoChallenges[0],
      testPlannerBingoChallenges[1],
    ];

    expect(sortChallengesByPosition(shuffled).map((challenge) => challenge.position)).toEqual([
      0, 1, 2,
    ]);
  });
});

describe("isChallengeCompleted", () => {
  it("returns true when the challenge id is in the completed set", () => {
    expect(isChallengeCompleted("planner-0", testCompletedPartial)).toBe(true);
  });

  it("returns false when the challenge id is not in the completed set", () => {
    expect(isChallengeCompleted("planner-1", testCompletedPartial)).toBe(false);
  });
});

describe("getRemainingChallengeCount", () => {
  it("returns how many challenges are left to complete", () => {
    expect(getRemainingChallengeCount(3, 9)).toBe(6);
    expect(getRemainingChallengeCount(9, 9)).toBe(0);
  });
});

describe("isBoardComplete", () => {
  it("returns true when every challenge is completed", () => {
    expect(isBoardComplete(9, 9)).toBe(true);
  });

  it("returns false when challenges remain", () => {
    expect(isBoardComplete(8, 9)).toBe(false);
    expect(isBoardComplete(0, 9)).toBe(false);
  });

  it("returns false when there are no challenges", () => {
    expect(isBoardComplete(0, 0)).toBe(false);
  });
});

describe("getPersonalityDisplayName", () => {
  it("returns the quiz personality label", () => {
    expect(getPersonalityDisplayName("PLANNER")).toBe("The Planner");
  });
});

describe("isCentreChallenge", () => {
  it("identifies the savings-goal tile at position 4", () => {
    const centre = testPlannerBingoChallenges.find(
      (challenge) => challenge.position === BINGO_CENTRE_POSITION,
    );

    expect(centre).toBeDefined();
    expect(isCentreChallenge(centre!)).toBe(true);
    expect(isCentreChallenge(testPlannerBingoChallenges[0])).toBe(false);
  });
});

describe("isLineComplete", () => {
  it("returns true when every position in the line is completed", () => {
    expect(
      isLineComplete(
        { id: "row0", kind: "row", index: 0, positions: [0, 1, 2] },
        testCompletedOneLine,
        testPlannerBingoChallenges,
      ),
    ).toBe(true);
  });

  it("returns false when any position in the line is incomplete", () => {
    expect(
      isLineComplete(
        { id: "row0", kind: "row", index: 0, positions: [0, 1, 2] },
        testCompletedPartial,
        testPlannerBingoChallenges,
      ),
    ).toBe(false);
  });
});

describe("getCompletedLines", () => {
  it("returns every line that is fully completed", () => {
    expect(
      getCompletedLines(testCompletedOneLine, testPlannerBingoChallenges).map((line) => line.id),
    ).toEqual(["row0"]);
  });
});

describe("detectNewlyCompletedLines", () => {
  it("reports a line that became complete on this toggle", () => {
    const previous = ["planner-0", "planner-1"];
    const next = ["planner-0", "planner-1", "planner-2"];

    expect(
      detectNewlyCompletedLines(previous, next, testPlannerBingoChallenges).map((line) => line.id),
    ).toEqual(["row0"]);
  });

  it("returns no lines when a challenge is un-completed", () => {
    const previous = testCompletedOneLine;
    const next = ["planner-0", "planner-1"];

    expect(detectNewlyCompletedLines(previous, next, testPlannerBingoChallenges)).toEqual([]);
  });

  it("reports two lines when a corner toggle completes row and column at once", () => {
    const previous = ["planner-1", "planner-2", "planner-3", "planner-6"];
    const next = [...previous, "planner-0"];

    expect(
      detectNewlyCompletedLines(previous, next, testPlannerBingoChallenges).map((line) => line.id),
    ).toEqual(["row0", "col0"]);
  });

  it("reports a column line after a row was already complete", () => {
    const rowComplete = ["planner-0", "planner-1", "planner-2"];
    const rowAndColumn = [...rowComplete, "planner-3", "planner-6"];

    expect(
      detectNewlyCompletedLines(rowComplete, rowAndColumn, testPlannerBingoChallenges).map(
        (line) => line.id,
      ),
    ).toEqual(["col0"]);
  });

  it("fires again when a line is un-completed and then re-completed", () => {
    const completed = testCompletedOneLine;
    const uncompleted = ["planner-0", "planner-1"];
    const recompleted = testCompletedOneLine;

    expect(detectNewlyCompletedLines(completed, uncompleted, testPlannerBingoChallenges)).toEqual(
      [],
    );
    expect(
      detectNewlyCompletedLines(uncompleted, recompleted, testPlannerBingoChallenges).map(
        (line) => line.id,
      ),
    ).toEqual(["row0"]);
  });
});
