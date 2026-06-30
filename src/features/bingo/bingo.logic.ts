import iconBingoCalendar from "@/assets/icon-bingo-calendar.svg";
import iconBingoCheck from "@/assets/icon-bingo-check.svg";
import iconBingoLightbulb from "@/assets/icon-bingo-lightbulb.svg";
import iconBingoPiggyBank from "@/assets/icon-bingo-piggy-bank.svg";
import iconBingoSpeechBubble from "@/assets/icon-bingo-speech-bubble.svg";
import iconBingoTrophy from "@/assets/icon-bingo-trophy.svg";
import iconPersonalityFreeSpirit from "@/assets/icon-personality-free-spirit.svg";
import iconPersonalityOverwhelmedStarter from "@/assets/icon-personality-overwhelmed-starter.svg";
import iconPersonalityPlanner from "@/assets/icon-personality-planner.svg";
import iconPersonalityWorrier from "@/assets/icon-personality-worrier.svg";
import type { BingoChallenge, BingoLine } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

/** Task tile icons — per-challenge mapping can replace the pending fallback later. */
export const BINGO_TASK_ICON = {
  calendar: iconBingoCalendar,
  check: iconBingoCheck,
  lightbulb: iconBingoLightbulb,
  piggyBank: iconBingoPiggyBank,
  speechBubble: iconBingoSpeechBubble,
  trophy: iconBingoTrophy,
} as const;

export const BINGO_CENTRE_POSITION = 4;
export const BINGO_GRID_SIZE = 9;

const PERSONALITY_DISPLAY_NAME: Record<PersonalityType, string> = {
  PLANNER: "The Planner",
  WORRIER: "The Worrier",
  FREE_SPIRIT: "The Free Spirit",
  OVERWHELMED_STARTER: "The Overwhelmed Starter",
};

const PERSONALITY_FACE_ICON: Record<PersonalityType, string> = {
  PLANNER: iconPersonalityPlanner,
  WORRIER: iconPersonalityWorrier,
  FREE_SPIRIT: iconPersonalityFreeSpirit,
  OVERWHELMED_STARTER: iconPersonalityOverwhelmedStarter,
};

export function getPersonalityDisplayName(personalityType: PersonalityType): string {
  return PERSONALITY_DISPLAY_NAME[personalityType];
}

export function getRemainingChallengeCount(completedCount: number, totalCount: number): number {
  return Math.max(0, totalCount - completedCount);
}

export function getPersonalityFaceIcon(personalityType: PersonalityType): string {
  return PERSONALITY_FACE_ICON[personalityType];
}

export function sortChallengesByPosition(challenges: BingoChallenge[]): BingoChallenge[] {
  return [...challenges].sort((left, right) => left.position - right.position);
}

export function isChallengeCompleted(challengeId: string, completed: string[]): boolean {
  return completed.includes(challengeId);
}

export function isCentreChallenge(challenge: BingoChallenge): boolean {
  return challenge.position === BINGO_CENTRE_POSITION;
}

export function getBingoTaskCompletedIcon(): string {
  return BINGO_TASK_ICON.check;
}

/** Default placeholder for incomplete tasks without a mapped icon. */
export function getBingoTaskPendingIcon(): string {
  return BINGO_TASK_ICON.calendar;
}

/** Maps challenge titles to task icons; falls back to the calendar placeholder. */
export function getBingoTaskPendingIconForChallenge(challenge: BingoChallenge): string {
  const title = challenge.title.toLowerCase();

  if (title.includes("separate account") || title.includes("savings goal")) {
    return BINGO_TASK_ICON.piggyBank;
  }

  if (title.includes("share") || title.includes("goal-link")) {
    return BINGO_TASK_ICON.speechBubble;
  }

  if (title.includes("impulse") || title.includes("reach")) {
    return BINGO_TASK_ICON.lightbulb;
  }

  return getBingoTaskPendingIcon();
}

/** All eight possible 3-in-a-row lines on the 3×3 board (positions 0–8). */
export const BINGO_WIN_LINES: readonly BingoLine[] = [
  { id: "row0", kind: "row", index: 0, positions: [0, 1, 2] },
  { id: "row1", kind: "row", index: 1, positions: [3, 4, 5] },
  { id: "row2", kind: "row", index: 2, positions: [6, 7, 8] },
  { id: "col0", kind: "col", index: 0, positions: [0, 3, 6] },
  { id: "col1", kind: "col", index: 1, positions: [1, 4, 7] },
  { id: "col2", kind: "col", index: 2, positions: [2, 5, 8] },
  { id: "diag0", kind: "diag", index: 0, positions: [0, 4, 8] },
  { id: "diag1", kind: "diag", index: 1, positions: [2, 4, 6] },
] as const;

function getChallengeIdAtPosition(
  position: number,
  challenges: BingoChallenge[],
): string | undefined {
  return challenges.find((challenge) => challenge.position === position)?.challengeId;
}

export function isLineComplete(
  line: BingoLine,
  completed: string[],
  challenges: BingoChallenge[],
): boolean {
  return line.positions.every((position) => {
    const challengeId = getChallengeIdAtPosition(position, challenges);
    return challengeId !== undefined && completed.includes(challengeId);
  });
}

export function getCompletedLines(completed: string[], challenges: BingoChallenge[]): BingoLine[] {
  return BINGO_WIN_LINES.filter((line) => isLineComplete(line, completed, challenges));
}

/** Lines that became complete when moving from previous to next completed set. */
export function detectNewlyCompletedLines(
  previousCompleted: string[],
  nextCompleted: string[],
  challenges: BingoChallenge[],
): BingoLine[] {
  return BINGO_WIN_LINES.filter(
    (line) =>
      isLineComplete(line, nextCompleted, challenges) &&
      !isLineComplete(line, previousCompleted, challenges),
  );
}
