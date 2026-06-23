import { useNavigate } from "react-router-dom";
import { QuizLandingScreen } from "./components/QuizLandingScreen";
import { QuizQuestionsFlow } from "./components/QuizQuestionsFlow";
import { useQuestions } from "./hooks/useQuestions";
import { useQuiz } from "./hooks/useQuiz";

export default function QuizPage() {
  const navigate = useNavigate();
  const { questions, loading, error } = useQuestions();
  const quiz = useQuiz(questions);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <p className="text-center font-quiz-body text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const handleNext = (): void => {
    if (!quiz.canGoNext) {
      return;
    }

    if (quiz.isLastQuestion) {
      const result = quiz.complete();
      if (result) {
        navigate("/result", { state: result });
      }
      return;
    }

    quiz.goNext();
  };

  if (quiz.step === "questions" && quiz.currentItem) {
    return (
      <QuizQuestionsFlow
        item={quiz.currentItem}
        currentQuestionNumber={quiz.currentIndex + 1}
        totalQuestions={quiz.totalQuestions}
        progressPercent={quiz.progressPercent}
        selectedOptionId={quiz.selectedOptionId}
        canGoBack={quiz.canGoBack}
        canGoNext={quiz.canGoNext}
        isLastQuestion={quiz.isLastQuestion}
        onSelect={quiz.selectOption}
        onBack={quiz.goBack}
        onNext={handleNext}
      />
    );
  }

  return <QuizLandingScreen loading={loading} itemCount={questions.length} onStart={quiz.start} />;
}
