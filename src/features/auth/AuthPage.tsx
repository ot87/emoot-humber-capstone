import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { usePersistPendingQuizResult } from "@/features/quiz/hooks/usePersistPendingQuizResult";
import { parseAuthLocationState } from "@/features/quiz/quiz.route-state";
import { SignInCard } from "./components/SignInCard";
import { useAuth } from "./hooks/useAuth";
import type { AuthUser } from "@/types/user";

type AuthPageSignedInRedirectProps = {
  onComplete: () => Promise<void>;
};

function AuthPageSignedInRedirect({ onComplete }: AuthPageSignedInRedirectProps) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }

    started.current = true;
    void onComplete();
  }, [onComplete]);

  return <LoadingSpinner />;
}

export function AuthPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { persistPending, saveErrorMessage } = usePersistPendingQuizResult();
  const { from, pendingQuizCompletion } = parseAuthLocationState(location.state);
  const redirectTo = from ?? "/bingo";

  const completeAuth = useCallback(
    async (uidOverride?: string) => {
      const outcome = await persistPending(pendingQuizCompletion, uidOverride);

      if (outcome === "failed") {
        navigate(redirectTo, {
          replace: true,
          state: { saveError: saveErrorMessage },
        });
        return;
      }

      navigate(redirectTo, { replace: true });
    },
    [navigate, pendingQuizCompletion, persistPending, redirectTo, saveErrorMessage],
  );

  const handleSignInSuccess = useCallback(
    (signedInUser: AuthUser) => {
      void completeAuth(signedInUser.uid);
    },
    [completeAuth],
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <AuthPageSignedInRedirect onComplete={() => completeAuth(user.uid)} />;
  }

  return <SignInCard onSuccess={handleSignInSuccess} />;
}
