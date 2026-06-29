import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { getQuestions } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";
import {
  testLoadedQuiz,
  testQuizQuestions,
  testResultDefinitionsByType,
} from "./quiz.test-fixtures";
import QuizPage from "./QuizPage";
import ResultPage from "./ResultPage";
import { useSaveQuizResult } from "./hooks/useSaveQuizResult";

vi.mock("@/services/quiz.service", () => ({
  getQuestions: vi.fn(),
}));

vi.mock("@/features/quiz/hooks/useLoadQuizResult", () => ({
  useLoadQuizResult: vi.fn(() => ({
    savedResult: null,
    loading: false,
    error: "",
    hasSavedResult: false,
  })),
}));

vi.mock("@/features/quiz/hooks/useResultDefinitions", () => ({
  LOAD_RESULT_DEFINITIONS_ERROR: "Could not load personality results. Please try again.",
  useResultDefinitions: vi.fn(() => ({
    definitionsByType: testResultDefinitionsByType,
    loading: false,
    error: "",
  })),
}));

vi.mock("@/features/quiz/hooks/useSaveQuizResult", () => ({
  SAVE_QUIZ_RESULT_ERROR: "Could not save your quiz result. Please try again.",
  useSaveQuizResult: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(null);
    return () => {};
  }),
}));

const mockedGetQuestions = vi.mocked(getQuestions);
const mockedUseSaveQuizResult = vi.mocked(useSaveQuizResult);
const mockSaveCompletion = vi.fn().mockResolvedValue("skipped");

let capturedResultNavState: unknown = null;

function ResultWithRouteState() {
  const location = useLocation();

  useEffect(() => {
    capturedResultNavState = location.state;
  }, [location.state]);

  return <ResultPage />;
}

function renderQuizFlow(initialEntry = "/quiz") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultWithRouteState />} />
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
  beforeEach(() => {
    capturedResultNavState = null;
    mockedGetQuestions.mockReset();
    mockedGetQuestions.mockResolvedValue(testLoadedQuiz);
    mockSaveCompletion.mockReset();
    mockSaveCompletion.mockResolvedValue("skipped");
    mockedUseSaveQuizResult.mockReturnValue({
      saveCompletion: mockSaveCompletion,
    });
  });

  it("shows the landing header and spinner while questions are loading", () => {
    mockedGetQuestions.mockReturnValue(new Promise(() => {}));

    renderQuizFlow();

    expect(screen.getByLabelText(/find your money personality/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText(/how do you really feel about money/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /start quiz/i })).not.toBeInTheDocument();
  });

  it("shows a user-facing error when getQuestions rejects", async () => {
    mockedGetQuestions.mockRejectedValue(new Error("network failure"));

    renderQuizFlow();

    await waitFor(() => {
      expect(
        screen.getByText(/could not load quiz questions\. please try again\./i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByLabelText(/find your money personality/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /start quiz/i })).not.toBeInTheDocument();
  });

  it("shows the first quiz question after start quiz is clicked", async () => {
    const user = userEvent.setup();

    renderQuizFlow();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText(`Q1. ${testQuizQuestions[0].category}`)).toBeInTheDocument();
    expect(screen.getByText(testQuizQuestions[0].text)).toBeInTheDocument();
  });

  it("shows an empty state instead of start quiz when no questions are available", async () => {
    mockedGetQuestions.mockResolvedValue({ quizId: null, questions: [] });

    renderQuizFlow();

    await waitFor(() => {
      expect(screen.getByText(/no quiz questions are available right now/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /start quiz/i })).not.toBeInTheDocument();
  });

  it("navigates to /result after finishing question 5", async () => {
    const user = userEvent.setup();

    renderQuizFlow();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    for (let index = 0; index < testQuizQuestions.length; index += 1) {
      await answerCurrentQuestionAndAdvance(user, index === testQuizQuestions.length - 1);
    }

    expect(await screen.findByRole("heading", { name: /the planner/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up to play emoot bingo/i })).toHaveAttribute(
      "href",
      "/auth",
    );
    expect(mockSaveCompletion).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(capturedResultNavState).toMatchObject({
        needsDeferredSave: true,
        quizId: "moneyPersonalityQuiz",
        personalityType: "PLANNER",
        answers: {
          q1: "a",
          q2: "a",
          q3: "a",
          q4: "a",
          q5: "a",
        },
      });
    });
  });

  it("saves the quiz result when a signed-in user finishes the quiz", async () => {
    const user = userEvent.setup();

    mockSaveCompletion.mockResolvedValue("saved");

    renderQuizFlow();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    for (let index = 0; index < testQuizQuestions.length; index += 1) {
      await answerCurrentQuestionAndAdvance(user, index === testQuizQuestions.length - 1);
    }

    await waitFor(() => {
      expect(mockSaveCompletion).toHaveBeenCalledOnce();
    });

    expect(mockSaveCompletion).toHaveBeenCalledWith(
      {
        personalityType: "PLANNER",
        answers: {
          q1: "a",
          q2: "a",
          q3: "a",
          q4: "a",
          q5: "a",
        },
      },
      "moneyPersonalityQuiz",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a save error banner on the result page when saving fails", async () => {
    const user = userEvent.setup();

    mockSaveCompletion.mockResolvedValue("failed");

    renderQuizFlow();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    for (let index = 0; index < testQuizQuestions.length; index += 1) {
      await answerCurrentQuestionAndAdvance(user, index === testQuizQuestions.length - 1);
    }

    expect(
      await screen.findByText(/could not save your quiz result\. please try again\./i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /the planner/i })).toBeInTheDocument();
  });
});
