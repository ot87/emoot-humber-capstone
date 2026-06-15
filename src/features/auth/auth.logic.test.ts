import { describe, expect, it } from "vitest";
import { splitTaglineInitialCaps } from "@/features/auth/auth.logic";

describe("splitTaglineInitialCaps", () => {
  it("splits words and hyphen segments for enlarged initials", () => {
    expect(splitTaglineInitialCaps("Emotion-First Cash Transfer")).toEqual([
      { initial: "E", rest: "motion", separator: "-" },
      { initial: "F", rest: "irst", separator: " " },
      { initial: "C", rest: "ash", separator: " " },
      { initial: "T", rest: "ransfer", separator: "" },
    ]);
  });
});
