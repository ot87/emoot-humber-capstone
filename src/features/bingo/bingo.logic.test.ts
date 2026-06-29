import iconBingoCalendar from "@/assets/icon-bingo-calendar.svg";
import iconBingoCheck from "@/assets/icon-bingo-check.svg";
import iconBingoLightbulb from "@/assets/icon-bingo-lightbulb.svg";
import iconBingoPiggyBank from "@/assets/icon-bingo-piggy-bank.svg";
import iconBingoSpeechBubble from "@/assets/icon-bingo-speech-bubble.svg";
import {
  BINGO_CENTRE_POSITION,
  getBingoTaskCompletedIcon,
  getBingoTaskPendingIcon,
  getBingoTaskPendingIconForChallenge,
  getPersonalityDisplayName,
  getRemainingChallengeCount,
  isCentreChallenge,
  isChallengeCompleted,
  sortChallengesByPosition,
} from "@/features/bingo/bingo.logic";
import {
  testCompletedPartial,
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

describe("getBingoTaskCompletedIcon", () => {
  it("returns the check icon asset for completed tiles", () => {
    expect(getBingoTaskCompletedIcon()).toBe(iconBingoCheck);
  });
});

describe("getBingoTaskPendingIcon", () => {
  it("returns the calendar icon asset for incomplete tiles", () => {
    expect(getBingoTaskPendingIcon()).toBe(iconBingoCalendar);
  });
});

describe("getBingoTaskPendingIconForChallenge", () => {
  it("maps known challenge titles to task icons", () => {
    expect(getBingoTaskPendingIconForChallenge(testPlannerBingoChallenges[0])).toBe(
      iconBingoPiggyBank,
    );
    expect(getBingoTaskPendingIconForChallenge(testPlannerBingoChallenges[6])).toBe(
      iconBingoSpeechBubble,
    );
    expect(getBingoTaskPendingIconForChallenge(testPlannerBingoChallenges[5])).toBe(
      iconBingoLightbulb,
    );
  });

  it("falls back to the calendar icon for unmapped titles", () => {
    expect(getBingoTaskPendingIconForChallenge(testPlannerBingoChallenges[1])).toBe(
      iconBingoCalendar,
    );
  });
});
