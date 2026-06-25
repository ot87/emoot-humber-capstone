import { renderHook, waitFor } from "@testing-library/react";
import { getResultDefinitions } from "@/services/quiz.service";
import { testResultDefinitions } from "@/features/quiz/quiz.test-fixtures";
import { useResultDefinitions } from "./useResultDefinitions";

vi.mock("@/services/quiz.service", () => ({
  getResultDefinitions: vi.fn(),
}));

const mockedGetResultDefinitions = vi.mocked(getResultDefinitions);

describe("useResultDefinitions", () => {
  beforeEach(() => {
    mockedGetResultDefinitions.mockReset();
  });

  it("loads personality definitions from the quiz service", async () => {
    mockedGetResultDefinitions.mockResolvedValue(testResultDefinitions);

    const { result } = renderHook(() => useResultDefinitions());

    expect(result.current.loading).toBe(true);
    expect(result.current.definitionsByType).toEqual({});
    expect(result.current.error).toBe("");

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetResultDefinitions).toHaveBeenCalledOnce();
    expect(result.current.definitionsByType.PLANNER).toEqual(testResultDefinitions[0]);
    expect(result.current.error).toBe("");
  });

  it("surfaces a user-facing error when getResultDefinitions rejects", async () => {
    mockedGetResultDefinitions.mockRejectedValue(new Error("network failure"));

    const { result } = renderHook(() => useResultDefinitions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.definitionsByType).toEqual({});
    expect(result.current.error).toBe("Could not load personality results. Please try again.");
  });
});
