import { getSavedQuizResult } from "./quiz.service";

describe("getSavedQuizResult", () => {
  it("returns null (stub until KAN-31 implements Firestore load)", async () => {
    await expect(getSavedQuizResult("test-uid")).resolves.toBeNull();
  });
});
