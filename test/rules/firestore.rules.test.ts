import { readFileSync } from "node:fs";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

// Must match the project the emulator is launched with (see the `test:rules`
// script and firebase.json singleProjectMode).
const PROJECT_ID = "emoot-my-savings-goal";

const ALICE = "alice";
const BOB = "bob";

let testEnv: RulesTestEnvironment;

// Seed the publicly/owner-readable content that read-deny tests need, bypassing
// rules. Mirrors the shapes the seed script writes.
async function seedContent(): Promise<void> {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "quizzes", "quiz1"), { quizId: "quiz1", active: true });
    await setDoc(doc(db, "quizzes", "quiz1", "questions", "q1"), { questionId: "q1" });
    await setDoc(doc(db, "personalityTypes", "PLANNER"), { personalityType: "PLANNER" });
    await setDoc(doc(db, "bingoChallenges", "PLANNER"), { personalityType: "PLANNER" });
    await setDoc(doc(db, "feedback", "existing"), { userId: ALICE, helpful: "UP" });
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seedContent();
});

// Gate 1 + 2: per-user documents — owner-only read/write.
describe.each([
  { collection: "userQuizResults", payload: { userId: ALICE, personalityType: "PLANNER" } },
  { collection: "bingoBoards", payload: { userId: ALICE, personalityType: "PLANNER" } },
])("$collection — owner-only", ({ collection, payload }) => {
  it("allows the owner to read and write their own document", async () => {
    const db = testEnv.authenticatedContext(ALICE).firestore();
    await assertSucceeds(setDoc(doc(db, collection, ALICE), payload));
    await assertSucceeds(getDoc(doc(db, collection, ALICE)));
  });

  it("denies a different signed-in user", async () => {
    const db = testEnv.authenticatedContext(BOB).firestore();
    await assertFails(getDoc(doc(db, collection, ALICE)));
    await assertFails(setDoc(doc(db, collection, ALICE), payload));
  });

  it("denies an unauthenticated user", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, collection, ALICE)));
    await assertFails(setDoc(doc(db, collection, ALICE), payload));
  });
});

// Gate 3: feedback — create-only for the submitting user, no client reads.
describe("feedback — create-only, admin-read", () => {
  it("allows a signed-in user to create their own feedback", async () => {
    const db = testEnv.authenticatedContext(ALICE).firestore();
    await assertSucceeds(
      setDoc(doc(db, "feedback", "f1"), {
        userId: ALICE,
        personalityType: "PLANNER",
        helpful: "UP",
      }),
    );
  });

  it("denies creating feedback attributed to another user", async () => {
    const db = testEnv.authenticatedContext(ALICE).firestore();
    await assertFails(setDoc(doc(db, "feedback", "f2"), { userId: BOB, helpful: "UP" }));
  });

  it("denies an unauthenticated user from creating feedback", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(db, "feedback", "f3"), { userId: ALICE, helpful: "UP" }));
  });

  it("denies all client reads", async () => {
    const db = testEnv.authenticatedContext(ALICE).firestore();
    await assertFails(getDoc(doc(db, "feedback", "existing")));
  });
});

// Gate 4: quiz content — public read, no client writes.
describe("quiz content — public read, seed/admin write", () => {
  it("allows an unauthenticated user to read quiz, questions, and personality types", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(db, "quizzes", "quiz1")));
    await assertSucceeds(getDoc(doc(db, "quizzes", "quiz1", "questions", "q1")));
    await assertSucceeds(getDoc(doc(db, "personalityTypes", "PLANNER")));
  });

  it("denies client writes (even when signed in)", async () => {
    const db = testEnv.authenticatedContext(ALICE).firestore();
    await assertFails(setDoc(doc(db, "quizzes", "quiz1"), { active: false }));
    await assertFails(setDoc(doc(db, "quizzes", "quiz1", "questions", "q1"), { questionId: "q1" }));
    await assertFails(setDoc(doc(db, "personalityTypes", "PLANNER"), { displayName: "x" }));
  });
});

// Gate 5: bingoChallenges — read-only to signed-in users, no client writes.
describe("bingoChallenges — signed-in read, seed/admin write", () => {
  it("allows a signed-in user to read", async () => {
    const db = testEnv.authenticatedContext(ALICE).firestore();
    await assertSucceeds(getDoc(doc(db, "bingoChallenges", "PLANNER")));
  });

  it("denies an unauthenticated user from reading", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "bingoChallenges", "PLANNER")));
  });

  it("denies client writes", async () => {
    const db = testEnv.authenticatedContext(ALICE).firestore();
    await assertFails(
      setDoc(doc(db, "bingoChallenges", "PLANNER"), { personalityType: "PLANNER" }),
    );
  });
});
