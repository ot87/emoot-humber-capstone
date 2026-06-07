import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizPage from "./QuizPage";

describe("QuizPage", () => {
  it("shows the questions placeholder after start quiz is clicked", async () => {
    const user = userEvent.setup();

    render(<QuizPage />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByText("Question flow")).toBeInTheDocument();
  });
});
