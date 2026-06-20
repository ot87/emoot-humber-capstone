import { Timestamp } from "firebase/firestore";
import {
  getQuestions,
  getResultDefinitions,
  getSavedQuizResult,
  saveQuizResult,
} from "./quiz.service";

const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  setDoc: vi.fn(),
  where: vi.fn(),
}));

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual<typeof import("firebase/firestore")>("firebase/firestore");
  return {
    ...actual,
    collection: firestoreMocks.collection,
    doc: firestoreMocks.doc,
    getDoc: firestoreMocks.getDoc,
    getDocs: firestoreMocks.getDocs,
    limit: firestoreMocks.limit,
    orderBy: firestoreMocks.orderBy,
    query: firestoreMocks.query,
    serverTimestamp: firestoreMocks.serverTimestamp,
    setDoc: firestoreMocks.setDoc,
    where: firestoreMocks.where,
  };
});

vi.mock("@/lib/firebase", () => ({
  db: "mock-db",
}));

describe("quiz.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMocks.collection.mockReturnValue("mock-collection-ref");
    firestoreMocks.query.mockReturnValue("mock-query-ref");
    firestoreMocks.limit.mockReturnValue("mock-limit");
    firestoreMocks.where.mockReturnValue("mock-where");
    firestoreMocks.orderBy.mockReturnValue("mock-order");
    firestoreMocks.serverTimestamp.mockReturnValue("mock-server-timestamp");
    firestoreMocks.doc.mockImplementation((_db: unknown, _collectionName: string, id: string) => ({
      id,
    }));
    firestoreMocks.setDoc.mockResolvedValue(undefined);
  });

  it("getQuestions returns ordered quiz questions for a provided quiz id", async () => {
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          data: () => ({
            questionId: "q1",
            text: "Question one",
            options: [{ optionId: "q1a", label: "Option A" }],
          }),
        },
      ],
    });

    await expect(getQuestions("moneyPersonalityQuiz")).resolves.toEqual([
      {
        id: "q1",
        text: "Question one",
        options: [{ id: "q1a", text: "Option A" }],
      },
    ]);
  });

  it("saveQuizResult writes and returns the saved quiz result", async () => {
    const completedAt = Timestamp.fromDate(new Date("2026-01-01T10:00:00.000Z"));
    const updatedAt = Timestamp.fromDate(new Date("2026-01-02T10:00:00.000Z"));

    firestoreMocks.getDoc
      .mockResolvedValueOnce({
        exists: () => false,
        data: () => undefined,
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          quizId: "moneyPersonalityQuiz",
          personalityType: "PLANNER",
          answers: { q1: "q1a" },
          completedAt,
          updatedAt,
        }),
      });

    await expect(
      saveQuizResult(
        "test-uid",
        "moneyPersonalityQuiz",
        { q1: "q1a" },
        "PLANNER",
        new Date("2026-01-01T10:00:00.000Z"),
      ),
    ).resolves.toEqual({
      userId: "test-uid",
      quizId: "moneyPersonalityQuiz",
      personalityType: "PLANNER",
      answers: { q1: "q1a" },
      completedAt: new Date("2026-01-01T10:00:00.000Z"),
      updatedAt: new Date("2026-01-02T10:00:00.000Z"),
    });
    expect(firestoreMocks.setDoc).toHaveBeenCalledTimes(1);
  });

  it("getSavedQuizResult returns mapped result data when a document exists", async () => {
    const completedAt = Timestamp.fromDate(new Date("2026-02-01T08:00:00.000Z"));
    const updatedAt = Timestamp.fromDate(new Date("2026-02-02T08:00:00.000Z"));
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        userId: "test-uid",
        quizId: "moneyPersonalityQuiz",
        personalityType: "WORRIER",
        // Legacy array-shaped answers; service should normalize to map.
        answers: [{ questionId: "q2", optionId: "q2b" }],
        completedAt,
        updatedAt,
      }),
    });

    await expect(getSavedQuizResult("test-uid")).resolves.toEqual({
      userId: "test-uid",
      quizId: "moneyPersonalityQuiz",
      personalityType: "WORRIER",
      answers: { q2: "q2b" },
      completedAt: new Date("2026-02-01T08:00:00.000Z"),
      updatedAt: new Date("2026-02-02T08:00:00.000Z"),
    });
  });

  it("getResultDefinitions returns personality type definitions", async () => {
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          id: "PLANNER",
          data: () => ({
            displayName: "The Planner",
            description: "Planner description",
          }),
        },
      ],
    });

    await expect(getResultDefinitions()).resolves.toEqual([
      {
        personalityType: "PLANNER",
        displayName: "The Planner",
        description: "Planner description",
      },
    ]);
  });
});
