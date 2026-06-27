import { BingoGridShell } from "@/features/bingo/components/BingoGridShell";
import { BingoTile } from "@/features/bingo/components/BingoTile";
import { isChallengeCompleted, sortChallengesByPosition } from "@/features/bingo/bingo.logic";
import type { BingoChallenge } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

export type BingoGridProps = {
  challenges: BingoChallenge[];
  completed: string[];
  personalityType: PersonalityType;
  onOpenDetail: (challengeId: string) => void;
  className?: string;
};

export function BingoGrid({
  challenges,
  completed,
  personalityType,
  onOpenDetail,
  className,
}: BingoGridProps) {
  const sortedChallenges = sortChallengesByPosition(challenges);

  return (
    <BingoGridShell aria-label="Bingo board" className={className}>
      {sortedChallenges.map((challenge) => (
        <BingoTile
          key={challenge.challengeId}
          challenge={challenge}
          personalityType={personalityType}
          isCompleted={isChallengeCompleted(challenge.challengeId, completed)}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </BingoGridShell>
  );
}
