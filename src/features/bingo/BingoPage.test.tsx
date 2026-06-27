import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { getSavedQuizResult } from "@/services/quiz.service";
import type { AuthUser } from "@/types/user";
import type { SavedQuizResult } from "@/types/quiz";
import { BingoPage } from "./BingoPage";

vi.mock("@/services/quiz.service", () => ({
  getSavedQuizResult: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(signedInUser);
    return () => {};
  }),
}));

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

const savedResult: SavedQuizResult = {
  userId: "test-uid",
  quizId: "money-personality",
  personalityType: "PLANNER",
  answers: { q1: "a" },
  completedAt: null,
  updatedAt: null,
};

function renderBingoPage() {
  return render(
    <MemoryRouter initialEntries={["/bingo"]}>
      <Routes>
        <Route path="/bingo" element={<BingoPage />} />
        <Route path="/quiz" element={<div>Quiz landing</div>} />
        <Route path="/bingo/board" element={<div>Bingo board</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BingoPage", () => {
  beforeEach(() => {
    vi.mocked(getSavedQuizResult).mockResolvedValue(null);
  });

  it("renders the locked entry when no saved quiz result exists", async () => {
    renderBingoPage();

    expect(await screen.findByRole("heading", { name: /what type are you/i })).toBeInTheDocument();
    expect(screen.getByText(/your money saving personality/i)).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: /emoot bingo is locked/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/locked bingo board preview/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /take the quiz to unlock/i })).toHaveAttribute(
      "href",
      "/quiz",
    );
  });

  it("navigates to /quiz when the locked CTA is clicked", async () => {
    const user = userEvent.setup();
    renderBingoPage();

    await user.click(await screen.findByRole("link", { name: /take the quiz to unlock/i }));
    expect(screen.getByText("Quiz landing")).toBeInTheDocument();
  });

  it("redirects to /bingo/board when a saved quiz result exists", async () => {
    vi.mocked(getSavedQuizResult).mockResolvedValue(savedResult);

    renderBingoPage();

    expect(await screen.findByText("Bingo board")).toBeInTheDocument();
  });
});
