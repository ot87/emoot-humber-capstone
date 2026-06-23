import type { PersonalityType, Question, QuizAnswersMap } from "@/types/quiz";

export type QuizFlowItem = {
  heading: string;
  question: Question;
};

export function toQuizFlowItems(questions: Question[]): QuizFlowItem[] {
  return questions.map((question, index) => ({
    heading: `Q${index + 1}`,
    question,
  }));
}

const FIRST_QUESTION_ID = "q1";
const FIRST_QUESTION_WEIGHT = 2;
const DEFAULT_QUESTION_WEIGHT = 1;

function buildOptionLookup(questions: Question[]): Map<string, PersonalityType> {
  const lookup = new Map<string, PersonalityType>();

  for (const question of questions) {
    for (const option of question.options) {
      lookup.set(option.id, option.personalityType);
    }
  }

  return lookup;
}

function personalityTypeForOption(
  optionLookup: Map<string, PersonalityType>,
  optionId: string,
): PersonalityType {
  const personalityType = optionLookup.get(optionId);
  if (!personalityType) {
    throw new Error(`Unknown quiz option id: ${optionId}`);
  }
  return personalityType;
}

function weightForQuestion(questionId: string): number {
  return questionId === FIRST_QUESTION_ID ? FIRST_QUESTION_WEIGHT : DEFAULT_QUESTION_WEIGHT;
}

export function scoreQuiz(questions: Question[], answers: QuizAnswersMap): PersonalityType {
  const optionLookup = buildOptionLookup(questions);
  const weightedCounts = new Map<PersonalityType, number>();

  for (const [questionId, optionId] of Object.entries(answers)) {
    const personalityType = personalityTypeForOption(optionLookup, optionId);
    const weight = weightForQuestion(questionId);
    weightedCounts.set(personalityType, (weightedCounts.get(personalityType) ?? 0) + weight);
  }

  const q1OptionId = answers[FIRST_QUESTION_ID];
  if (!q1OptionId) {
    throw new Error("Missing answer for question 1");
  }

  const tieBreakerType = personalityTypeForOption(optionLookup, q1OptionId);
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
