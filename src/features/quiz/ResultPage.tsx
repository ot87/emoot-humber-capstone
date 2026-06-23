import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuizResultScreen } from "@/features/quiz/components/QuizResultScreen";
import { useQuizResult } from "@/features/quiz/hooks/useQuizResult";
import { toQuizCompletionResult } from "@/features/quiz/quiz.result";
import { PERSONALITY_TYPES, type PersonalityType, type QuizCompletionResult } from "@/types/quiz";

function isPersonalityType(value: unknown): value is PersonalityType {
  return PERSONALITY_TYPES.some((type) => type === value);
}

function isQuizCompletionResult(value: unknown): value is QuizCompletionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as QuizCompletionResult;
  return (
    isPersonalityType(candidate.personalityType) &&
    typeof candidate.answers === "object" &&
    candidate.answers !== null &&
    Object.keys(candidate.answers).every((k) => typeof k === "string") &&
    Object.values(candidate.answers).every((optionId) => typeof optionId === "string")
  );
}

export default function ResultPage() {
  const location = useLocation();
  const { savedResult, loading, error } = useQuizResult();
  const routeResult = isQuizCompletionResult(location.state) ? location.state : null;

  if (routeResult) {
    return <QuizResultScreen personalityType={routeResult.personalityType} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <p className="text-center font-quiz-body text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (savedResult) {
    const completion = toQuizCompletionResult(savedResult);
    return <QuizResultScreen personalityType={completion.personalityType} />;
  }

  return <Navigate to="/quiz" replace />;
}
