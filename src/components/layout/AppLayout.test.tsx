import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";

function renderAppLayout(initialEntry: string, page: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/quiz" element={page} />
          <Route path="/bingo" element={<div>Bingo page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AppLayout", () => {
  it("renders the shared header, page outlet, and footer on routed pages", () => {
    renderAppLayout("/quiz", <div>Quiz page</div>);

    expect(screen.getByRole("link", { name: /emoot home/i })).toBeInTheDocument();
    expect(screen.getByText("Quiz page")).toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("highlights bingo navigation on bingo routes", () => {
    renderAppLayout("/bingo", <div>Bingo page</div>);

    expect(screen.getByRole("link", { name: /bingo/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /quiz/i })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();
  });
});
