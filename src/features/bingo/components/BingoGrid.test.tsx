import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BingoGrid } from "@/features/bingo/components/BingoGrid";
import {
  testCompletedPartial,
  testPlannerBingoChallenges,
} from "@/features/bingo/bingo.test-fixtures";

describe("BingoGrid", () => {
  it("renders a 3x3 grid with nine challenge tiles", () => {
    render(
      <BingoGrid
        challenges={testPlannerBingoChallenges}
        completed={testCompletedPartial}
        personalityType="PLANNER"
        onOpenDetail={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Bingo board")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("shows the savings-goal centre tile with the personality face label", () => {
    render(
      <BingoGrid
        challenges={testPlannerBingoChallenges}
        completed={[]}
        personalityType="PLANNER"
        onOpenDetail={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /emoot savings goal, not started/i }),
    ).toBeInTheDocument();
  });

  it("reflects completed and not-started tile states", () => {
    render(
      <BingoGrid
        challenges={testPlannerBingoChallenges}
        completed={testCompletedPartial}
        personalityType="PLANNER"
        onOpenDetail={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /separate account, completed/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /review subscriptions, not started/i }),
    ).toBeInTheDocument();
  });

  it("invokes onOpenDetail when a tile is clicked", async () => {
    const user = userEvent.setup();
    const onOpenDetail = vi.fn();

    render(
      <BingoGrid
        challenges={testPlannerBingoChallenges}
        completed={[]}
        personalityType="PLANNER"
        onOpenDetail={onOpenDetail}
      />,
    );

    await user.click(screen.getByRole("button", { name: /separate account, not started/i }));

    expect(onOpenDetail).toHaveBeenCalledWith("planner-0");
  });
});
