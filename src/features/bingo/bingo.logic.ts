import type { BingoChallenge, BingoLine } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

export const BINGO_CENTRE_POSITION = 4;

const PERSONALITY_DISPLAY_NAME: Record<PersonalityType, string> = {
  PLANNER: "The Planner",
  WORRIER: "The Worrier",
  FREE_SPIRIT: "The Free Spirit",
  OVERWHELMED_STARTER: "The Overwhelmed Starter",
};

export function getPersonalityDisplayName(personalityType: PersonalityType): string {
  return PERSONALITY_DISPLAY_NAME[personalityType];
}

export function getRemainingChallengeCount(completedCount: number, totalCount: number): number {
  return Math.max(0, totalCount - completedCount);
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
