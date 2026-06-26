import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { getPersonalityResultTheme } from "@/features/quiz/quiz.result";
import { testResultDefinitions } from "@/features/quiz/quiz.test-fixtures";
import { PERSONALITY_TYPES, type PersonalityType } from "@/types/quiz";
import { QuizResultScreen } from "./QuizResultScreen";

function AuthStub() {
  const location = useLocation();
  return <div>Auth page {JSON.stringify(location.state)}</div>;
}

function renderQuizResultScreen(personalityType: PersonalityType) {
  const definition = testResultDefinitions.find(
    (candidate) => candidate.personalityType === personalityType,
  );
  if (!definition) {
    throw new Error(`Missing test definition for ${personalityType}`);
  }

  return render(
    <MemoryRouter initialEntries={["/result"]}>
      <Routes>
        <Route path="/result" element={<QuizResultScreen definition={definition} />} />
        <Route path="/auth" element={<AuthStub />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("QuizResultScreen", () => {
  it.each(PERSONALITY_TYPES)("renders %s definition copy and theme", (personalityType) => {
    const definition = testResultDefinitions.find(
      (candidate) => candidate.personalityType === personalityType,
    );
    if (!definition) {
      throw new Error(`Missing test definition for ${personalityType}`);
    }
    const theme = getPersonalityResultTheme(personalityType);

    renderQuizResultScreen(personalityType);

    expect(
      screen.getByRole("heading", {
        name: new RegExp(definition.displayName.trim().split(/\s+/).join("\\s+"), "i"),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(definition.description)).toBeInTheDocument();
    expect(
      screen.getAllByRole("presentation").some((img) => img.getAttribute("src") === theme.iconSrc),
    ).toBe(true);
    expect(screen.getByRole("link", { name: /sign up to play emoot bingo/i })).toHaveAttribute(
      "href",
      "/auth",
    );
  });

  it("links to /auth with post-sign-in destination state", async () => {
    const user = userEvent.setup();

    renderQuizResultScreen("PLANNER");
    await user.click(screen.getByRole("link", { name: /sign up to play emoot bingo/i }));

    expect(screen.getByText(/auth page/i)).toHaveTextContent('{"from":"/bingo"}');
  });
});
