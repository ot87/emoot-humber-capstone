import type { SavedQuizResult } from "@/types/quiz";

/**
 * Stub until KAN-31 implements Firestore persist/load.
 * Always returns null so bingo entry renders the locked state.
 */
export async function getSavedQuizResult(uid: string): Promise<SavedQuizResult | null> {
  void uid;
  return null;
}
