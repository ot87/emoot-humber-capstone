import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type Timestamp as FirestoreTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import type { BingoBoard, BingoChallenge, ChallengeStatus, FeedbackVote } from "@/types/bingo";
import type { PersonalityType } from "@/types/quiz";

type FirestoreBingoChallenge = {
  challengeId: string;
  position: number;
  title: string;
  whatToDo: string;
  whyItMatters: string;
};

type FirestoreBingoChallengesDoc = {
  personalityType: PersonalityType;
  challenges: FirestoreBingoChallenge[];
};

type FirestoreBingoBoard = {
  userId: string;
  personalityType: PersonalityType;
  challengeStatuses: Record<string, ChallengeStatus>;
  celebratedLines: string[];
  feedbackSubmitted: boolean;
  completedAt?: FirestoreTimestamp | null;
  createdAt?: FirestoreTimestamp | null;
  updatedAt?: FirestoreTimestamp | null;
};

type FirestoreFeedback = {
  userId: string;
  personalityType: PersonalityType;
  helpful: FeedbackVote;
  comment: string | null;
};

const BINGO_CHALLENGES_COLLECTION = "bingoChallenges";
const BINGO_BOARDS_COLLECTION = "bingoBoards";
const FEEDBACK_COLLECTION = "feedback";

/** A full board is a 3x3 grid: completion requires exactly this many statuses. */
const BINGO_CHALLENGE_COUNT = 9;

function toDate(value?: FirestoreTimestamp | null): Date | null {
  return value ? value.toDate() : null;
}

function mapBoard(data: FirestoreBingoBoard): BingoBoard {
  return {
    userId: data.userId,
    personalityType: data.personalityType,
    challengeStatuses: data.challengeStatuses,
    celebratedLines: data.celebratedLines,
    feedbackSubmitted: data.feedbackSubmitted,
    completedAt: toDate(data.completedAt),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function getChallenges(personalityType: PersonalityType): Promise<BingoChallenge[]> {
  const challengesRef = doc(db, BINGO_CHALLENGES_COLLECTION, personalityType);
  const snapshot = await getDoc(challengesRef);
  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.data() as FirestoreBingoChallengesDoc;
  return [...data.challenges]
    .sort((a, b) => a.position - b.position)
    .map((challenge) => ({
      challengeId: challenge.challengeId,
      position: challenge.position,
      title: challenge.title,
      whatToDo: challenge.whatToDo,
      whyItMatters: challenge.whyItMatters,
    }));
}

export async function getBoardState(uid: string): Promise<BingoBoard | null> {
  const boardRef = doc(db, BINGO_BOARDS_COLLECTION, uid);
  const snapshot = await getDoc(boardRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapBoard(snapshot.data() as FirestoreBingoBoard);
}

/**
 * Call only when getBoardState returned null: this writes unconditionally, and
 * the board is immutable on retake, so invoking it for an existing board would
 * overwrite their progress.
 */
export async function createBoard(
  uid: string,
  personalityType: PersonalityType,
): Promise<BingoBoard> {
  const challenges = await getChallenges(personalityType);
  const challengeStatuses: Record<string, ChallengeStatus> = {};

  for (const challenge of challenges) {
    challengeStatuses[challenge.challengeId] = "NOT_STARTED";
  }

  const boardRef = doc(db, BINGO_BOARDS_COLLECTION, uid);
  await setDoc(boardRef, {
    userId: uid,
    personalityType,
    challengeStatuses,
    celebratedLines: [],
    feedbackSubmitted: false,
    completedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const created = await getBoardState(uid);
  if (!created) {
    throw new Error(`Bingo board for user ${uid} vanished after creation`);
  }
  return created;
}

/**
 * completedAt is sticky: set the first time all nine are COMPLETED and never
 * cleared, so "is the board complete now" is derived from the statuses, not from
 * this field.
 */
export async function updateChallengeStatus(
  uid: string,
  challengeId: string,
  status: ChallengeStatus,
): Promise<BingoBoard> {
  const existing = await getBoardState(uid);
  if (!existing) {
    throw new Error(`No bingo board found for user ${uid}`);
  }

  const nextStatuses: Record<string, ChallengeStatus> = {
    ...existing.challengeStatuses,
    [challengeId]: status,
  };
  const statusValues = Object.values(nextStatuses);
  const allCompleted =
    statusValues.length === BINGO_CHALLENGE_COUNT &&
    statusValues.every((value) => value === "COMPLETED");

  const updates: Record<string, unknown> = {
    [`challengeStatuses.${challengeId}`]: status,
    updatedAt: serverTimestamp(),
  };
  if (allCompleted && existing.completedAt === null) {
    updates.completedAt = serverTimestamp();
  }

  const boardRef = doc(db, BINGO_BOARDS_COLLECTION, uid);
  await updateDoc(boardRef, updates);

  const updated = await getBoardState(uid);
  if (!updated) {
    throw new Error(`Bingo board for user ${uid} vanished after update`);
  }

  return updated;
}

/**
 * Feedback is create-only per the security rules, so the vote is a new auto-id
 * document, never an update. Batched with the board flag so both land together.
 */
export async function submitFeedback(
  uid: string,
  personalityType: PersonalityType,
  helpful: FeedbackVote,
): Promise<void> {
  const batch = writeBatch(db);

  const feedbackRef = doc(collection(db, FEEDBACK_COLLECTION));
  const feedback: FirestoreFeedback = {
    userId: uid,
    personalityType,
    helpful,
    comment: null,
  };
  batch.set(feedbackRef, { ...feedback, createdAt: serverTimestamp() });

  const boardRef = doc(db, BINGO_BOARDS_COLLECTION, uid);
  batch.update(boardRef, {
    feedbackSubmitted: true,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}
