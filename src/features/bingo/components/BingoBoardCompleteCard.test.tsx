import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BINGO_COMPLETE_COPY } from "@/features/bingo/bingo.complete-copy";
import { BingoBoardCompleteCard } from "@/features/bingo/components/BingoBoardCompleteCard";

describe("BingoBoardCompleteCard", () => {
  it("renders the completion message and achievement CTA", () => {
    render(<BingoBoardCompleteCard personalityType="PLANNER" onViewAchievement={vi.fn()} />);

    expect(screen.getByLabelText("Bingo board complete")).toBeInTheDocument();
    expect(screen.getByText(BINGO_COMPLETE_COPY.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BINGO_COMPLETE_COPY.viewAchievementLabel }),
    ).toBeInTheDocument();
  });

  it("calls onViewAchievement when the CTA is clicked", async () => {
    const user = userEvent.setup();
    const onViewAchievement = vi.fn();

    render(
      <BingoBoardCompleteCard personalityType="PLANNER" onViewAchievement={onViewAchievement} />,
    );

    await user.click(
      screen.getByRole("button", { name: BINGO_COMPLETE_COPY.viewAchievementLabel }),
    );

    expect(onViewAchievement).toHaveBeenCalledTimes(1);
  });
});
