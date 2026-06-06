import { Button } from "@/components/ui/button";

type QuizQuestionsPlaceholderProps = {
  onBack: () => void;
};

export function QuizQuestionsPlaceholder({ onBack }: QuizQuestionsPlaceholderProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <p className="text-lg font-semibold text-foreground sm:text-xl">Question flow</p>
      <p className="max-w-xs text-sm text-muted-foreground sm:max-w-sm md:max-w-md md:text-base">
        Questions arrive in KAN-10/KAN-26. Completion routes to /result in KAN-26.
      </p>
      <Button type="button" variant="link" className="text-muted-foreground" onClick={onBack}>
        Back to landing
      </Button>
    </main>
  );
}
