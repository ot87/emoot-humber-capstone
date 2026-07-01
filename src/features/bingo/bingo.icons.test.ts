import iconBingoCalendar from "@/assets/icon-bingo-calendar.svg";
import iconBingoCheck from "@/assets/icon-bingo-check.svg";
import iconBingoLightbulb from "@/assets/icon-bingo-lightbulb.svg";
import iconBingoPiggyBank from "@/assets/icon-bingo-piggy-bank.svg";
import iconBingoSpeechBubble from "@/assets/icon-bingo-speech-bubble.svg";
import {
  getBingoTaskCompletedIcon,
  getBingoTaskPendingIcon,
  getBingoTaskPendingIconForChallenge,
} from "@/features/bingo/bingo.icons";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";

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
