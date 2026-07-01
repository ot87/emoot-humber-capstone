import { render, screen } from "@testing-library/react";
import { BINGO_WIN_LINES } from "@/features/bingo/bingo.logic";
import {
  BingoWinCelebrationBottom,
  BingoWinCelebrationTop,
} from "@/features/bingo/components/BingoWinCelebration";
import { BINGO_WIN_COPY, getWinLineHeadline } from "@/features/bingo/bingo.win-copy";

describe("BingoWinCelebrationTop", () => {
  it.each([
    { line: BINGO_WIN_LINES[0], label: "row" },
    { line: BINGO_WIN_LINES[3], label: "column" },
    { line: BINGO_WIN_LINES[6], label: "diagonal" },
  ])("renders $label headline with the personality theme", ({ line }) => {
    const { container } = render(<BingoWinCelebrationTop personalityType="PLANNER" line={line} />);

    expect(screen.getByLabelText("Bingo win congratulations")).toBeInTheDocument();
    expect(screen.getByText(getWinLineHeadline(line))).toBeInTheDocument();
    expect(screen.getByText(BINGO_WIN_COPY.congratulationsSubtitle)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-quiz-result-planner");
  });
});

describe("BingoWinCelebrationBottom", () => {
  it("renders motivational copy with the personality theme", () => {
    const { container } = render(<BingoWinCelebrationBottom personalityType="WORRIER" />);

    expect(screen.getByLabelText("Bingo win motivation")).toBeInTheDocument();
    expect(screen.getByText(BINGO_WIN_COPY.streakTitle)).toBeInTheDocument();
    expect(screen.getByText(BINGO_WIN_COPY.streakSubtitle)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-quiz-result-worrier");
  });
});
