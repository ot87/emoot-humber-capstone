import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { usePersistPendingQuizResult } from "@/features/quiz/hooks/usePersistPendingQuizResult";
import { parseAuthLocationState } from "@/features/quiz/quiz.route-state";
import { SignInCard } from "./components/SignInCard";
import { useAuth } from "./hooks/useAuth";

export function AuthPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { persistPending, saveErrorMessage } = usePersistPendingQuizResult();
  const { from, pendingQuizCompletion } = parseAuthLocationState(location.state);
  const persistStartedRef = useRef(false);

  useEffect(() => {
    if (!user || persistStartedRef.current) {
      return;
    }

    persistStartedRef.current = true;

    void (async () => {
      const outcome = await persistPending(pendingQuizCompletion);

      if (outcome === "failed") {
        navigate(from, {
          replace: true,
          state: { saveError: saveErrorMessage },
        });
        return;
      }

      navigate(from, { replace: true });
    })();
  }, [user, from, pendingQuizCompletion, persistPending, navigate, saveErrorMessage]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <LoadingSpinner />;
  }

  return <SignInCard />;
}
