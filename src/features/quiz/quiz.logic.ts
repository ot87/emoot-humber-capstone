import type { PersonalityType, QuizAnswersMap } from "@/types/quiz";

/**
 * One-to-one option → type mapping from the quiz seed.
 * Reconcile with KAN-18 when the seed lands.
 */
export const OPTION_PERSONALITY_TYPE: Record<string, PersonalityType> = {
  a: "planner",
  b: "worrier",
  c: "free-spirit",
  d: "overwhelmed-starter",
};

const FIRST_QUESTION_ID = "q1";
const FIRST_QUESTION_WEIGHT = 2;
const DEFAULT_QUESTION_WEIGHT = 1;

function personalityTypeForOption(optionId: string): PersonalityType {
  const personalityType = OPTION_PERSONALITY_TYPE[optionId];
  if (!personalityType) {
    throw new Error(`Unknown quiz option id: ${optionId}`);
  }
  return personalityType;
}

function weightForQuestion(questionId: string): number {
  return questionId === FIRST_QUESTION_ID ? FIRST_QUESTION_WEIGHT : DEFAULT_QUESTION_WEIGHT;
}

export function scoreQuiz(answers: QuizAnswersMap): PersonalityType {
  const weightedCounts = new Map<PersonalityType, number>();

  for (const [questionId, optionId] of Object.entries(answers)) {
    const personalityType = personalityTypeForOption(optionId);
    const weight = weightForQuestion(questionId);
    weightedCounts.set(
      personalityType,
      (weightedCounts.get(personalityType) ?? 0) + weight,
    );
  }

  const q1OptionId = answers[FIRST_QUESTION_ID];
  if (!q1OptionId) {
    throw new Error("Missing answer for question 1");
  }

  const tieBreakerType = personalityTypeForOption(q1OptionId);
  let winningType = tieBreakerType;
  let highestScore = -1;

  for (const [personalityType, score] of weightedCounts) {
    if (score > highestScore) {
      highestScore = score;
      winningType = personalityType;
    }
  }

  const typesAtHighestScore = [...weightedCounts.entries()]
    .filter(([, score]) => score === highestScore)
    .map(([personalityType]) => personalityType);

  if (typesAtHighestScore.length > 1) {
    return tieBreakerType;
  }

  return winningType;
}
