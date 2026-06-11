import { useState } from "react";
import { QuizLandingScreen } from "./components/QuizLandingScreen";
import { QuizQuestion } from "./components/QuizQuestion";
import { previewQuestion } from "./quiz.data";

type QuizStep = "landing" | "questions";

export default function QuizPage() {
  const [step, setStep] = useState<QuizStep>("landing");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  if (step === "questions") {
    return (
      <main className="flex min-h-dvh flex-col bg-background pt-10 pb-8 sm:pt-12 sm:pb-10">
        <QuizQuestion
          question={previewQuestion}
          heading="Q1. Saving Style"
          selectedOptionId={selectedOptionId}
          onSelect={setSelectedOptionId}
        />
      </main>
    );
  }

  return <QuizLandingScreen onStart={() => setStep("questions")} />;
}
