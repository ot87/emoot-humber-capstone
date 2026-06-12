type QuizProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
  percent: number;
};

export function QuizProgressBar({
  currentQuestion,
  totalQuestions,
  percent,
}: QuizProgressBarProps) {
  const value = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className="mx-auto w-full max-w-[430px] shrink-0 px-4 pt-4 pb-6 sm:px-6 sm:pb-8 lg:max-w-lg lg:px-8 xl:max-w-xl">
      <div
        role="progressbar"
        aria-valuenow={currentQuestion}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-valuetext={`${currentQuestion} of ${totalQuestions}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-quiz-brand transition-[width] duration-300 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-2 text-center font-quiz-body text-sm text-quiz-footer">
        {currentQuestion} of {totalQuestions}
      </p>
    </div>
  );
}
