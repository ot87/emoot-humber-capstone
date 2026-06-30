import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthProvider";
import type { AuthUser } from "@/types/user";
import { AppLayout } from "./AppLayout";
import { useAppShellFooterNavVisibility } from "./useAppShellFooterNavVisibility";
import { useAppShellHeaderVisibility } from "./useAppShellHeaderVisibility";

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(null);
    return () => {};
  }),
}));

function HeaderVisibilityProbe({ visible }: { visible: boolean }) {
  const { setHeaderVisible } = useAppShellHeaderVisibility();

  return (
    <button type="button" onClick={() => setHeaderVisible(visible)}>
      Set header {visible ? "visible" : "hidden"}
    </button>
  );
}

function FooterNavVisibilityProbe({ visible }: { visible: boolean }) {
  const { setFooterNavVisible } = useAppShellFooterNavVisibility();

  return (
    <button type="button" onClick={() => setFooterNavVisible(visible)}>
      Set footer nav {visible ? "visible" : "hidden"}
    </button>
  );
}

function renderAppLayout(initialEntry: string, page: React.ReactNode) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/quiz" element={page} />
            <Route path="/result" element={<div>Result page</div>} />
            <Route path="/bingo" element={<div>Bingo page</div>} />
            <Route path="/bingo/board" element={<div>Bingo board page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("AppLayout", () => {
  it("renders the shared header, page outlet, and footer on routed pages", () => {
    renderAppLayout("/quiz", <div>Quiz page</div>);

    expect(screen.getByRole("link", { name: /emoot home/i })).toBeInTheDocument();
    expect(screen.getByText("Quiz page")).toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("highlights quiz navigation only on /quiz", () => {
    renderAppLayout("/quiz", <div>Quiz page</div>);

    expect(screen.getByRole("link", { name: /quiz/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /bingo/i })).not.toHaveAttribute("aria-current");
  });

  it("does not highlight quiz navigation on /result", () => {
    renderAppLayout("/result", <div>Result page</div>);

    expect(screen.getByRole("link", { name: /quiz/i })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: /bingo/i })).not.toHaveAttribute("aria-current");
  });

  it("hides the footer navigation when a page requests it", async () => {
    const user = userEvent.setup();

    renderAppLayout("/quiz", <FooterNavVisibilityProbe visible={false} />);

    expect(screen.getByRole("navigation", { name: /app navigation/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /set footer nav hidden/i }));

    expect(screen.queryByRole("navigation", { name: /app navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("highlights bingo navigation on /bingo", () => {
    renderAppLayout("/bingo", <div>Bingo page</div>);

    expect(screen.getByRole("link", { name: /bingo/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /quiz/i })).not.toHaveAttribute("aria-current");
  });

  it("highlights bingo navigation on /bingo/board", () => {
    renderAppLayout("/bingo/board", <div>Bingo board page</div>);

    expect(screen.getByRole("link", { name: /bingo/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /quiz/i })).not.toHaveAttribute("aria-current");
  });

  it("hides the shared header when a page requests it", async () => {
    const user = userEvent.setup();

    renderAppLayout("/quiz", <HeaderVisibilityProbe visible={false} />);

    expect(screen.getByRole("link", { name: /emoot home/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /set header hidden/i }));

    expect(screen.queryByRole("link", { name: /emoot home/i })).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();
  });

  it("navigates between shell routes via client-side footer links", async () => {
    const user = userEvent.setup();

    renderAppLayout("/quiz", <div>Quiz page</div>);

    await user.click(screen.getByRole("link", { name: /bingo/i }));

    expect(screen.getByText("Bingo page")).toBeInTheDocument();
    expect(screen.queryByText("Quiz page")).not.toBeInTheDocument();
    expect(screen.getByText(/happy path ventures incorporated/i)).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /quiz/i }));

    expect(screen.getByText("Quiz page")).toBeInTheDocument();
    expect(screen.queryByText("Bingo page")).not.toBeInTheDocument();
  });
});
