import { render, screen } from "@testing-library/react";
import { BingoProgressCard } from "@/features/bingo/components/BingoProgressCard";

describe("BingoProgressCard", () => {
  it("shows how many challenges remain", () => {
    render(<BingoProgressCard completedCount={3} totalCount={9} />);

    expect(screen.getByLabelText("Bingo progress")).toBeInTheDocument();
    expect(screen.getByText(/complete all 9 for your chance to win\./i)).toBeInTheDocument();
    expect(screen.getByText(/6 more to go\. you're getting close!/i)).toBeInTheDocument();
  });

  it("shows a completion message when every challenge is done", () => {
    render(<BingoProgressCard completedCount={9} totalCount={9} />);

    expect(screen.getByText(/all challenges complete/i)).toBeInTheDocument();
  });
});
