import { Navigate, useLocation } from "react-router-dom";
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
    Array.isArray(candidate.answers) &&
    candidate.answers.every(
      (answer) => typeof answer.questionId === "string" && typeof answer.optionId === "string",
    )
  );
}

export default function ResultPage() {
  const location = useLocation();
  const result = isQuizCompletionResult(location.state) ? location.state : null;

  if (!result) {
    return <Navigate to="/quiz" replace />;
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-quiz-body text-2xl text-quiz-copy">Your money personality</p>
      <p className="mt-4 font-quiz-body text-[32px] font-bold capitalize text-quiz-copy">
        {result.personalityType.replace("-", " ")}
      </p>
    </main>
  );
}
