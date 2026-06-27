import { useNavigate } from "react-router-dom";
import { useAnonymousQuizVisitorFooterNav } from "./hooks/useAnonymousQuizVisitorFooterNav";
import { QuizLandingScreen } from "./components/QuizLandingScreen";
import { QuizQuestionsFlow } from "./components/QuizQuestionsFlow";
import { useQuestions } from "./hooks/useQuestions";
import { useQuiz } from "./hooks/useQuiz";
import { SAVE_QUIZ_RESULT_ERROR, useSaveQuizResult } from "./hooks/useSaveQuizResult";

export default function QuizPage() {
  const navigate = useNavigate();
  useAnonymousQuizVisitorFooterNav();
  const { saveCompletion } = useSaveQuizResult();
  const { questions, quizId, loading, error } = useQuestions();
  const quiz = useQuiz(questions);

  if (error) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <p className="text-center font-quiz-body text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const handleNext = async (): Promise<void> => {
    if (!quiz.canGoNext) {
      return;
    }

    if (quiz.isLastQuestion) {
      const result = quiz.complete();
      if (result) {
        const saveOutcome = quizId !== null ? await saveCompletion(result, quizId) : "skipped";
        navigate("/result", {
          state: {
            ...result,
            ...(quizId !== null ? { quizId } : {}),
            ...(saveOutcome === "skipped" && quizId !== null ? { needsDeferredSave: true } : {}),
            ...(saveOutcome === "failed" ? { saveError: SAVE_QUIZ_RESULT_ERROR } : {}),
          },
        });
      }
      return;
    }

    quiz.goNext();
  };

  if (quiz.step === "questions" && quiz.currentItem) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
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
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <QuizLandingScreen loading={loading} itemCount={questions.length} onStart={quiz.start} />
    </div>
  );
}
