import iconFreeSpirit from "@/assets/icon-personality-free-spirit.svg";
import iconOverwhelmedStarter from "@/assets/icon-personality-overwhelmed-starter.svg";
import iconPlanner from "@/assets/icon-personality-planner.svg";
import iconWorrier from "@/assets/icon-personality-worrier.svg";
import type { PersonalityType, QuizCompletionResult, SavedQuizResult } from "@/types/quiz";

export type PersonalityResultTheme = {
  surfaceClass: string;
  iconSrc: string;
};

const PERSONALITY_RESULT_THEMES: Record<PersonalityType, PersonalityResultTheme> = {
  PLANNER: {
    surfaceClass: "bg-quiz-result-planner",
    iconSrc: iconPlanner,
  },
  WORRIER: {
    surfaceClass: "bg-quiz-result-worrier",
    iconSrc: iconWorrier,
  },
  FREE_SPIRIT: {
    surfaceClass: "bg-quiz-result-free-spirit",
    iconSrc: iconFreeSpirit,
  },
  OVERWHELMED_STARTER: {
    surfaceClass: "bg-quiz-result-overwhelmed-starter",
    iconSrc: iconOverwhelmedStarter,
  },
};

export function getPersonalityResultTheme(
  personalityType: PersonalityType,
): PersonalityResultTheme {
  return PERSONALITY_RESULT_THEMES[personalityType];
}

export function toQuizCompletionResult(saved: SavedQuizResult): QuizCompletionResult {
  return {
    personalityType: saved.personalityType,
    answers: saved.answers,
  };
}
