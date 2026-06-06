import { render, screen } from "@testing-library/react";
import App from "@/App";
import type { AuthUser } from "@/types/user";

// Replace the whole auth service so rendering App never reaches lib/firebase
// (which calls initializeApp at import time and throws without env vars).
// listenToAuthChanges synchronously reports "signed out" so useAuth settles
// to loading=false and the default /quiz route renders.
vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    callback(null);
    return () => {};
  }),
}));

describe("App", () => {
  it("renders the default route", () => {
    render(<App />);
    expect(screen.getByText("Quiz")).toBeInTheDocument();
  });
});
