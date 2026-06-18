import { AppContentShell } from "@/components/layout/AppContentShell";

export function BingoBoardPage() {
  return (
    <AppContentShell className="flex min-h-dvh flex-col justify-center py-8">
      <h1 className="font-quiz-body text-2xl font-bold text-foreground">Bingo board</h1>
      <p className="mt-2 font-quiz-body text-base text-muted-foreground">
        Board UI lands in a follow-up ticket.
      </p>
    </AppContentShell>
  );
}
