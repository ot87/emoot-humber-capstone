import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { useAppShellHeaderVisibility } from "./useAppShellHeaderVisibility";

function HeaderVisibilityProbe({ visible }: { visible: boolean }) {
  const { setHeaderVisible } = useAppShellHeaderVisibility();

  return (
    <button type="button" onClick={() => setHeaderVisible(visible)}>
      Set header {visible ? "visible" : "hidden"}
    </button>
  );
}

function renderAppLayout(initialEntry: string, page: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/quiz" element={page} />
          <Route path="/bingo" element={<div>Bingo page</div>} />
          <Route path="/auth" element={<div>Auth page</div>} />
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

  it("hides the shared header when a page requests it", async () => {
    const user = userEvent.setup();

    renderAppLayout("/quiz", <HeaderVisibilityProbe visible={false} />);

    expect(screen.getByRole("link", { name: /emoot home/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /set header hidden/i }));

    expect(screen.queryByRole("link", { name: /emoot home/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });
});
