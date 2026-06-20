import { Navigate, useLocation } from "react-router-dom";
import { QuizResultScreen } from "@/features/quiz/components/QuizResultScreen";
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
    Object.values(candidate.answers).every((optionId) => typeof optionId === "string")
  );
}

export default function ResultPage() {
  const location = useLocation();
  const result = isQuizCompletionResult(location.state) ? location.state : null;

  if (!result) {
    return <Navigate to="/quiz" replace />;
  }

  return <QuizResultScreen personalityType={result.personalityType} />;
}
