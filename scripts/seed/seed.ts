import { readFileSync } from "node:fs";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { bingoChallenges } from "./bingo-data";
import { personalityTypes, questions, quiz } from "./quiz-data";
import {
  PERSONALITY_TYPE_KEYS,
  bingoChallengesDocSchema,
  personalityTypeDocSchema,
  quizDocSchema,
  quizQuestionSchema,
} from "./schema";

// -----------------------------------------------------------------------------
// Validate everything BEFORE touching Firestore. A failure here is a content bug,
// not a database problem, so we want it loud and early.
// -----------------------------------------------------------------------------
function validate(): void {
  for (const key of PERSONALITY_TYPE_KEYS) {
    personalityTypeDocSchema.parse(personalityTypes[key]);
  }

  quizDocSchema.parse(quiz);
  questions.forEach((q) => quizQuestionSchema.parse(q));
  if (quiz.questionCount !== questions.length) {
    throw new Error(
      `quiz.questionCount (${quiz.questionCount}) != questions.length (${questions.length})`,
    );
  }

  for (const key of PERSONALITY_TYPE_KEYS) {
    const doc = bingoChallengesDocSchema.parse({
      personalityType: key,
      challenges: bingoChallenges[key],
    });
    const positions = doc.challenges.map((c) => c.position).sort((a, b) => a - b);
    if (positions.join(",") !== "0,1,2,3,4,5,6,7,8") {
      throw new Error(
        `${key}: challenge positions must be exactly 0-8, got ${positions.join(",")}`,
      );
    }
  }

  // Warn (do not block) if FLAG placeholders remain, so the emulator can be
  // seeded with partial content and filled in later.
  const blob = JSON.stringify({ personalityTypes, quiz, questions, bingoChallenges });
  const flags = (blob.match(/FLAG/g) ?? []).length;
  if (flags > 0) {
    console.warn(`Warning: ${flags} FLAG placeholder(s) still present - seeding anyway.`);
  }
}

function resolveProjectId(): string {
  if (process.env.FIREBASE_PROJECT_ID) {
    return process.env.FIREBASE_PROJECT_ID;
  }
  if (process.env.GCLOUD_PROJECT) {
    return process.env.GCLOUD_PROJECT;
  }

  try {
    const rc = JSON.parse(readFileSync(".firebaserc", "utf8")) as {
      projects?: { default?: string };
    };
    if (rc.projects?.default) {
      return rc.projects.default;
    }
  } catch {
    // .firebaserc missing or unparsable - fall through to the error below.
  }
  throw new Error("No project id. Set a default in .firebaserc, or pass FIREBASE_PROJECT_ID.");
}

async function main(): Promise<void> {
  validate();

  const target = process.env.SEED_TARGET ?? "emulator";
  const projectId = resolveProjectId();

  if (target === "emulator") {
    // The Admin SDK routes to the emulator when this env var is set.
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
    }
    initializeApp({ projectId });
    console.log(
      `Seeding EMULATOR at ${process.env.FIRESTORE_EMULATOR_HOST} (project ${projectId})`,
    );
  } else if (target === "prod") {
    if (process.env.SEED_CONFIRM !== "yes") {
      throw new Error("Refusing to seed prod without SEED_CONFIRM=yes");
    }
    // Needs GOOGLE_APPLICATION_CREDENTIALS pointing at a service-account key (kept local, gitignored).
    initializeApp({ credential: applicationDefault(), projectId });
    console.log(`Seeding PROD (project ${projectId})`);
  } else {
    throw new Error(`Unknown SEED_TARGET "${target}" (use "emulator" or "prod")`);
  }

  const db = getFirestore();
  const batch = db.batch();

  // set() overwrites, so re-running converges to exactly what is in this repo.
  for (const key of PERSONALITY_TYPE_KEYS) {
    batch.set(db.collection("personalityTypes").doc(key), personalityTypes[key]);
  }

  const quizRef = db.collection("quizzes").doc(quiz.quizId);
  batch.set(quizRef, quiz);
  for (const q of questions) {
    batch.set(quizRef.collection("questions").doc(q.questionId), q);
  }

  for (const key of PERSONALITY_TYPE_KEYS) {
    batch.set(db.collection("bingoChallenges").doc(key), {
      personalityType: key,
      challenges: bingoChallenges[key],
    });
  }

  await batch.commit();
  console.log(
    `Done: ${PERSONALITY_TYPE_KEYS.length} personality types, 1 quiz, ${questions.length} questions, ${PERSONALITY_TYPE_KEYS.length} bingo boards.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
