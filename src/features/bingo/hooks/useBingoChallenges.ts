import { useEffect, useState } from "react";

import type { BingoChallenge } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";
import { getChallenges } from "@/services/bingo.service";

export const LOAD_BINGO_CHALLENGES_ERROR =
  "Could not load your bingo challenges. Please try again.";

export type UseBingoChallengesState = {
  challenges: BingoChallenge[];
  loading: boolean;
  error: string;
};

export function useBingoChallenges(personalityType: PersonalityType): UseBingoChallengesState {
  const [challenges, setChallenges] = useState<BingoChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadChallenges(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const loaded = await getChallenges(personalityType);
        if (!cancelled) {
          setChallenges(loaded);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setChallenges([]);
          setError(LOAD_BINGO_CHALLENGES_ERROR);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadChallenges();

    return () => {
      cancelled = true;
    };
  }, [personalityType]);

  return { challenges, loading, error };
}
