import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BingoGrid } from "@/features/bingo/components/BingoGrid";
import { getPersonalityResultTheme } from "@/features/quiz/quiz.result";
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

  it("shows the savings-goal centre tile with not-started label", () => {
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

  it("applies completed and pending tile surface classes", () => {
    const { container } = render(
      <BingoGrid
        challenges={testPlannerBingoChallenges}
        completed={testCompletedPartial}
        personalityType="PLANNER"
        onOpenDetail={vi.fn()}
      />,
    );

    expect(container.querySelector(".bg-bingo-tile-completed")).toBeInTheDocument();
    expect(container.querySelector(".bg-bingo-tile-pending")).toBeInTheDocument();
    expect(container.querySelector(".bg-bingo-tile-centre")).not.toBeInTheDocument();
  });

  it("applies completed tile surface and personality icon when the savings goal is completed", () => {
    const { container } = render(
      <BingoGrid
        challenges={testPlannerBingoChallenges}
        completed={["planner-4"]}
        personalityType="PLANNER"
        onOpenDetail={vi.fn()}
      />,
    );

    const centreTile = screen.getByRole("button", { name: /emoot savings goal, completed/i });

    expect(centreTile).toHaveClass("bg-bingo-tile-completed");
    expect(centreTile).toHaveAttribute("data-tile-state", "completed");
    expect(container.querySelector(".bg-bingo-tile-centre")).not.toBeInTheDocument();
    expect(within(centreTile).getByRole("presentation", { hidden: true })).toHaveAttribute(
      "src",
      getPersonalityResultTheme("PLANNER").iconSrc,
    );
  });
});
