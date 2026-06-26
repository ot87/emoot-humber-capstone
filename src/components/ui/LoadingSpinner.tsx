import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  className?: string;
};

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 items-center justify-center", className)}>
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"
        aria-label="Loading"
      />
    </div>
  );
}