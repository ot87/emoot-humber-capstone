import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { BINGO_WIN_COPY } from "@/features/bingo/bingo.win-copy";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import { BingoBoardPage } from "@/features/bingo/BingoBoardPage";
import { LOAD_BINGO_BOARD_ERROR } from "@/features/bingo/hooks/useBingoBoard";
import { AuthProvider } from "@/features/auth/AuthProvider";
import * as bingoService from "@/services/bingo.service";
import { getSavedQuizResult } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";
import type { ChallengeStatus } from "@/types/bingo";
import type { SavedQuizResult } from "@/types/quiz";

vi.mock("@/services/quiz.service", () => ({
  getSavedQuizResult: vi.fn(),
}));

vi.mock("@/services/bingo.service", () => ({
  getBoardState: vi.fn(),
  createBoard: vi.fn(),
  getChallenges: vi.fn(),
  updateChallengeStatus: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(signedInUser);
    return () => {};
  }),
}));

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

const savedResult: SavedQuizResult = {
  userId: "test-uid",
  quizId: "money-personality",
  personalityType: "PLANNER",
  answers: { q1: "a" },
  completedAt: null,
  updatedAt: null,
};

const emptyBoard = {
  userId: "test-uid",
  personalityType: "PLANNER" as const,
  challengeStatuses: Object.fromEntries(
    testPlannerBingoChallenges.map((challenge) => [challenge.challengeId, "NOT_STARTED" as const]),
  ),
  celebratedLines: [],
  feedbackSubmitted: false,
  completedAt: null,
  createdAt: null,
  updatedAt: null,
};

function renderBoardPage() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <BingoBoardPage />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("BingoBoardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSavedQuizResult).mockResolvedValue(savedResult);
    vi.mocked(bingoService.getBoardState).mockResolvedValue(emptyBoard);
    vi.mocked(bingoService.getChallenges).mockResolvedValue(testPlannerBingoChallenges);
    vi.mocked(bingoService.createBoard).mockResolvedValue(emptyBoard);

    let challengeStatuses: Record<string, ChallengeStatus> = {
      ...emptyBoard.challengeStatuses,
    };
    vi.mocked(bingoService.updateChallengeStatus).mockImplementation(
      async (_uid, challengeId, status) => {
        challengeStatuses = { ...challengeStatuses, [challengeId]: status };
        return { ...emptyBoard, challengeStatuses };
      },
    );
  });

  it("renders the 3x3 bingo grid for a saved PLANNER result", async () => {
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /the planner/i })).toBeInTheDocument();
    expect(screen.getByText(/your money saving personality/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Bingo progress")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(9);
    expect(
      screen.getByRole("button", { name: /emoot savings goal, not started/i }),
    ).toBeInTheDocument();
  });

  it("shows an empty state when no challenges exist for the personality type", async () => {
    vi.mocked(getSavedQuizResult).mockResolvedValue({
      ...savedResult,
      personalityType: "WORRIER",
    });
    vi.mocked(bingoService.getChallenges).mockResolvedValue([]);

    renderBoardPage();

    expect(
      await screen.findByText(
        /no bingo challenges are available for your personality type right now/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows a user-facing error when the quiz result fails to load", async () => {
    vi.mocked(getSavedQuizResult).mockRejectedValue(new Error("network failure"));

    renderBoardPage();

    await waitFor(() => {
      expect(
        screen.getByText(/could not load your quiz result\. please try again\./i),
      ).toBeInTheDocument();
    });
  });

  it("shows win celebration when a stub toggle completes a line", async () => {
    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();
    expect(screen.getByLabelText("Bingo progress")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /separate account, not started/i }));
    await user.click(screen.getByRole("button", { name: /review subscriptions, not started/i }));
    await user.click(screen.getByRole("button", { name: /automate a bill, not started/i }));

    expect(screen.getByLabelText("Bingo win congratulations")).toBeInTheDocument();
    expect(screen.getByText(BINGO_WIN_COPY.congratulationsTitle)).toBeInTheDocument();
    expect(screen.getByLabelText("Bingo win motivation")).toBeInTheDocument();
    expect(screen.getByText(BINGO_WIN_COPY.streakTitle)).toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo progress")).not.toBeInTheDocument();
  });

  it("shows a user-facing error when the bingo board fails to load", async () => {
    vi.spyOn(bingoService, "getBoardState").mockRejectedValue(new Error("network failure"));

    renderBoardPage();

    const message = await screen.findByText(LOAD_BINGO_BOARD_ERROR);
    expect(message).toHaveClass("text-destructive");
  });
});
