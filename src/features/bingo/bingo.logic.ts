import type { BingoChallenge } from "@/types/bingo";
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
