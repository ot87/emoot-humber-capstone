import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getBingoTaskCompletedIcon,
  getBingoTaskPendingIconForChallenge,
} from "@/features/bingo/bingo.icons";
import { getPersonalityResultTheme } from "@/features/quiz/quiz.result";
import { BingoTile } from "@/features/bingo/components/BingoTile";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";

const pendingChallenge = testPlannerBingoChallenges[0];
const centreChallenge = testPlannerBingoChallenges[4];

describe("BingoTile", () => {
  it("renders a pending tile with challenge title and not-started state", () => {
    render(
      <BingoTile
        challenge={pendingChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onOpenDetail={vi.fn()}
      />,
    );

    const tile = screen.getByRole("button", { name: /separate account, not started/i });

    expect(tile).toHaveAttribute("data-tile-state", "pending");
    expect(screen.getByText("separate account")).toBeVisible();
    expect(within(tile).getByRole("presentation", { hidden: true })).toHaveAttribute(
      "src",
      getBingoTaskPendingIconForChallenge(pendingChallenge),
    );
  });

  it("renders a completed tile with completed state in accessible name", () => {
    render(
      <BingoTile
        challenge={pendingChallenge}
        personalityType="PLANNER"
        isCompleted={true}
        onOpenDetail={vi.fn()}
      />,
    );

    const tile = screen.getByRole("button", { name: /separate account, completed/i });

    expect(tile).toHaveAttribute("data-tile-state", "completed");
    expect(screen.getByText("separate account")).toBeVisible();
    expect(within(tile).getByRole("presentation", { hidden: true })).toHaveAttribute(
      "src",
      getBingoTaskCompletedIcon(),
    );
  });

  it("renders the centre tile with savings goal title and personality face icon", () => {
    render(
      <BingoTile
        challenge={centreChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onOpenDetail={vi.fn()}
      />,
    );

    const tile = screen.getByRole("button", { name: /emoot savings goal, not started/i });

    expect(tile).toHaveAttribute("data-tile-state", "centre");
    expect(screen.getByText("Emoot Savings Goal")).toBeVisible();
    expect(within(tile).getByRole("presentation", { hidden: true })).toHaveAttribute(
      "src",
      getPersonalityResultTheme("PLANNER").iconSrc,
    );
  });

  it("distinguishes completed and pending tiles by state and task icon", () => {
    const { rerender } = render(
      <BingoTile
        challenge={pendingChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onOpenDetail={vi.fn()}
      />,
    );

    const pendingTile = screen.getByRole("button", { name: /separate account, not started/i });
    const pendingIconSrc = within(pendingTile)
      .getByRole("presentation", { hidden: true })
      .getAttribute("src");

    expect(pendingTile).toHaveAttribute("data-tile-state", "pending");

    rerender(
      <BingoTile
        challenge={pendingChallenge}
        personalityType="PLANNER"
        isCompleted={true}
        onOpenDetail={vi.fn()}
      />,
    );

    const completedTile = screen.getByRole("button", { name: /separate account, completed/i });
    const completedIconSrc = within(completedTile)
      .getByRole("presentation", { hidden: true })
      .getAttribute("src");

    expect(completedTile).toHaveAttribute("data-tile-state", "completed");
    expect(pendingIconSrc).not.toBe(completedIconSrc);
  });

  it("invokes onOpenDetail with the challenge id when clicked", async () => {
    const user = userEvent.setup();
    const onOpenDetail = vi.fn();

    render(
      <BingoTile
        challenge={pendingChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onOpenDetail={onOpenDetail}
      />,
    );

    await user.click(screen.getByRole("button", { name: /separate account, not started/i }));

    expect(onOpenDetail).toHaveBeenCalledWith("planner-0");
    expect(onOpenDetail).toHaveBeenCalledTimes(1);
  });
});
