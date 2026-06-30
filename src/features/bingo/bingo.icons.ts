import iconBingoCalendar from "@/assets/icon-bingo-calendar.svg";
import iconBingoCheck from "@/assets/icon-bingo-check.svg";
import iconBingoLightbulb from "@/assets/icon-bingo-lightbulb.svg";
import iconBingoPiggyBank from "@/assets/icon-bingo-piggy-bank.svg";
import iconBingoSpeechBubble from "@/assets/icon-bingo-speech-bubble.svg";
import iconBingoTrophy from "@/assets/icon-bingo-trophy.svg";
import type { BingoChallenge } from "@/types/bingo";

/** Task tile icons — per-challenge mapping can replace the pending fallback later. */
export const BINGO_TASK_ICON = {
  calendar: iconBingoCalendar,
  check: iconBingoCheck,
  lightbulb: iconBingoLightbulb,
  piggyBank: iconBingoPiggyBank,
  speechBubble: iconBingoSpeechBubble,
  trophy: iconBingoTrophy,
} as const;

export function getBingoTaskCompletedIcon(): string {
  return BINGO_TASK_ICON.check;
}

/** Default placeholder for incomplete tasks without a mapped icon. */
export function getBingoTaskPendingIcon(): string {
  return BINGO_TASK_ICON.calendar;
}

/**
 * Maps challenge titles to task icons; falls back to the calendar placeholder.
 * Title substring matching is interim — position/seed-driven mapping is future work (KAN-33 data).
 */
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
