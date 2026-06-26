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
  buildAuthLocationState,
  parseQuizResultRouteState,
  type QuizResultRouteState,
} from "@/features/quiz/quiz.route-state";
import type { PersonalityType, QuizResultDefinition } from "@/types/quiz";

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
  routeResult,
  saveError,
}: {
  definition: QuizResultDefinition;
  routeResult: QuizResultRouteState;
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
      <QuizResultScreen
        definition={definition}
        authLinkState={buildAuthLocationState(
          routeResult,
          routeResult.needsDeferredSave === true,
          routeResult.quizId,
        )}
      />
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
  const routeResult = parseQuizResultRouteState(location.state);

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
        routeResult={routeResult}
        saveError={routeResult.saveError ?? null}
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

    return <QuizResultScreen definition={definition} authLinkState={{ from: "/bingo" }} />;
  }

  return <Navigate to="/quiz" replace />;
}
