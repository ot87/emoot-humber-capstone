import {
  getBingoTaskCompletedIcon,
  getBingoTaskPendingIconForChallenge,
} from "@/features/bingo/bingo.icons";
import { getPersonalityResultTheme } from "@/features/quiz/quiz.result";
import { isCentreChallenge } from "@/features/bingo/bingo.logic";
import { cn } from "@/lib/utils";
import type { BingoChallenge } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

export type BingoTileProps = {
  challenge: BingoChallenge;
  personalityType: PersonalityType;
  isCompleted: boolean;
  onOpenDetail: (challengeId: string) => void;
};

const tileTitleClassName =
  "font-quiz-body text-xs font-medium leading-[15px] tracking-normal text-center";

const taskIconClassName = "size-[30px] shrink-0";

export function BingoTile({
  challenge,
  personalityType,
  isCompleted,
  onOpenDetail,
}: BingoTileProps) {
  const isCentre = isCentreChallenge(challenge);
  const tileState = isCentre ? "centre" : isCompleted ? "completed" : "pending";

  return (
    <button
      type="button"
      data-tile-state={tileState}
      aria-label={`${challenge.title}${isCompleted ? ", completed" : ", not started"}`}
      onClick={() => {
        onOpenDetail(challenge.challengeId);
      }}
      className={cn(
        "relative flex aspect-square w-full min-w-0 flex-col items-center justify-center gap-1 rounded-xl p-1 text-center transition-colors sm:rounded-2xl sm:p-1.5",
        isCentre
          ? "bg-bingo-tile-centre text-bingo-tile-centre-foreground"
          : isCompleted
            ? "bg-bingo-tile-completed text-bingo-tile-completed-foreground"
            : "bg-bingo-tile-pending text-foreground",
      )}
    >
      {isCentre ? (
        <>
          <img
            src={getPersonalityResultTheme(personalityType).iconSrc}
            alt=""
            width={32}
            height={32}
            decoding="async"
            className="size-7 shrink-0 sm:size-8"
            aria-hidden="true"
          />
          <span className={cn("line-clamp-2", tileTitleClassName)}>{challenge.title}</span>
        </>
      ) : isCompleted ? (
        <>
          <img
            src={getBingoTaskCompletedIcon()}
            alt=""
            width={30}
            height={30}
            decoding="async"
            className={taskIconClassName}
            aria-hidden="true"
          />
          <span className={cn("line-clamp-3 px-0.5", tileTitleClassName)}>{challenge.title}</span>
        </>
      ) : (
        <>
          <img
            src={getBingoTaskPendingIconForChallenge(challenge)}
            alt=""
            width={30}
            height={30}
            decoding="async"
            className={taskIconClassName}
            aria-hidden="true"
          />
          <span className={cn("line-clamp-2 px-0.5", tileTitleClassName)}>{challenge.title}</span>
        </>
      )}
    </button>
  );
}
