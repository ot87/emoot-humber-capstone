import { render, screen } from "@testing-library/react";
import {
  BingoWinCelebrationBottom,
  BingoWinCelebrationTop,
} from "@/features/bingo/components/BingoWinCelebration";
import { BINGO_WIN_COPY } from "@/features/bingo/bingo.win-copy";

describe("BingoWinCelebrationTop", () => {
  it("renders congratulations copy with the personality theme", () => {
    const { container } = render(<BingoWinCelebrationTop personalityType="PLANNER" />);

    expect(screen.getByLabelText("Bingo win congratulations")).toBeInTheDocument();
    expect(screen.getByText(BINGO_WIN_COPY.congratulationsTitle)).toBeInTheDocument();
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
