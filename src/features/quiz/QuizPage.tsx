import { useState } from "react";
import { QuizLandingScreen } from "./components/QuizLandingScreen";
import { QuizQuestionsPlaceholder } from "./components/QuizQuestionsPlaceholder";

type QuizStep = "landing" | "questions";

export default function QuizPage() {
  const [step, setStep] = useState<QuizStep>("landing");

  if (step === "questions") {
    return <QuizQuestionsPlaceholder onBack={() => setStep("landing")} />;
  }

  return <QuizLandingScreen onStart={() => setStep("questions")} />;
}
