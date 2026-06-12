import type { PersonalityType } from "@/types/quiz";

export type PersonalityResultContent = {
  title: string;
  description: string;
  surfaceClass: string;
  iconSrc: string;
};

/** Presentation copy and theme per personality — reconcile with KAN-17 when it closes. */
export const PERSONALITY_RESULT_CONTENT: Record<PersonalityType, PersonalityResultContent> = {
  planner: {
    title: "THE PLANNER",
    description: "You save better with advanced goal-tracking and streak rewards.",
    surfaceClass: "bg-quiz-result-planner",
    iconSrc: "/assets/icon-personality-planner.svg",
  },
  worrier: {
    title: "THE WORRIER",
    description: "You save better with comforting nudges and stress-reducing insights.",
    surfaceClass: "bg-quiz-result-worrier",
    iconSrc: "/assets/icon-personality-worrier.svg",
  },
  "free-spirit": {
    title: "THE FREE SPIRIT",
    description: "You save better with emotion support, fun challenges, and social engagement.",
    surfaceClass: "bg-quiz-result-free-spirit",
    iconSrc: "/assets/icon-personality-free-spirit.svg",
  },
  "overwhelmed-starter": {
    title: "THE OVERWHELMED\nSTARTER",
    description: "You save better with micro-steps, simple plans, and supportive guidance.",
    surfaceClass: "bg-quiz-result-overwhelmed-starter",
    iconSrc: "/assets/icon-personality-overwhelmed-starter.svg",
  },
};

export function getPersonalityResultContent(
  personalityType: PersonalityType,
): PersonalityResultContent {
  return PERSONALITY_RESULT_CONTENT[personalityType];
}
