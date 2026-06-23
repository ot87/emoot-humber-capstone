import { Timestamp } from "firebase/firestore";
import {
  getActiveQuizId,
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
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        quizId: "moneyPersonalityQuiz",
        title: "Money Personality Quiz",
        version: 1,
        active: true,
        questionCount: 5,
      }),
    });
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          data: () => ({
            questionId: "q1",
            text: "Question one",
            options: [{ optionId: "q1a", label: "Option A", personalityType: "PLANNER" }],
          }),
        },
      ],
    });

    await expect(getQuestions("moneyPersonalityQuiz")).resolves.toEqual([
      {
        id: "q1",
        text: "Question one",
        options: [{ id: "q1a", text: "Option A", personalityType: "PLANNER" }],
      },
    ]);

    expect(firestoreMocks.collection).toHaveBeenCalledWith(
      "mock-db",
      "quizzes",
      "moneyPersonalityQuiz",
      "questions",
    );
    expect(firestoreMocks.doc).toHaveBeenCalledWith("mock-db", "quizzes", "moneyPersonalityQuiz");
    expect(firestoreMocks.getDoc).toHaveBeenCalledWith({ id: "moneyPersonalityQuiz" });
    expect(firestoreMocks.query).toHaveBeenCalledWith("mock-collection-ref", "mock-order");
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith("mock-query-ref");
    expect(firestoreMocks.where).not.toHaveBeenCalled();
    expect(firestoreMocks.limit).not.toHaveBeenCalled();
    expect(firestoreMocks.getDoc).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.getDocs).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.orderBy).toHaveBeenCalledWith("displayOrder", "asc");
  });

  it("getActiveQuizId returns the active quiz document id", async () => {
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [{ id: "active-quiz-id" }],
    });

    await expect(getActiveQuizId()).resolves.toBe("active-quiz-id");

    expect(firestoreMocks.collection).toHaveBeenCalledWith("mock-db", "quizzes");
    expect(firestoreMocks.query).toHaveBeenCalledWith(
      "mock-collection-ref",
      "mock-where",
      "mock-limit",
    );
    expect(firestoreMocks.where).toHaveBeenCalledWith("active", "==", true);
    expect(firestoreMocks.limit).toHaveBeenCalledWith(1);
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith("mock-query-ref");
  });

  it("getQuestions without quizId resolves the active quiz and loads its questions", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        quizId: "active-quiz-id",
        title: "Active Quiz",
        version: 1,
        active: true,
        questionCount: 5,
      }),
    });
    firestoreMocks.getDocs
      .mockResolvedValueOnce({
        docs: [{ id: "active-quiz-id" }],
      })
      .mockResolvedValueOnce({
        docs: [
          {
            data: () => ({
              questionId: "q1",
              text: "Question one",
              options: [{ optionId: "q1a", label: "Option A", personalityType: "PLANNER" }],
            }),
          },
        ],
      });

    await expect(getQuestions()).resolves.toEqual([
      {
        id: "q1",
        text: "Question one",
        options: [{ id: "q1a", text: "Option A", personalityType: "PLANNER" }],
      },
    ]);

    expect(firestoreMocks.collection).toHaveBeenCalledWith("mock-db", "quizzes");
    expect(firestoreMocks.collection).toHaveBeenCalledWith(
      "mock-db",
      "quizzes",
      "active-quiz-id",
      "questions",
    );
    expect(firestoreMocks.doc).toHaveBeenCalledWith("mock-db", "quizzes", "active-quiz-id");
    expect(firestoreMocks.getDoc).toHaveBeenCalledWith({ id: "active-quiz-id" });
    expect(firestoreMocks.query).toHaveBeenCalledWith(
      "mock-collection-ref",
      "mock-where",
      "mock-limit",
    );
    expect(firestoreMocks.query).toHaveBeenCalledWith("mock-collection-ref", "mock-order");
    expect(firestoreMocks.where).toHaveBeenCalledWith("active", "==", true);
    expect(firestoreMocks.limit).toHaveBeenCalledWith(1);
    expect(firestoreMocks.getDoc).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.getDocs).toHaveBeenCalledTimes(2);
    expect(firestoreMocks.orderBy).toHaveBeenCalledWith("displayOrder", "asc");
  });

  it("getQuestions without quizId returns empty array when no active quiz exists", async () => {
    firestoreMocks.getDocs.mockResolvedValueOnce({
      docs: [],
    });

    await expect(getQuestions()).resolves.toEqual([]);

    expect(firestoreMocks.collection).toHaveBeenCalledWith("mock-db", "quizzes");
    expect(firestoreMocks.query).toHaveBeenCalledWith(
      "mock-collection-ref",
      "mock-where",
      "mock-limit",
    );
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith("mock-query-ref");
    expect(firestoreMocks.where).toHaveBeenCalledWith("active", "==", true);
    expect(firestoreMocks.limit).toHaveBeenCalledWith(1);
    expect(firestoreMocks.getDoc).not.toHaveBeenCalled();
    expect(firestoreMocks.getDocs).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.orderBy).not.toHaveBeenCalled();
  });

  it("getQuestions returns empty array when quiz parent doc is missing", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => false,
      data: () => undefined,
    });

    await expect(getQuestions("missing-quiz-id")).resolves.toEqual([]);

    expect(firestoreMocks.doc).toHaveBeenCalledWith("mock-db", "quizzes", "missing-quiz-id");
    expect(firestoreMocks.getDoc).toHaveBeenCalledWith({ id: "missing-quiz-id" });
    expect(firestoreMocks.collection).not.toHaveBeenCalled();
    expect(firestoreMocks.getDoc).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.getDocs).not.toHaveBeenCalled();
    expect(firestoreMocks.orderBy).not.toHaveBeenCalled();
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

    expect(firestoreMocks.doc).toHaveBeenCalledWith("mock-db", "userQuizResults", "test-uid");
    expect(firestoreMocks.getDoc).toHaveBeenCalledWith({ id: "test-uid" });
    expect(firestoreMocks.getDoc).toHaveBeenCalledTimes(2);
    expect(firestoreMocks.setDoc).toHaveBeenCalledWith(
      { id: "test-uid" },
      {
        userId: "test-uid",
        quizId: "moneyPersonalityQuiz",
        answers: { q1: "q1a" },
        personalityType: "PLANNER",
        completedAt: Timestamp.fromDate(new Date("2026-01-01T10:00:00.000Z")),
        updatedAt: "mock-server-timestamp",
      },
    );
    expect(firestoreMocks.setDoc).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.serverTimestamp).toHaveBeenCalledTimes(1);
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
        answers: { q2: "q2b" },
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

    expect(firestoreMocks.doc).toHaveBeenCalledWith("mock-db", "userQuizResults", "test-uid");
    expect(firestoreMocks.getDoc).toHaveBeenCalledWith({ id: "test-uid" });
    expect(firestoreMocks.getDoc).toHaveBeenCalledTimes(1);
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

    expect(firestoreMocks.collection).toHaveBeenCalledWith("mock-db", "personalityTypes");
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith("mock-collection-ref");
    expect(firestoreMocks.getDocs).toHaveBeenCalledTimes(1);
  });

  it("getResultDefinitions skips documents with an invalid personality type", async () => {
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          id: "PLANNER",
          data: () => ({
            displayName: "The Planner",
            description: "Planner description",
          }),
        },
        {
          id: "UNKNOWN_TYPE",
          data: () => ({
            displayName: "Invalid",
            description: "Should be skipped",
          }),
        },
        {
          id: "WORRIER",
          data: () => ({
            personalityType: "NOT_A_TYPE",
            displayName: "Bad field",
            description: "Should be skipped",
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
