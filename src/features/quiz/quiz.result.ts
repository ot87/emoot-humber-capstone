import iconFreeSpirit from "@/assets/icon-personality-free-spirit.svg";
import iconOverwhelmedStarter from "@/assets/icon-personality-overwhelmed-starter.svg";
import iconPlanner from "@/assets/icon-personality-planner.svg";
import iconWorrier from "@/assets/icon-personality-worrier.svg";
import type { PersonalityType, QuizCompletionResult, SavedQuizResult } from "@/types/quiz";

export type PersonalityResultContent = {
  title: string;
  description: string;
  surfaceClass: string;
  iconSrc: string;
};

/**
 * Presentation seam for quiz result screens. Copy and theme per personality —
 * reconcile with KAN-17 when it closes.
 */
export const PERSONALITY_RESULT_CONTENT: Record<PersonalityType, PersonalityResultContent> = {
  PLANNER: {
    title: "THE PLANNER",
    description: "You save better with advanced goal-tracking and streak rewards.",
    surfaceClass: "bg-quiz-result-planner",
    iconSrc: iconPlanner,
  },
  WORRIER: {
    title: "THE WORRIER",
    description: "You save better with comforting nudges and stress-reducing insights.",
    surfaceClass: "bg-quiz-result-worrier",
    iconSrc: iconWorrier,
  },
  FREE_SPIRIT: {
    title: "THE FREE SPIRIT",
    description: "You save better with emotion support, fun challenges, and social engagement.",
    surfaceClass: "bg-quiz-result-free-spirit",
    iconSrc: iconFreeSpirit,
  },
  OVERWHELMED_STARTER: {
    title: "THE OVERWHELMED\nSTARTER",
    description: "You save better with micro-steps, simple plans, and supportive guidance.",
    surfaceClass: "bg-quiz-result-overwhelmed-starter",
    iconSrc: iconOverwhelmedStarter,
  },
};

export function getPersonalityResultContent(
  personalityType: PersonalityType,
): PersonalityResultContent {
  return PERSONALITY_RESULT_CONTENT[personalityType];
}

export function toQuizCompletionResult(saved: SavedQuizResult): QuizCompletionResult {
  return {
    personalityType: saved.personalityType,
    answers: saved.answers,
  };
}
