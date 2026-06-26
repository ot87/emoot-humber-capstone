import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppShellHeaderVisibility } from "@/components/layout/useAppShellHeaderVisibility";
import { QuizLandingScreen } from "./components/QuizLandingScreen";
import { QuizQuestionsFlow } from "./components/QuizQuestionsFlow";
import { useQuestions } from "./hooks/useQuestions";
import { useQuiz } from "./hooks/useQuiz";
import { SAVE_QUIZ_RESULT_ERROR, useSaveQuizResult } from "./hooks/useSaveQuizResult";

export default function QuizPage() {
  const navigate = useNavigate();
  const { setHeaderVisible } = useAppShellHeaderVisibility();
  const { saveCompletion } = useSaveQuizResult();
  const { questions, quizId, loading, error } = useQuestions();
  const quiz = useQuiz(questions);

  useEffect(() => {
    setHeaderVisible(quiz.step === "questions");

    return () => {
      setHeaderVisible(true);
    };
  }, [quiz.step, setHeaderVisible]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
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
