import { useCallback, useEffect, useState } from "react";
import {
  testBingoChallengesByType,
  testCompletedEmpty,
} from "@/features/bingo/bingo.test-fixtures";
import type { UseBingoBoardState } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

export const LOAD_BINGO_BOARD_ERROR = "Could not load your bingo board. Please try again.";

type StubBoardData = {
  challenges: UseBingoBoardState["challenges"];
  completed: string[];
};

/** Stub loader — replaced by bingo.service when KAN-33/KAN-38 land. */
async function loadStubBoard(personalityType: PersonalityType): Promise<StubBoardData> {
  const challenges =
    personalityType in testBingoChallengesByType
      ? testBingoChallengesByType[personalityType as keyof typeof testBingoChallengesByType]
      : [];

  if (challenges.length === 0) {
    return { challenges: [], completed: testCompletedEmpty };
  }

  return { challenges, completed: testCompletedEmpty };
}

export function useBingoBoard(personalityType: PersonalityType): UseBingoBoardState {
  const [challenges, setChallenges] = useState<UseBingoBoardState["challenges"]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBoard(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const board = await loadStubBoard(personalityType);
        if (!cancelled) {
          setChallenges(board.challenges);
          setCompleted(board.completed);
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setChallenges([]);
          setCompleted([]);
          setError(LOAD_BINGO_BOARD_ERROR);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBoard();

    return () => {
      cancelled = true;
    };
  }, [personalityType]);

  const toggleChallenge = useCallback(async (challengeId: string): Promise<void> => {
    setCompleted((current) =>
      current.includes(challengeId)
        ? current.filter((id) => id !== challengeId)
        : [...current, challengeId],
    );
  }, []);

  return {
    personalityType,
    challenges,
    completed,
    loading,
    error,
    toggleChallenge,
  };
}
