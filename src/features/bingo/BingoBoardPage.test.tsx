import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { BINGO_WIN_LINES } from "@/features/bingo/bingo.logic";
import { BINGO_COMPLETE_COPY } from "@/features/bingo/bingo.complete-copy";
import { BINGO_WIN_COPY, getWinLineHeadline } from "@/features/bingo/bingo.win-copy";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import { BingoBoardPage } from "@/features/bingo/BingoBoardPage";
import { LOAD_BINGO_BOARD_ERROR } from "@/features/bingo/hooks/useBingoBoard";
import { AuthProvider } from "@/features/auth/AuthProvider";
import * as bingoService from "@/services/bingo.service";
import { getSavedQuizResult } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";
import type { ChallengeStatus, BingoBoard } from "@/types/bingo";
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

    expect(await screen.findByLabelText("Bingo win congratulations")).toBeInTheDocument();
    expect(screen.getByText(getWinLineHeadline(BINGO_WIN_LINES[0]))).toBeInTheDocument();
    expect(screen.getByLabelText("Bingo win motivation")).toBeInTheDocument();
    expect(screen.getByText(BINGO_WIN_COPY.streakTitle)).toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo progress")).not.toBeInTheDocument();
  });

  it("does not show win celebration until toggle persist succeeds", async () => {
    const user = userEvent.setup();
    const twoOfRowBoard = {
      ...emptyBoard,
      challengeStatuses: {
        ...emptyBoard.challengeStatuses,
        "planner-0": "COMPLETED" as const,
        "planner-1": "COMPLETED" as const,
      },
    };
    vi.mocked(bingoService.getBoardState).mockResolvedValue(twoOfRowBoard);

    let resolveUpdate: ((board: BingoBoard) => void) | undefined;
    vi.mocked(bingoService.updateChallengeStatus).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /automate a bill, not started/i }));

    expect(
      await screen.findByRole("button", { name: /automate a bill, completed/i }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win congratulations")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win motivation")).not.toBeInTheDocument();

    await act(async () => {
      resolveUpdate?.({
        ...twoOfRowBoard,
        challengeStatuses: {
          ...twoOfRowBoard.challengeStatuses,
          "planner-2": "COMPLETED",
        },
      });
    });

    expect(await screen.findByLabelText("Bingo win congratulations")).toBeInTheDocument();
    expect(screen.getByLabelText("Bingo win motivation")).toBeInTheDocument();
  });

  it("does not show win celebration when toggle persist fails after optimistic line completion", async () => {
    const user = userEvent.setup();
    const twoOfRowBoard = {
      ...emptyBoard,
      challengeStatuses: {
        ...emptyBoard.challengeStatuses,
        "planner-0": "COMPLETED" as const,
        "planner-1": "COMPLETED" as const,
      },
    };
    vi.mocked(bingoService.getBoardState).mockResolvedValue(twoOfRowBoard);
    vi.mocked(bingoService.updateChallengeStatus).mockRejectedValue(new Error("network failure"));

    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /automate a bill, not started/i }));

    expect(screen.queryByLabelText("Bingo win congratulations")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win motivation")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(LOAD_BINGO_BOARD_ERROR)).toBeInTheDocument();
    });
    expect(screen.queryByLabelText("Bingo win congratulations")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win motivation")).not.toBeInTheDocument();
  });

  it("updates win celebration to the latest line when a second line completes", async () => {
    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /separate account, not started/i }));
    await user.click(screen.getByRole("button", { name: /review subscriptions, not started/i }));
    await user.click(screen.getByRole("button", { name: /automate a bill, not started/i }));

    expect(await screen.findByText(getWinLineHeadline(BINGO_WIN_LINES[0]))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /last month's expenses, not started/i }));
    await user.click(screen.getByRole("button", { name: /share your goal-link, not started/i }));

    expect(await screen.findByText(getWinLineHeadline(BINGO_WIN_LINES[3]))).toBeInTheDocument();
    expect(screen.queryByText(getWinLineHeadline(BINGO_WIN_LINES[0]))).not.toBeInTheDocument();
  });

  it("dismisses win celebration when a tile in the completed line is un-completed", async () => {
    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /separate account, not started/i }));
    await user.click(screen.getByRole("button", { name: /review subscriptions, not started/i }));
    await user.click(screen.getByRole("button", { name: /automate a bill, not started/i }));

    expect(await screen.findByLabelText("Bingo win congratulations")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /automate a bill, completed/i }));

    expect(screen.queryByLabelText("Bingo win congratulations")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Bingo progress")).toBeInTheDocument();
  });

  it("toggles the centre savings-goal tile", async () => {
    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();

    const centreTile = screen.getByRole("button", { name: /emoot savings goal, not started/i });
    await user.click(centreTile);

    expect(
      await screen.findByRole("button", { name: /emoot savings goal, completed/i }),
    ).toBeInTheDocument();
    expect(bingoService.updateChallengeStatus).toHaveBeenCalledWith(
      "test-uid",
      "planner-4",
      "COMPLETED",
    );

    await user.click(screen.getByRole("button", { name: /emoot savings goal, completed/i }));

    expect(
      await screen.findByRole("button", { name: /emoot savings goal, not started/i }),
    ).toBeInTheDocument();
    expect(bingoService.updateChallengeStatus).toHaveBeenCalledWith(
      "test-uid",
      "planner-4",
      "NOT_STARTED",
    );
  });

  it("shows a user-facing error when the bingo board fails to load", async () => {
    vi.spyOn(bingoService, "getBoardState").mockRejectedValue(new Error("network failure"));

    renderBoardPage();

    const message = await screen.findByText(LOAD_BINGO_BOARD_ERROR);
    expect(message).toHaveClass("text-destructive");
  });

  it("does not show VIEW MY ACHIEVEMENT when 8 of 9 challenges are complete", async () => {
    const eightOfNineBoard = {
      ...emptyBoard,
      challengeStatuses: Object.fromEntries(
        testPlannerBingoChallenges.map((challenge, index) => [
          challenge.challengeId,
          index < 8 ? ("COMPLETED" as const) : ("NOT_STARTED" as const),
        ]),
      ),
    };
    vi.mocked(bingoService.getBoardState).mockResolvedValue(eightOfNineBoard);

    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo board complete")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: BINGO_COMPLETE_COPY.viewAchievementLabel }),
    ).not.toBeInTheDocument();
  });

  it("shows board-complete UI when all challenges are completed", async () => {
    const completedBoard = {
      ...emptyBoard,
      challengeStatuses: Object.fromEntries(
        testPlannerBingoChallenges.map((challenge) => [
          challenge.challengeId,
          "COMPLETED" as const,
        ]),
      ),
    };
    vi.mocked(bingoService.getBoardState).mockResolvedValue(completedBoard);

    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board complete")).toBeInTheDocument();
    expect(screen.getByText(BINGO_COMPLETE_COPY.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BINGO_COMPLETE_COPY.viewAchievementLabel }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo progress")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win congratulations")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win motivation")).not.toBeInTheDocument();
  });

  it("shows board-complete UI only after the ninth challenge is toggled complete", async () => {
    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo board complete")).not.toBeInTheDocument();

    for (const [index, challenge] of testPlannerBingoChallenges.entries()) {
      await user.click(
        screen.getByRole("button", {
          name: new RegExp(`${challenge.title}, not started`, "i"),
        }),
      );

      if (index < testPlannerBingoChallenges.length - 1) {
        expect(screen.queryByLabelText("Bingo board complete")).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: BINGO_COMPLETE_COPY.viewAchievementLabel }),
        ).not.toBeInTheDocument();
      }
    }

    expect(screen.getByLabelText("Bingo board complete")).toBeInTheDocument();
    expect(screen.getByText(BINGO_COMPLETE_COPY.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BINGO_COMPLETE_COPY.viewAchievementLabel }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo progress")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win congratulations")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Bingo win motivation")).not.toBeInTheDocument();
  });

  it("hides board-complete UI when a challenge is un-completed from a full board", async () => {
    const completedBoard = {
      ...emptyBoard,
      challengeStatuses: Object.fromEntries(
        testPlannerBingoChallenges.map((challenge) => [
          challenge.challengeId,
          "COMPLETED" as const,
        ]),
      ),
    };
    vi.mocked(bingoService.getBoardState).mockResolvedValue(completedBoard);

    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board complete")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reach 25% of your goal, completed/i }));

    expect(screen.queryByLabelText("Bingo board complete")).not.toBeInTheDocument();
    const hasProgress = screen.queryByLabelText("Bingo progress") !== null;
    const hasCelebration =
      screen.queryByLabelText("Bingo win congratulations") !== null ||
      screen.queryByLabelText("Bingo win motivation") !== null;
    expect(hasProgress || hasCelebration).toBe(true);
  });

  it("hides board-complete UI and shows progress after un-completing the ninth toggled challenge", async () => {
    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByLabelText("Bingo board")).toBeInTheDocument();

    for (const challenge of testPlannerBingoChallenges) {
      await user.click(
        screen.getByRole("button", {
          name: new RegExp(`${challenge.title}, not started`, "i"),
        }),
      );
    }

    expect(screen.getByLabelText("Bingo board complete")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reach 25% of your goal, completed/i }));

    expect(screen.queryByLabelText("Bingo board complete")).not.toBeInTheDocument();
    const hasProgress = screen.queryByLabelText("Bingo progress") !== null;
    const hasCelebration =
      screen.queryByLabelText("Bingo win congratulations") !== null ||
      screen.queryByLabelText("Bingo win motivation") !== null;
    expect(hasProgress || hasCelebration).toBe(true);
  });
});
