import { Timestamp } from "firebase/firestore";
import {
  createBoard,
  getBoardState,
  getChallenges,
  submitFeedback,
  updateChallengeStatus,
} from "./bingo.service";

const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  writeBatch: vi.fn(),
}));

vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual<typeof import("firebase/firestore")>("firebase/firestore");
  return {
    ...actual,
    collection: firestoreMocks.collection,
    doc: firestoreMocks.doc,
    getDoc: firestoreMocks.getDoc,
    serverTimestamp: firestoreMocks.serverTimestamp,
    setDoc: firestoreMocks.setDoc,
    updateDoc: firestoreMocks.updateDoc,
    writeBatch: firestoreMocks.writeBatch,
  };
});

vi.mock("@/lib/firebase", () => ({
  db: "mock-db",
}));

const batchMocks = {
  set: vi.fn(),
  update: vi.fn(),
  commit: vi.fn(),
};

const CHALLENGE_IDS = Array.from({ length: 9 }, (_, i) => `planner-${i}`);

// A full nine-cell status map; ids in notStartedIds are NOT_STARTED, the rest COMPLETED.
function boardStatuses(notStartedIds: string[] = []): Record<string, "COMPLETED" | "NOT_STARTED"> {
  return Object.fromEntries(
    CHALLENGE_IDS.map((id) => [id, notStartedIds.includes(id) ? "NOT_STARTED" : "COMPLETED"]),
  );
}

describe("bingo.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMocks.collection.mockImplementation((_db: unknown, name: string) => ({
      collectionName: name,
    }));
    firestoreMocks.serverTimestamp.mockReturnValue("mock-server-timestamp");
    firestoreMocks.setDoc.mockResolvedValue(undefined);
    firestoreMocks.updateDoc.mockResolvedValue(undefined);
    firestoreMocks.writeBatch.mockReturnValue(batchMocks);
    batchMocks.commit.mockResolvedValue(undefined);
    // doc(db, collection, id) -> a recognizable ref; doc(collectionRef) -> an
    // auto-id feedback ref (the only single-argument call in the service).
    firestoreMocks.doc.mockImplementation(
      (_first: unknown, collectionName?: string, id?: string) => {
        if (collectionName === undefined) {
          return { collectionName: "feedback", id: "feedback-auto-id" };
        }
        return { collectionName, id };
      },
    );
  });

  it("getChallenges returns the type's challenges mapped and ordered by position", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        personalityType: "PLANNER",
        challenges: [
          {
            challengeId: "planner-1",
            position: 1,
            title: "B",
            whatToDo: "do B",
            whyItMatters: "why B",
          },
          {
            challengeId: "planner-0",
            position: 0,
            title: "A",
            whatToDo: "do A",
            whyItMatters: "why A",
          },
        ],
      }),
    });

    await expect(getChallenges("PLANNER")).resolves.toEqual([
      {
        challengeId: "planner-0",
        position: 0,
        title: "A",
        whatToDo: "do A",
        whyItMatters: "why A",
      },
      {
        challengeId: "planner-1",
        position: 1,
        title: "B",
        whatToDo: "do B",
        whyItMatters: "why B",
      },
    ]);
    expect(firestoreMocks.doc).toHaveBeenCalledWith("mock-db", "bingoChallenges", "PLANNER");
  });

  it("getChallenges returns an empty array when the type has no challenges document", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => false,
      data: () => undefined,
    });

    await expect(getChallenges("PLANNER")).resolves.toEqual([]);
  });

  it("getBoardState returns the mapped board with timestamps as Dates", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        userId: "test-uid",
        personalityType: "WORRIER",
        challengeStatuses: { "worrier-0": "COMPLETED", "worrier-1": "NOT_STARTED" },
        celebratedLines: ["row0"],
        feedbackSubmitted: false,
        completedAt: null,
        createdAt: Timestamp.fromDate(new Date("2026-02-01T00:00:00.000Z")),
        updatedAt: Timestamp.fromDate(new Date("2026-03-02T00:00:00.000Z")),
      }),
    });

    await expect(getBoardState("test-uid")).resolves.toEqual({
      userId: "test-uid",
      personalityType: "WORRIER",
      challengeStatuses: { "worrier-0": "COMPLETED", "worrier-1": "NOT_STARTED" },
      celebratedLines: ["row0"],
      feedbackSubmitted: false,
      completedAt: null,
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-03-02T00:00:00.000Z"),
    });
    expect(firestoreMocks.doc).toHaveBeenCalledWith("mock-db", "bingoBoards", "test-uid");
  });

  it("getBoardState returns null when the user has no board", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => false,
      data: () => undefined,
    });

    await expect(getBoardState("test-uid")).resolves.toBeNull();
  });

  it("createBoard seeds every challenge as NOT_STARTED and returns the new board", async () => {
    firestoreMocks.getDoc
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          personalityType: "PLANNER",
          challenges: [
            {
              challengeId: "planner-0",
              position: 0,
              title: "A",
              whatToDo: "do A",
              whyItMatters: "why A",
            },
            {
              challengeId: "planner-1",
              position: 1,
              title: "B",
              whatToDo: "do B",
              whyItMatters: "why B",
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          personalityType: "PLANNER",
          challengeStatuses: { "planner-0": "NOT_STARTED", "planner-1": "NOT_STARTED" },
          celebratedLines: [],
          feedbackSubmitted: false,
          completedAt: null,
          createdAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
          updatedAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
        }),
      });

    await expect(createBoard("test-uid", "PLANNER")).resolves.toEqual({
      userId: "test-uid",
      personalityType: "PLANNER",
      challengeStatuses: { "planner-0": "NOT_STARTED", "planner-1": "NOT_STARTED" },
      celebratedLines: [],
      feedbackSubmitted: false,
      completedAt: null,
      createdAt: new Date("2026-04-01T00:00:00.000Z"),
      updatedAt: new Date("2026-04-01T00:00:00.000Z"),
    });

    expect(firestoreMocks.setDoc).toHaveBeenCalledWith(
      { collectionName: "bingoBoards", id: "test-uid" },
      {
        userId: "test-uid",
        personalityType: "PLANNER",
        challengeStatuses: { "planner-0": "NOT_STARTED", "planner-1": "NOT_STARTED" },
        celebratedLines: [],
        feedbackSubmitted: false,
        completedAt: null,
        createdAt: "mock-server-timestamp",
        updatedAt: "mock-server-timestamp",
      },
    );
  });

  it("updateChallengeStatus writes one challenge field and returns the re-read board", async () => {
    firestoreMocks.getDoc
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          personalityType: "PLANNER",
          challengeStatuses: { "planner-0": "NOT_STARTED", "planner-1": "NOT_STARTED" },
          celebratedLines: [],
          feedbackSubmitted: false,
          completedAt: null,
          createdAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
          updatedAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          personalityType: "PLANNER",
          challengeStatuses: { "planner-0": "COMPLETED", "planner-1": "NOT_STARTED" },
          celebratedLines: [],
          feedbackSubmitted: false,
          completedAt: null,
          createdAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
          updatedAt: Timestamp.fromDate(new Date("2026-04-02T00:00:00.000Z")),
        }),
      });

    const result = await updateChallengeStatus("test-uid", "planner-0", "COMPLETED");

    expect(firestoreMocks.updateDoc).toHaveBeenCalledWith(
      { collectionName: "bingoBoards", id: "test-uid" },
      {
        "challengeStatuses.planner-0": "COMPLETED",
        updatedAt: "mock-server-timestamp",
      },
    );
    expect(result.challengeStatuses).toEqual({
      "planner-0": "COMPLETED",
      "planner-1": "NOT_STARTED",
    });
  });

  it("updateChallengeStatus sets completedAt when the toggle completes the board", async () => {
    firestoreMocks.getDoc
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          personalityType: "PLANNER",
          challengeStatuses: boardStatuses(["planner-8"]),
          celebratedLines: [],
          feedbackSubmitted: false,
          completedAt: null,
          createdAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
          updatedAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          personalityType: "PLANNER",
          challengeStatuses: boardStatuses(),
          celebratedLines: [],
          feedbackSubmitted: false,
          completedAt: Timestamp.fromDate(new Date("2026-04-03T00:00:00.000Z")),
          createdAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
          updatedAt: Timestamp.fromDate(new Date("2026-04-03T00:00:00.000Z")),
        }),
      });

    const result = await updateChallengeStatus("test-uid", "planner-8", "COMPLETED");

    expect(result.completedAt).toEqual(new Date("2026-04-03T00:00:00.000Z"));
    expect(firestoreMocks.updateDoc).toHaveBeenCalledWith(
      { collectionName: "bingoBoards", id: "test-uid" },
      {
        "challengeStatuses.planner-8": "COMPLETED",
        updatedAt: "mock-server-timestamp",
        completedAt: "mock-server-timestamp",
      },
    );
  });

  it("updateChallengeStatus keeps completedAt sticky when un-completing a finished board", async () => {
    firestoreMocks.getDoc
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          personalityType: "PLANNER",
          challengeStatuses: { "planner-0": "COMPLETED", "planner-1": "COMPLETED" },
          celebratedLines: [],
          feedbackSubmitted: false,
          completedAt: Timestamp.fromDate(new Date("2026-04-03T00:00:00.000Z")),
          createdAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
          updatedAt: Timestamp.fromDate(new Date("2026-04-03T00:00:00.000Z")),
        }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({
          userId: "test-uid",
          personalityType: "PLANNER",
          challengeStatuses: { "planner-0": "COMPLETED", "planner-1": "NOT_STARTED" },
          celebratedLines: [],
          feedbackSubmitted: false,
          completedAt: Timestamp.fromDate(new Date("2026-04-03T00:00:00.000Z")),
          createdAt: Timestamp.fromDate(new Date("2026-04-01T00:00:00.000Z")),
          updatedAt: Timestamp.fromDate(new Date("2026-04-04T00:00:00.000Z")),
        }),
      });

    const result = await updateChallengeStatus("test-uid", "planner-1", "NOT_STARTED");

    expect(result.completedAt).toEqual(new Date("2026-04-03T00:00:00.000Z"));
    expect(firestoreMocks.updateDoc).toHaveBeenCalledWith(
      { collectionName: "bingoBoards", id: "test-uid" },
      {
        "challengeStatuses.planner-1": "NOT_STARTED",
        updatedAt: "mock-server-timestamp",
      },
    );
  });

  it("updateChallengeStatus throws when the user has no board", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => false,
      data: () => undefined,
    });

    await expect(updateChallengeStatus("test-uid", "planner-0", "COMPLETED")).rejects.toThrow(
      "No bingo board found for user test-uid",
    );
    expect(firestoreMocks.updateDoc).not.toHaveBeenCalled();
  });

  it("submitFeedback batches the feedback create and the board flag flip", async () => {
    await submitFeedback("test-uid", "WORRIER", "UP");

    expect(firestoreMocks.collection).toHaveBeenCalledWith("mock-db", "feedback");
    expect(batchMocks.set).toHaveBeenCalledWith(
      { collectionName: "feedback", id: "feedback-auto-id" },
      {
        userId: "test-uid",
        personalityType: "WORRIER",
        helpful: "UP",
        comment: null,
        createdAt: "mock-server-timestamp",
      },
    );
    expect(batchMocks.update).toHaveBeenCalledWith(
      { collectionName: "bingoBoards", id: "test-uid" },
      { feedbackSubmitted: true, updatedAt: "mock-server-timestamp" },
    );
    expect(batchMocks.commit).toHaveBeenCalledTimes(1);
  });
});
