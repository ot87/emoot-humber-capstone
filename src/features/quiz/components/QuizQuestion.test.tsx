import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Question } from "@/types/quiz";
import { QuizQuestion } from "./QuizQuestion";

const sampleQuestion: Question = {
  id: "q1",
  text: "How do you usually approach saving?",
  category: "Emotional Trigger",
  options: [
    { id: "a", text: "I set a goal and work toward it constantly", personalityType: "PLANNER" },
    { id: "b", text: "I save when I feel stressed about money", personalityType: "WORRIER" },
    {
      id: "c",
      text: "I save only when I have extra left over.",
      personalityType: "FREE_SPIRIT",
    },
    {
      id: "d",
      text: "I intend to save, but rarely follow through",
      personalityType: "OVERWHELMED_STARTER",
    },
  ],
};

describe("QuizQuestion", () => {
  it("renders the question text and options", () => {
    render(<QuizQuestion question={sampleQuestion} onSelect={vi.fn()} />);

    expect(screen.getByText(sampleQuestion.text)).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /I save when I feel stressed about money/i }),
    ).toBeInTheDocument();
  });

  it("calls onSelect with the clicked option id", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<QuizQuestion question={sampleQuestion} onSelect={onSelect} />);
    await user.click(
      screen.getByRole("radio", { name: /I save when I feel stressed about money/i }),
    );

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith("b");
  });

  it("marks the selected option as checked", () => {
    render(<QuizQuestion question={sampleQuestion} selectedOptionId="c" onSelect={vi.fn()} />);

    expect(
      screen.getByRole("radio", { name: /I save only when I have extra left over/i }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("radio", { name: /I set a goal and work toward it constantly/i }),
    ).toHaveAttribute("aria-checked", "false");
  });
});
