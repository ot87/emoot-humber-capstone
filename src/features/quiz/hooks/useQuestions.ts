import { useEffect, useState } from "react";
import { getQuestions } from "@/services/quiz.service";
import { toQuizFlowItems, type QuizFlowItem } from "@/features/quiz/quiz.questions";

export type UseQuestionsState = {
  questions: QuizFlowItem[];
  loading: boolean;
  error: string;
};

export function useQuestions(quizId?: string): UseQuestionsState {
  const [questions, setQuestions] = useState<QuizFlowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const fetched = await getQuestions(quizId);
        if (!cancelled) {
          setQuestions(toQuizFlowItems(fetched));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setQuestions([]);
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

  return { questions, loading, error };
}
