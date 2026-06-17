import { FirebaseError } from "firebase/app";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { getSavedQuizResult } from "./quiz.service";

vi.mock("@/lib/firebase", () => ({
  db: {},
}));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    doc: vi.fn(() => "docRef"),
    getDoc: vi.fn(),
  };
});

describe("getSavedQuizResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when the document does not exist", async () => {
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => false,
    } as never);

    await expect(getSavedQuizResult("test-uid")).resolves.toBeNull();
    expect(doc).toHaveBeenCalledWith({}, "userQuizResults", "test-uid");
  });

  it("returns a parsed saved result when the document exists", async () => {
    const completedAt = new Date("2024-06-01T12:00:00.000Z");

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({
        userId: "test-uid",
        quizId: "money-personality",
        personalityType: "PLANNER",
        answers: { q1: "a" },
        completedAt: Timestamp.fromDate(completedAt),
        updatedAt: null,
      }),
    } as never);

    await expect(getSavedQuizResult("test-uid")).resolves.toEqual({
      userId: "test-uid",
      quizId: "money-personality",
      personalityType: "PLANNER",
      answers: { q1: "a" },
      completedAt,
      updatedAt: null,
    });
  });

  it("returns null on permission-denied so locked entry can render without deployed rules", async () => {
    vi.mocked(getDoc).mockRejectedValue(
      new FirebaseError("permission-denied", "Missing or insufficient permissions."),
    );

    await expect(getSavedQuizResult("test-uid")).resolves.toBeNull();
  });

  it("rethrows unexpected Firestore errors", async () => {
    vi.mocked(getDoc).mockRejectedValue(new Error("network failure"));

    await expect(getSavedQuizResult("test-uid")).rejects.toThrow("network failure");
  });
});
