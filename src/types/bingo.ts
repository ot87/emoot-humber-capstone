import type { PersonalityType } from "@/types/quiz";

export type ChallengeStatus = "NOT_STARTED" | "COMPLETED";

export type FeedbackVote = "UP" | "DOWN";

/** Persisted board state for a signed-in user. */
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

/** One tile on the 3×3 board — aligned with seed `bingoChallengeSchema`. */
export type BingoChallenge = {
  challengeId: string;
  position: number;
  title: string;
  whatToDo: string;
  whyItMatters: string;
};

/** User progress: set of completed challenge ids. */
export type BingoBoardProgress = {
  completed: string[];
};

export type BingoBoardLoadState = {
  challenges: BingoChallenge[];
  completed: string[];
  loading: boolean;
  error: string;
};

export type UseBingoBoardState = BingoBoardLoadState & {
  personalityType: PersonalityType;
  toggleChallenge: (challengeId: string) => Promise<void>;
};

export type BingoLineKind = "row" | "col" | "diag";

/** Descriptor for one winning 3-in-a-row line on the 3×3 board. */
export type BingoLine = {
  id: string;
  kind: BingoLineKind;
  index: number;
  positions: readonly number[];
};
