import { FirebaseError } from "firebase/app";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PERSONALITY_TYPES, type PersonalityType, type SavedQuizResult } from "@/types/quiz";

const USER_QUIZ_RESULTS_COLLECTION = "userQuizResults";

function isPersonalityType(value: string): value is PersonalityType {
  return (PERSONALITY_TYPES as readonly string[]).includes(value);
}

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
}

function parseAnswers(value: unknown): SavedQuizResult["answers"] | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const answers: SavedQuizResult["answers"] = {};

  for (const [questionId, optionId] of Object.entries(value)) {
    if (typeof optionId !== "string") {
      return null;
    }
    answers[questionId] = optionId;
  }

  return answers;
}

function parseSavedQuizResult(data: unknown, uid: string): SavedQuizResult | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const personalityType = record.personalityType;
  const quizId = record.quizId;
  const answers = parseAnswers(record.answers);

  if (typeof personalityType !== "string" || !isPersonalityType(personalityType)) {
    return null;
  }
  if (typeof quizId !== "string") {
    return null;
  }
  if (!answers) {
    return null;
  }

  return {
    userId: typeof record.userId === "string" ? record.userId : uid,
    quizId,
    personalityType,
    answers,
    completedAt: toDate(record.completedAt),
    updatedAt: toDate(record.updatedAt),
  };
}

export async function getSavedQuizResult(uid: string): Promise<SavedQuizResult | null> {
  try {
    const snapshot = await getDoc(doc(db, USER_QUIZ_RESULTS_COLLECTION, uid));

    if (!snapshot.exists()) {
      return null;
    }

    return parseSavedQuizResult(snapshot.data(), uid);
  } catch (err) {
    if (err instanceof FirebaseError && err.code === "permission-denied") {
      return null;
    }
    throw err;
  }
}
