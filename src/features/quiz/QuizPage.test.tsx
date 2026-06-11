import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import QuizPage from "./QuizPage";
import { quizQuestions } from "./quiz.questions";

describe("QuizPage", () => {
  it("shows the first quiz question after start quiz is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <QuizPage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText("Q1. Saving Style")).toBeInTheDocument();
    expect(screen.getByText(quizQuestions[0].question.text)).toBeInTheDocument();
  });
});
