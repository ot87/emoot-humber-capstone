import { useEffect, useMemo, useState } from "react";
import { getResultDefinitions } from "@/services/quiz.service";
import type { PersonalityType, QuizResultDefinition } from "@/types/quiz";

export const LOAD_RESULT_DEFINITIONS_ERROR =
  "Could not load personality results. Please try again.";

export type UseResultDefinitionsState = {
  definitionsByType: Partial<Record<PersonalityType, QuizResultDefinition>>;
  loading: boolean;
  error: string;
};

export function useResultDefinitions(): UseResultDefinitionsState {
  const [definitions, setDefinitions] = useState<QuizResultDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDefinitions(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const loaded = await getResultDefinitions();
        if (!cancelled) {
          setDefinitions(loaded);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setDefinitions([]);
          setError(LOAD_RESULT_DEFINITIONS_ERROR);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDefinitions();

    return () => {
      cancelled = true;
    };
  }, []);

  const definitionsByType = useMemo(
    () =>
      Object.fromEntries(definitions.map((definition) => [definition.personalityType, definition])),
    [definitions],
  ) as Partial<Record<PersonalityType, QuizResultDefinition>>;

  return { definitionsByType, loading, error };
}
