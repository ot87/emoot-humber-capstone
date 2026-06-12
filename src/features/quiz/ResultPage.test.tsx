import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PERSONALITY_TYPES } from "@/types/quiz";
import type { QuizCompletionResult } from "@/types/quiz";
import { getPersonalityResultContent } from "./quiz.result";
import ResultPage from "./ResultPage";

function renderResultPage(state: QuizCompletionResult | null, initialEntry = "/result") {
  return render(
    <MemoryRouter initialEntries={[{ pathname: initialEntry, state }]}>
      <Routes>
        <Route path="/result" element={<ResultPage />} />
        <Route path="/quiz" element={<div>Quiz landing</div>} />
        <Route path="/auth" element={<div>Auth page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

const sampleAnswers: QuizCompletionResult["answers"] = [{ questionId: "q1", optionId: "a" }];

describe("ResultPage", () => {
  it.each(PERSONALITY_TYPES)("renders the %s result screen from route state", (personalityType) => {
    const content = getPersonalityResultContent(personalityType);

    renderResultPage({ personalityType, answers: sampleAnswers });

    expect(
      screen.getByText(
        (_text, element) => element?.tagName === "P" && element.textContent === content.title,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(content.description)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up to play emoot bingo/i }),
    ).toBeInTheDocument();
  });

  it("redirects to /quiz when route state is missing or invalid", () => {
    renderResultPage(null);

    expect(screen.getByText("Quiz landing")).toBeInTheDocument();
  });

  it("navigates to /auth when the sign-up CTA is clicked", async () => {
    const user = userEvent.setup();

    renderResultPage({ personalityType: "planner", answers: sampleAnswers });
    await user.click(screen.getByRole("button", { name: /sign up to play emoot bingo/i }));

    expect(screen.getByText("Auth page")).toBeInTheDocument();
  });
});
