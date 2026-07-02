import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BINGO_DETAIL_ICON, getBingoTaskPendingIconForChallenge } from "@/features/bingo/bingo.icons";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";
import { BingoChallengeDetail } from "@/features/bingo/components/BingoChallengeDetail";

const impulseChallenge = testPlannerBingoChallenges[5];

describe("BingoChallengeDetail", () => {
  it("renders challenge title, copy, and challenge number badge", () => {
    render(
      <BingoChallengeDetail
        challenge={impulseChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onToggleComplete={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Challenge detail")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /skip one impulse buy/i })).toBeInTheDocument();
    expect(screen.getByText(/the planner · challenge #6/i)).toBeInTheDocument();
    expect(screen.getByText(impulseChallenge.whatToDo)).toBeInTheDocument();
    expect(screen.getByText(impulseChallenge.whyItMatters)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /what to do\?/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /why it matters\?/i })).toBeInTheDocument();
  });

  it("uses the pending task icon and personality theme", () => {
    const { container } = render(
      <BingoChallengeDetail
        challenge={impulseChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onToggleComplete={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const heroIcon = container.querySelector(".bg-bingo-tile-completed img");

    expect(heroIcon).toHaveAttribute(
      "src",
      getBingoTaskPendingIconForChallenge(impulseChallenge),
    );
    expect(container.querySelector(".bg-quiz-result-planner")).toBeInTheDocument();
  });

  it("calls onToggleComplete when mark complete is clicked", async () => {
    const user = userEvent.setup();
    const onToggleComplete = vi.fn();

    render(
      <BingoChallengeDetail
        challenge={impulseChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onToggleComplete={onToggleComplete}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /mark challenge as complete/i }));

    expect(onToggleComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleComplete from reset when completed", async () => {
    const user = userEvent.setup();
    const onToggleComplete = vi.fn();

    render(
      <BingoChallengeDetail
        challenge={impulseChallenge}
        personalityType="PLANNER"
        isCompleted={true}
        onToggleComplete={onToggleComplete}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /mark challenge as not started/i }));

    expect(onToggleComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /challenge completed/i })).toBeDisabled();
  });

  it("uses the close icon on close and reset icon on reset", () => {
    render(
      <BingoChallengeDetail
        challenge={impulseChallenge}
        personalityType="PLANNER"
        isCompleted={true}
        onToggleComplete={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const closeImg = screen
      .getByRole("button", { name: /close challenge detail/i })
      .querySelector("img");
    const resetImg = screen
      .getByRole("button", { name: /mark challenge as not started/i })
      .querySelector("img");

    expect(closeImg).toHaveAttribute("src", BINGO_DETAIL_ICON.close);
    expect(resetImg).toHaveAttribute("src", BINGO_DETAIL_ICON.reset);
  });

  it("calls onClose when close is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <BingoChallengeDetail
        challenge={impulseChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onToggleComplete={vi.fn()}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: /close challenge detail/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
