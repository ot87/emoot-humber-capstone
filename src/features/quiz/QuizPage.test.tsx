import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import QuizPage from "./QuizPage";
import ResultPage from "./ResultPage";
import { quizQuestions } from "./quiz.questions";

function renderQuizFlow(initialEntry = "/quiz") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function answerCurrentQuestionAndAdvance(
  user: ReturnType<typeof userEvent.setup>,
  isLastQuestion: boolean,
): Promise<void> {
  await user.click(screen.getAllByRole("radio")[0]);
  await user.click(
    screen.getByRole("button", { name: isLastQuestion ? /finish quiz/i : /next question/i }),
  );
}

describe("QuizPage", () => {
  it("shows the first quiz question after start quiz is clicked", async () => {
    const user = userEvent.setup();

    renderQuizFlow();
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText("Q1. Saving Style")).toBeInTheDocument();
    expect(screen.getByText(quizQuestions[0].question.text)).toBeInTheDocument();
  });

  it("navigates to /result after finishing question 5", async () => {
    const user = userEvent.setup();

    renderQuizFlow();
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    for (let index = 0; index < quizQuestions.length; index += 1) {
      await answerCurrentQuestionAndAdvance(user, index === quizQuestions.length - 1);
    }

    expect(screen.getByText("THE PLANNER")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /sign up to play emoot bingo/i }),
    ).toHaveAttribute("href", "/auth");
  });
});
