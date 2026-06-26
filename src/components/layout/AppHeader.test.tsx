import { render, screen } from "@testing-library/react";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders the centered EMOOT logo linking home", () => {
    render(<AppHeader homeHref="/quiz" />);

    expect(screen.getByRole("link", { name: /emoot home/i })).toHaveAttribute("href", "/quiz");
    expect(screen.getByRole("img", { name: /emoot/i })).toHaveAttribute("width", "78.36");
    expect(screen.getByRole("img", { name: /emoot/i })).toHaveAttribute("height", "38");
  });
});
