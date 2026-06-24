import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { useLoadQuizResult } from "@/features/quiz/hooks/useLoadQuizResult";
import { PERSONALITY_TYPES } from "@/types/quiz";
import type { QuizCompletionResult } from "@/types/quiz";
import { getPersonalityResultContent } from "./quiz.result";
import ResultPage from "./ResultPage";

vi.mock("@/features/quiz/hooks/useLoadQuizResult", () => ({
  useLoadQuizResult: vi.fn(),
}));

const mockedUseLoadQuizResult = vi.mocked(useLoadQuizResult);

function mockLoadQuizResultState(
  overrides: Partial<ReturnType<typeof useLoadQuizResult>> = {},
): ReturnType<typeof useLoadQuizResult> {
  return {
    savedResult: null,
    loading: false,
    error: "",
    hasSavedResult: false,
    ...overrides,
  };
}

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
  beforeEach(() => {
    mockedUseLoadQuizResult.mockReturnValue(mockLoadQuizResultState());
  });

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

  it("renders the saved quiz result when route state is missing", () => {
    mockedUseLoadQuizResult.mockReturnValue(
      mockLoadQuizResultState({
        savedResult: {
          userId: "test-uid",
          quizId: "moneyPersonalityQuiz",
          personalityType: "WORRIER",
          answers: { q1: "q1b" },
          completedAt: null,
          updatedAt: null,
        },
        hasSavedResult: true,
      }),
    );

    renderResultPage(null);

    expect(screen.getByRole("heading", { name: /the worrier/i })).toBeInTheDocument();
  });

  it("shows a loading spinner while the saved result is loading", () => {
    mockedUseLoadQuizResult.mockReturnValue(
      mockLoadQuizResultState({
        loading: true,
      }),
    );

    renderResultPage(null);

    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("shows an error when loading the saved result fails", () => {
    mockedUseLoadQuizResult.mockReturnValue(
      mockLoadQuizResultState({
        error: "Could not load your quiz result. Please try again.",
      }),
    );

    renderResultPage(null);

    expect(
      screen.getByText(/could not load your quiz result\. please try again\./i),
    ).toBeInTheDocument();
  });

  it("shows a save error banner when route state includes saveError", () => {
    renderResultPage({
      personalityType: "PLANNER",
      answers: sampleAnswers,
      saveError: "Could not save your quiz result. Please try again.",
    });

    expect(
      screen.getByText(/could not save your quiz result\. please try again\./i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /the planner/i })).toBeInTheDocument();
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
