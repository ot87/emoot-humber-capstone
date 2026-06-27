import {
  getBingoTaskCompletedIcon,
  getBingoTaskPendingIcon,
  getPersonalityFaceIcon,
  isCentreChallenge,
} from "@/features/bingo/bingo.logic";
import { cn } from "@/lib/utils";
import type { BingoChallenge } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

export type BingoTileProps = {
  challenge: BingoChallenge;
  personalityType: PersonalityType;
  isCompleted: boolean;
  onOpenDetail: (challengeId: string) => void;
};

export function BingoTile({
  challenge,
  personalityType,
  isCompleted,
  onOpenDetail,
}: BingoTileProps) {
  const isCentre = isCentreChallenge(challenge);

  return (
    <button
      type="button"
      aria-label={`${challenge.title}${isCompleted ? ", completed" : ", not started"}`}
      onClick={() => {
        onOpenDetail(challenge.challengeId);
      }}
      className={cn(
        "relative flex aspect-square w-full min-w-0 flex-col items-center justify-center rounded-xl p-1 text-center transition-colors sm:rounded-2xl sm:p-2",
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
            src={getPersonalityFaceIcon(personalityType)}
            alt=""
            width={32}
            height={32}
            decoding="async"
            className="size-7 shrink-0 sm:size-8"
            aria-hidden="true"
          />
          <span className="mt-1 line-clamp-2 font-quiz-body text-[10px] font-bold leading-tight tracking-[-0.2px] sm:text-xs">
            {challenge.title}
          </span>
        </>
      ) : (
        <>
          <img
            src={isCompleted ? getBingoTaskCompletedIcon() : getBingoTaskPendingIcon()}
            alt=""
            width={28}
            height={28}
            decoding="async"
            className="size-6 shrink-0 sm:size-7"
            aria-hidden="true"
          />
          <span className="mt-1 line-clamp-2 px-0.5 font-quiz-body text-[10px] font-normal leading-tight tracking-[-0.2px] sm:text-xs sm:leading-snug">
            {challenge.title}
          </span>
        </>
      )}
    </button>
  );
}
