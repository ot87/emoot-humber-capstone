import { useNavigate } from "react-router-dom";
import { QuizLandingScreen } from "./components/QuizLandingScreen";
import { QuizQuestionsFlow } from "./components/QuizQuestionsFlow";
import { useQuiz } from "./hooks/useQuiz";
import { quizQuestions } from "./quiz.questions";

export default function QuizPage() {
  const navigate = useNavigate();
  const quiz = useQuiz(quizQuestions);

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

  return <QuizLandingScreen onStart={quiz.start} />;
}
