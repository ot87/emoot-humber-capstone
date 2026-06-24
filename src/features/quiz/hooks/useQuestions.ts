import { useEffect, useState } from "react";
import { getQuestions } from "@/services/quiz.service";
import { toQuizFlowItems, type QuizFlowItem } from "@/features/quiz/quiz.logic";

export type UseQuestionsState = {
  questions: QuizFlowItem[];
  quizId: string | null;
  loading: boolean;
  error: string;
};

export function useQuestions(quizId?: string): UseQuestionsState {
  const [questions, setQuestions] = useState<QuizFlowItem[]>([]);
  const [resolvedQuizId, setResolvedQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const loaded = await getQuestions(quizId);
        if (!cancelled) {
          setQuestions(toQuizFlowItems(loaded.questions));
          setResolvedQuizId(loaded.quizId);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setQuestions([]);
          setResolvedQuizId(null);
          setError("Could not load quiz questions. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  return { questions, quizId: resolvedQuizId, loading, error };
}
