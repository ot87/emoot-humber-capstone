import { render, screen } from "@testing-library/react";
import { BingoTile } from "@/features/bingo/components/BingoTile";
import { testPlannerBingoChallenges } from "@/features/bingo/bingo.test-fixtures";

const pendingChallenge = testPlannerBingoChallenges[0];
const centreChallenge = testPlannerBingoChallenges[4];

describe("BingoTile", () => {
  it("centers pending tile content with a 30px task icon and Figma title typography", () => {
    const { container } = render(
      <BingoTile
        challenge={pendingChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onOpenDetail={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: /separate account, not started/i });
    expect(button).toHaveClass("flex", "flex-col", "items-center", "justify-center");

    const icon = container.querySelector('img[aria-hidden="true"]');
    expect(icon).toHaveAttribute("width", "30");
    expect(icon).toHaveAttribute("height", "30");
    expect(icon).toHaveClass("size-[30px]");

    const title = screen.getByText("separate account");
    expect(title).toHaveClass(
      "font-quiz-body",
      "text-xs",
      "font-medium",
      "leading-[15px]",
      "tracking-normal",
      "text-center",
    );
  });

  it("renders completed tiles with a 30px check icon and matching title typography", () => {
    const { container } = render(
      <BingoTile
        challenge={pendingChallenge}
        personalityType="PLANNER"
        isCompleted={true}
        onOpenDetail={vi.fn()}
      />,
    );

    const icon = container.querySelector('img[aria-hidden="true"]');
    expect(icon).toHaveAttribute("width", "30");
    expect(icon).toHaveAttribute("height", "30");
    expect(icon).toHaveClass("size-[30px]");

    const title = screen.getByText("separate account");
    expect(title).toHaveClass("font-medium", "text-xs", "leading-[15px]", "tracking-normal");
  });

  it("uses Figma title typography on the centre tile", () => {
    render(
      <BingoTile
        challenge={centreChallenge}
        personalityType="PLANNER"
        isCompleted={false}
        onOpenDetail={vi.fn()}
      />,
    );

    const title = screen.getByText("Emoot Savings Goal");
    expect(title).toHaveClass(
      "font-quiz-body",
      "text-xs",
      "font-medium",
      "leading-[15px]",
      "tracking-normal",
      "text-center",
    );
  });
});
