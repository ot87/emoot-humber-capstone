import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuizResultScreen } from "@/features/quiz/components/QuizResultScreen";
import { useLoadQuizResult } from "@/features/quiz/hooks/useLoadQuizResult";
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

function getRouteSaveError(state: unknown): string | null {
  if (!state || typeof state !== "object" || !("saveError" in state)) {
    return null;
  }

  const saveError = (state as { saveError: unknown }).saveError;
  return typeof saveError === "string" ? saveError : null;
}

export default function ResultPage() {
  const location = useLocation();
  const { savedResult, loading, error } = useLoadQuizResult();
  const routeResult = isQuizCompletionResult(location.state) ? location.state : null;

  if (routeResult) {
    const saveError = getRouteSaveError(location.state);

    return (
      <div className="flex min-h-dvh flex-col">
        {saveError ? (
          <p
            role="alert"
            className="bg-destructive/10 px-4 py-3 text-center font-quiz-body text-sm text-destructive"
          >
            {saveError}
          </p>
        ) : null}
        <QuizResultScreen personalityType={routeResult.personalityType} />
      </div>
    );
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
