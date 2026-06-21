import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { PERSONALITY_TYPES } from "@/types/quiz";
import type { QuizCompletionResult } from "@/types/quiz";
import { getPersonalityResultContent } from "./quiz.result";
import ResultPage from "./ResultPage";

function AuthStub() {
  const location = useLocation();
  return <div>Auth page {JSON.stringify(location.state)}</div>;
}

function renderResultPage(state: unknown, initialEntry = "/result") {
  return render(
    <MemoryRouter initialEntries={[{ pathname: initialEntry, state }]}>
      <Routes>
        <Route path="/result" element={<ResultPage />} />
        <Route path="/quiz" element={<div>Quiz landing</div>} />
        <Route path="/auth" element={<AuthStub />} />
      </Routes>
    </MemoryRouter>,
  );
}

const sampleAnswers: QuizCompletionResult["answers"] = { q1: "a" };

describe("ResultPage", () => {
  it.each(PERSONALITY_TYPES)("renders the %s result screen from route state", (personalityType) => {
    const content = getPersonalityResultContent(personalityType);

    renderResultPage({ personalityType, answers: sampleAnswers });

    expect(
      screen.getByRole("heading", {
        name: new RegExp(content.title.trim().split(/\s+/).join("\\s+"), "i"),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(content.description)).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("presentation")
        .some((img) => img.getAttribute("src") === content.iconSrc),
    ).toBe(true);
    expect(screen.getByRole("link", { name: /sign up to play emoot bingo/i })).toHaveAttribute(
      "href",
      "/auth",
    );
  });

  it.each([
    ["missing", null],
    ["malformed", { personalityType: "bogus", answers: [] }],
    ["non-string answer values", { personalityType: "PLANNER", answers: { q1: 42 } }],
  ])("redirects to /quiz when route state is %s", (_label, state) => {
    renderResultPage(state);
    expect(screen.getByText("Quiz landing")).toBeInTheDocument();
  });

  it("navigates to /auth when the sign-up CTA is clicked", async () => {
    const user = userEvent.setup();

    renderResultPage({ personalityType: "PLANNER", answers: sampleAnswers });
    await user.click(screen.getByRole("link", { name: /sign up to play emoot bingo/i }));

    expect(screen.getByText(/auth page/i)).toHaveTextContent('{"from":"/bingo"}');
  });
});
