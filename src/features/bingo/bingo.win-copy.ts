import type { BingoLine } from "@/types/bingo";

const WIN_LINE_HEADLINES = {
  row: "3 in a row",
  col: "3 in a column",
  diag: "3 in a diagonal",
} as const;

/** Headline for the completed bingo line shown in the top celebration banner. */
export function getWinLineHeadline(line: BingoLine): string {
  return WIN_LINE_HEADLINES[line.kind];
}

/** Generic motivational copy for the bingo win celebration. */
export const BINGO_WIN_COPY = {
  congratulationsSubtitle: "keep the momentum going and complete the board!",
  streakTitle: "You built a 3-challenge streak!",
  streakSubtitle: "Try completing one more challenge this week to keep your momentum.",
} as const;
