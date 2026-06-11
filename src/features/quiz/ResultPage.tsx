import { Navigate, useLocation } from "react-router-dom";
import type { QuizCompletionResult } from "@/types/quiz";

function isQuizCompletionResult(value: unknown): value is QuizCompletionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as QuizCompletionResult;
  return (
    typeof candidate.personalityType === "string" &&
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
