import { render, screen } from "@testing-library/react";
import { BingoProgressCard } from "@/features/bingo/components/BingoProgressCard";

describe("BingoProgressCard", () => {
  it("shows how many challenges remain", () => {
    render(<BingoProgressCard personalityType="PLANNER" completedCount={3} totalCount={9} />);

    expect(screen.getByLabelText("Bingo progress")).toBeInTheDocument();
    expect(screen.getByText(/complete all 9 for your chance to win\./i)).toBeInTheDocument();
    expect(screen.getByText(/6 more to go\. you're getting close!/i)).toBeInTheDocument();
  });

  it("shows a completion message when every challenge is done", () => {
    render(<BingoProgressCard personalityType="PLANNER" completedCount={9} totalCount={9} />);

    expect(screen.getByText(/all challenges complete/i)).toBeInTheDocument();
  });

  it("applies the personality result surface theme", () => {
    const { container } = render(
      <BingoProgressCard personalityType="WORRIER" completedCount={0} totalCount={9} />,
    );

    expect(container.firstChild).toHaveClass("bg-quiz-result-worrier");
  });

  it("lays out the trophy above centered copy", () => {
    render(<BingoProgressCard personalityType="PLANNER" completedCount={2} totalCount={9} />);

    const card = screen.getByLabelText("Bingo progress");
    expect(card).toHaveClass("flex-col");
    expect(card).toHaveClass("items-center");
    expect(card).toHaveClass("text-center");

    const trophy = card.querySelector("img");
    const copy = trophy?.nextElementSibling;

    expect(trophy).toHaveClass("shrink-0");
    expect(copy?.querySelectorAll("p")).toHaveLength(2);
  });
});
