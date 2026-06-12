import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { getPersonalityResultContent } from "@/features/quiz/quiz.result";
import { PERSONALITY_TYPES, type PersonalityType } from "@/types/quiz";
import { QuizResultScreen } from "./QuizResultScreen";

function AuthStub() {
  const location = useLocation();
  return <div>Auth page {JSON.stringify(location.state)}</div>;
}

function renderQuizResultScreen(personalityType: PersonalityType) {
  return render(
    <MemoryRouter initialEntries={["/result"]}>
      <Routes>
        <Route path="/result" element={<QuizResultScreen personalityType={personalityType} />} />
        <Route path="/auth" element={<AuthStub />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("QuizResultScreen", () => {
  it.each(PERSONALITY_TYPES)("renders %s content from personalityType prop", (personalityType) => {
    const content = getPersonalityResultContent(personalityType);

    renderQuizResultScreen(personalityType);

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
    expect(
      screen.getByRole("link", { name: /sign up to play emoot bingo/i }),
    ).toHaveAttribute("href", "/auth");
  });

  it("renders the copyright footer with the current year", () => {
    renderQuizResultScreen("planner");

    expect(
      screen.getByText(
        `© Emoot | Happy Path Ventures Incorporated ${new Date().getFullYear()}`,
      ),
    ).toBeInTheDocument();
  });

  it("links to /auth with post-sign-in destination state", async () => {
    const user = userEvent.setup();

    renderQuizResultScreen("planner");
    await user.click(screen.getByRole("link", { name: /sign up to play emoot bingo/i }));

    expect(screen.getByText(/auth page/i)).toHaveTextContent('{"from":"/bingo"}');
  });
});
