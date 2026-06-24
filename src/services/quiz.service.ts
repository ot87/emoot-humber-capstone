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
import {
  PERSONALITY_TYPES,
  type LoadedQuiz,
  type PersonalityType,
  type Question,
  type QuizAnswersMap,
  type QuizResultDefinition,
  type SavedQuizResult,
} from "@/types/quiz";

type FirestoreQuizOption = {
  optionId: string;
  label: string;
  personalityType: PersonalityType;
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
  answers: QuizAnswersMap;
  completedAt?: FirestoreTimestamp | null;
  updatedAt?: FirestoreTimestamp | null;
};

const QUIZZES_COLLECTION = "quizzes";
const PERSONALITY_TYPES_COLLECTION = "personalityTypes";
const USER_RESULTS_COLLECTION = "userQuizResults";

function isPersonalityType(value: unknown): value is PersonalityType {
  return PERSONALITY_TYPES.some((type) => type === value);
}

function toDate(value?: Timestamp | null): Date | null {
  return value ? value.toDate() : null;
}

function mapSavedResult(data: FirestoreSavedQuizResult): SavedQuizResult {
  return {
    userId: data.userId,
    quizId: data.quizId,
    personalityType: data.personalityType,
    answers: data.answers,
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

export async function getQuestions(quizId?: string): Promise<LoadedQuiz> {
  const resolvedQuizId = await resolveQuizId(quizId);
  if (!resolvedQuizId) {
    return { quizId: null, questions: [] };
  }

  const quizRef = doc(db, QUIZZES_COLLECTION, resolvedQuizId);
  const quizSnapshot = await getDoc(quizRef);
  if (!quizSnapshot.exists()) {
    return { quizId: null, questions: [] };
  }

  const questionsQuery = query(
    collection(db, QUIZZES_COLLECTION, resolvedQuizId, "questions"),
    orderBy("displayOrder", "asc"),
  );
  const questionsSnapshot = await getDocs(questionsQuery);

  return {
    quizId: resolvedQuizId,
    questions: questionsSnapshot.docs.map((questionDoc) => {
      const data = questionDoc.data() as FirestoreQuizQuestion;
      return {
        id: data.questionId,
        text: data.text,
        options: data.options.map((option) => ({
          id: option.optionId,
          text: option.label,
          personalityType: option.personalityType,
        })),
      };
    }),
  };
}

export async function saveQuizResult(
  uid: string,
  quizId: string,
  answers: QuizAnswersMap,
  personalityType: PersonalityType,
  completedAt: Date,
): Promise<SavedQuizResult> {
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

export async function getSavedQuizResult(uid: string): Promise<SavedQuizResult | null> {
  const resultRef = doc(db, USER_RESULTS_COLLECTION, uid);
  const snapshot = await getDoc(resultRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapSavedResult(snapshot.data() as FirestoreSavedQuizResult);
}

export async function getResultDefinitions(): Promise<QuizResultDefinition[]> {
  const definitionsSnapshot = await getDocs(collection(db, PERSONALITY_TYPES_COLLECTION));

  return definitionsSnapshot.docs.flatMap((definitionDoc) => {
    const data = definitionDoc.data() as FirestoreResultDefinition;
    const personalityType = data.personalityType ?? definitionDoc.id;

    if (!isPersonalityType(personalityType)) {
      return [];
    }

    return [
      {
        personalityType,
        displayName: data.displayName,
        description: data.description,
      },
    ];
  });
}
