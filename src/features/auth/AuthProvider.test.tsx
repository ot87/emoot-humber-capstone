import { act, render, screen, waitFor } from "@testing-library/react";
import { listenToAuthChanges } from "@/services/auth.service";
import type { AuthUser } from "@/types/user";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./hooks/useAuth";

let authListener: ((user: AuthUser | null) => void) | null = null;

vi.mock("@/services/auth.service", () => ({
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  listenToAuthChanges: vi.fn((callback: (user: AuthUser | null) => void) => {
    authListener = callback;
    callback(null);
    return () => {
      authListener = null;
    };
  }),
}));

const mockedListenToAuthChanges = vi.mocked(listenToAuthChanges);

const signedInUser: AuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: null,
};

function AuthProbe({ label }: { label: string }) {
  const { user, loading } = useAuth();
  return (
    <div>
      {label}:{loading ? "loading" : (user?.uid ?? "anon")}
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authListener = null;
    mockedListenToAuthChanges.mockImplementation((callback) => {
      authListener = callback;
      callback(null);
      return () => {
        authListener = null;
      };
    });
  });

  it("opens a single auth listener no matter how many consumers read it", () => {
    render(
      <AuthProvider>
        <AuthProbe label="a" />
        <AuthProbe label="b" />
        <AuthProbe label="c" />
      </AuthProvider>,
    );

    expect(mockedListenToAuthChanges).toHaveBeenCalledOnce();
  });

  it("shares one auth state across every consumer", async () => {
    render(
      <AuthProvider>
        <AuthProbe label="a" />
        <AuthProbe label="b" />
      </AuthProvider>,
    );

    expect(screen.getByText("a:anon")).toBeInTheDocument();
    expect(screen.getByText("b:anon")).toBeInTheDocument();

    act(() => {
      authListener?.(signedInUser);
    });

    await waitFor(() => {
      expect(screen.getByText("a:test-uid")).toBeInTheDocument();
      expect(screen.getByText("b:test-uid")).toBeInTheDocument();
    });
  });

  it("throws when useAuth is read outside an AuthProvider", () => {
    function Orphan() {
      useAuth();
      return null;
    }

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Orphan />)).toThrow(/within an AuthProvider/);

    consoleError.mockRestore();
  });
});
