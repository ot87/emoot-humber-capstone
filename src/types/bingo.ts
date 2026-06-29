import type { PersonalityType } from "@/types/quiz";

export type BingoChallenge = {
  id: string;
  position: number;
  title: string;
  whatToDo: string;
  whyItMatters: string;
};

export type ChallengeStatus = "NOT_STARTED" | "COMPLETED";

/** No SKIP member: skipping the Board Complete prompt writes no feedback at all. */
export type FeedbackVote = "UP" | "DOWN";

export type BingoBoard = {
  userId: string;
  personalityType: PersonalityType;
  challengeStatuses: Record<string, ChallengeStatus>;
  celebratedLines: string[];
  feedbackSubmitted: boolean;
  completedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
