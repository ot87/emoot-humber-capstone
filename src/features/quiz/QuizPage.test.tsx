import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizPage from "./QuizPage";
import { previewQuestion } from "./quiz.data";

describe("QuizPage", () => {
  it("shows the first quiz question after start quiz is clicked", async () => {
    const user = userEvent.setup();

    render(<QuizPage />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText("Q1. Saving Style")).toBeInTheDocument();
    expect(screen.getByText(previewQuestion.text)).toBeInTheDocument();
  });
});
