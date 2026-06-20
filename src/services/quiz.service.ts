import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  Timestamp,
  type Timestamp as FirestoreTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  PersonalityType,
  QUIZ_QUESTION,
  QUIZ_ANSWER_MAP,
  QUIZ_RESULT_DEFINITION,
  SAVED_QUIZ_RESULT,
} from "@/types/quiz";

type FirestoreQuizOption = {
  optionId: string;
  label: string;
};

type FirestoreQuizQuestion = {
  questionId: string;
  text: string;
  options: FirestoreQuizOption[];
};

type FirestoreResultDefinition = {
  personalityType?: PersonalityType;
  displayName: string;
  description: string;
};

type FirestoreSavedQuizResult = {
  userId: string;
  quizId: string;
  personalityType: PersonalityType;
  answers: { questionId: string; optionId: string }[] | QUIZ_ANSWER_MAP;
  completedAt?: FirestoreTimestamp | null;
  updatedAt?: FirestoreTimestamp | null;
};

const QUIZZES_COLLECTION = "quizzes";
const PERSONALITY_TYPES_COLLECTION = "personalityTypes";
const USER_RESULTS_COLLECTION = "userQuizResults";

function toDate(value?: Timestamp | null): Date | null {
  return value ? value.toDate() : null;
}

function normalizeAnswersToMap(answers: FirestoreSavedQuizResult["answers"]): QUIZ_ANSWER_MAP {
  if (Array.isArray(answers)) {
    return answers.reduce<QUIZ_ANSWER_MAP>((acc, answer) => {
      if (answer.questionId && answer.optionId) {
        acc[answer.questionId] = answer.optionId;
      }
      return acc;
    }, {});
  }

  return answers;
}

function mapSavedResult(data: FirestoreSavedQuizResult): SAVED_QUIZ_RESULT {
  return {
    userId: data.userId,
    quizId: data.quizId,
    personalityType: data.personalityType,
    answers: normalizeAnswersToMap(data.answers),
    completedAt: toDate(data.completedAt),
    updatedAt: toDate(data.updatedAt),
  };
}

async function resolveQuizId(explicitQuizId?: string): Promise<string | null> {
  if (explicitQuizId) {
    return explicitQuizId;
  }

  const activeQuizQuery = query(
    collection(db, QUIZZES_COLLECTION),
    where("active", "==", true),
    limit(1),
  );
  const activeQuizSnapshot = await getDocs(activeQuizQuery);
  const activeQuizDoc = activeQuizSnapshot.docs[0];

  return activeQuizDoc ? activeQuizDoc.id : null;
}

export async function getQuestions(quizId?: string): Promise<QUIZ_QUESTION[]> {
  const resolvedQuizId = await resolveQuizId(quizId);
  if (!resolvedQuizId) {
    return [];
  }

  const questionsQuery = query(
    collection(db, QUIZZES_COLLECTION, resolvedQuizId, "questions"),
    orderBy("displayOrder", "asc"),
  );
  const questionsSnapshot = await getDocs(questionsQuery);

  return questionsSnapshot.docs.map((questionDoc) => {
    const data = questionDoc.data() as FirestoreQuizQuestion;
    return {
      id: data.questionId,
      text: data.text,
      options: data.options.map((option) => ({
        id: option.optionId,
        text: option.label,
      })),
    };
  });
}

export async function saveQuizResult(
  uid: string,
  quizId: string,
  answers: QUIZ_ANSWER_MAP,
  personalityType: PersonalityType,
  completedAt: Date,
): Promise<SAVED_QUIZ_RESULT> {
  const resultRef = doc(db, USER_RESULTS_COLLECTION, uid);
  const existingSnapshot = await getDoc(resultRef);
  const existingData = existingSnapshot.exists()
    ? (existingSnapshot.data() as FirestoreSavedQuizResult)
    : null;

  const completedAtField = existingData?.completedAt ?? Timestamp.fromDate(completedAt);

  await setDoc(resultRef, {
    userId: uid,
    quizId,
    personalityType,
    answers,
    completedAt: completedAtField,
    updatedAt: serverTimestamp(),
  });

  const saved = await getSavedQuizResult(uid);
  if (saved) {
    return saved;
  }

  return {
    userId: uid,
    quizId,
    personalityType,
    answers,
    completedAt: null,
    updatedAt: null,
  };
}

export async function getSavedQuizResult(uid: string): Promise<SAVED_QUIZ_RESULT | null> {
  const resultRef = doc(db, USER_RESULTS_COLLECTION, uid);
  const snapshot = await getDoc(resultRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapSavedResult(snapshot.data() as FirestoreSavedQuizResult);
}

export async function getResultDefinitions(): Promise<QUIZ_RESULT_DEFINITION[]> {
  const definitionsSnapshot = await getDocs(collection(db, PERSONALITY_TYPES_COLLECTION));

  return definitionsSnapshot.docs.map((definitionDoc) => {
    const data = definitionDoc.data() as FirestoreResultDefinition;
    return {
      personalityType: data.personalityType ?? (definitionDoc.id as PersonalityType),
      displayName: data.displayName,
      description: data.description,
    };
  });
}
