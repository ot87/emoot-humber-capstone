import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getQuestions } from "@/services/quiz.service";
import { testQuizQuestions } from "./quiz.test-fixtures";
import QuizPage from "./QuizPage";
import ResultPage from "./ResultPage";
import { useQuizResult } from "./hooks/useQuizResult";

vi.mock("@/services/quiz.service", () => ({
  getQuestions: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/features/quiz/hooks/useQuizResult", () => ({
  useQuizResult: vi.fn(),
}));

const mockedGetQuestions = vi.mocked(getQuestions);
const mockedUseAuth = vi.mocked(useAuth);
const mockedUseQuizResult = vi.mocked(useQuizResult);
const mockSaveCompletion = vi.fn().mockResolvedValue(true);

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
  beforeEach(() => {
    mockedGetQuestions.mockReset();
    mockedGetQuestions.mockResolvedValue(testQuizQuestions);
    mockedUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });
    mockSaveCompletion.mockReset();
    mockSaveCompletion.mockResolvedValue(true);
    mockedUseQuizResult.mockReturnValue({
      savedResult: null,
      loading: false,
      error: "",
      hasSavedResult: false,
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

    expect(screen.getByText("Q1")).toBeInTheDocument();
    expect(screen.getByText(testQuizQuestions[0].text)).toBeInTheDocument();
  });

  it("shows an empty state instead of start quiz when no questions are available", async () => {
    mockedGetQuestions.mockResolvedValue([]);

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

    expect(screen.getByText("THE PLANNER")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up to play emoot bingo/i })).toHaveAttribute(
      "href",
      "/auth",
    );
    expect(mockSaveCompletion).not.toHaveBeenCalled();
  });

  it("saves the quiz result when a signed-in user finishes the quiz", async () => {
    const user = userEvent.setup();

    mockedUseAuth.mockReturnValue({
      user: {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: null,
      },
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isSigningIn: false,
      isSigningOut: false,
      error: "",
    });

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

    expect(mockSaveCompletion).toHaveBeenCalledWith({
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
