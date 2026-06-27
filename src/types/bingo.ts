import type { PersonalityType } from "@/types/quiz";

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
