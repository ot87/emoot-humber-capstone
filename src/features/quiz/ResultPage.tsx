import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuizResultScreen } from "@/features/quiz/components/QuizResultScreen";
import {
  LOAD_RESULT_DEFINITIONS_ERROR,
  useResultDefinitions,
} from "@/features/quiz/hooks/useResultDefinitions";
import { useLoadQuizResult } from "@/features/quiz/hooks/useLoadQuizResult";
import { toQuizCompletionResult } from "@/features/quiz/quiz.result";
import {
  PERSONALITY_TYPES,
  type PersonalityType,
  type QuizCompletionResult,
  type QuizResultDefinition,
} from "@/types/quiz";

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

function resolveDefinition(
  personalityType: PersonalityType,
  definitionsByType: Partial<Record<PersonalityType, QuizResultDefinition>>,
): QuizResultDefinition | null {
  return definitionsByType[personalityType] ?? null;
}

function ResultPageError({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <p className="text-center font-quiz-body text-sm text-destructive">{message}</p>
    </div>
  );
}

function ResultScreenWithOptionalBanner({
  definition,
  saveError,
}: {
  definition: QuizResultDefinition;
  saveError: string | null;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {saveError ? (
        <p
          role="alert"
          className="bg-destructive/10 px-4 py-3 text-center font-quiz-body text-sm text-destructive"
        >
          {saveError}
        </p>
      ) : null}
      <QuizResultScreen definition={definition} />
    </div>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const { savedResult, loading: savedLoading, error: savedError } = useLoadQuizResult();
  const {
    definitionsByType,
    loading: definitionsLoading,
    error: definitionsError,
  } = useResultDefinitions();
  const routeResult = isQuizCompletionResult(location.state) ? location.state : null;

  if (routeResult) {
    if (definitionsLoading) {
      return <LoadingSpinner />;
    }

    if (definitionsError) {
      return <ResultPageError message={definitionsError} />;
    }

    const definition = resolveDefinition(routeResult.personalityType, definitionsByType);
    if (!definition) {
      return <ResultPageError message={LOAD_RESULT_DEFINITIONS_ERROR} />;
    }

    return (
      <ResultScreenWithOptionalBanner
        definition={definition}
        saveError={getRouteSaveError(location.state)}
      />
    );
  }

  if (savedLoading || definitionsLoading) {
    return <LoadingSpinner />;
  }

  if (savedError) {
    return <ResultPageError message={savedError} />;
  }

  if (definitionsError) {
    return <ResultPageError message={definitionsError} />;
  }

  if (savedResult) {
    const completion = toQuizCompletionResult(savedResult);
    const definition = resolveDefinition(completion.personalityType, definitionsByType);
    if (!definition) {
      return <ResultPageError message={LOAD_RESULT_DEFINITIONS_ERROR} />;
    }

    return <QuizResultScreen definition={definition} />;
  }

  return <Navigate to="/quiz" replace />;
}
