import { PERSONALITY_TYPES, type PersonalityType, type QuizCompletionResult } from "@/types/quiz";

export type PendingQuizCompletion = QuizCompletionResult & {
  quizId: string;
};

export type QuizResultRouteState = QuizCompletionResult & {
  quizId?: string;
  needsDeferredSave?: boolean;
  saveError?: string;
};

export type AuthLocationState = {
  from?: string;
  pendingQuizCompletion?: PendingQuizCompletion;
};

function isPersonalityType(value: unknown): value is PersonalityType {
  return PERSONALITY_TYPES.some((type) => type === value);
}

export function isQuizCompletionResult(value: unknown): value is QuizCompletionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as QuizCompletionResult;
  return (
    isPersonalityType(candidate.personalityType) &&
    typeof candidate.answers === "object" &&
    candidate.answers !== null &&
    Object.keys(candidate.answers).every((key) => typeof key === "string") &&
    Object.values(candidate.answers).every((optionId) => typeof optionId === "string")
  );
}

export function parsePendingQuizCompletion(value: unknown): PendingQuizCompletion | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as PendingQuizCompletion;
  if (!isQuizCompletionResult(candidate)) {
    return null;
  }

  if (typeof candidate.quizId !== "string" || candidate.quizId.length === 0) {
    return null;
  }

  return {
    personalityType: candidate.personalityType,
    answers: candidate.answers,
    quizId: candidate.quizId,
  };
}

export function parseQuizResultRouteState(state: unknown): QuizResultRouteState | null {
  if (!isQuizCompletionResult(state)) {
    return null;
  }

  const candidate = state as QuizResultRouteState;
  const quizId = typeof candidate.quizId === "string" ? candidate.quizId : undefined;
  const needsDeferredSave = candidate.needsDeferredSave === true;
  const saveError = typeof candidate.saveError === "string" ? candidate.saveError : undefined;

  return {
    personalityType: candidate.personalityType,
    answers: candidate.answers,
    ...(quizId !== undefined ? { quizId } : {}),
    ...(needsDeferredSave ? { needsDeferredSave: true } : {}),
    ...(saveError !== undefined ? { saveError } : {}),
  };
}

export function buildAuthLocationState(
  completion: QuizCompletionResult,
  needsDeferredSave: boolean,
  quizId: string | undefined,
): AuthLocationState {
  const authState: AuthLocationState = { from: "/bingo" };

  if (!needsDeferredSave || quizId === undefined) {
    return authState;
  }

  return {
    ...authState,
    pendingQuizCompletion: {
      personalityType: completion.personalityType,
      answers: completion.answers,
      quizId,
    },
  };
}

export function parseAuthLocationState(state: unknown): AuthLocationState {
  if (!state || typeof state !== "object") {
    return { from: "/bingo" };
  }

  const candidate = state as AuthLocationState;
  const from = typeof candidate.from === "string" ? candidate.from : "/bingo";
  const pendingQuizCompletion = parsePendingQuizCompletion(candidate.pendingQuizCompletion);

  return pendingQuizCompletion ? { from, pendingQuizCompletion } : { from };
}
