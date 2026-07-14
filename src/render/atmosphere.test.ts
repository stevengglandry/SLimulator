import { describe, expect, it } from "vitest";
import { atmosphereFogRange } from "./atmosphere";

describe("atmosphere quality profiles", () => {
  it("preserves the existing perf fog ranges", () => {
    expect(atmosphereFogRange("perf", 0, 0)).toEqual({ near: 62, far: 390 });
    expect(atmosphereFogRange("perf", 1, 0)).toEqual({ near: 42, far: 260 });
    expect(atmosphereFogRange("perf", 0, 1)).toEqual({ near: 72, far: 470 });
  });

  it("uses the expanded High-mode aerial profile independently", () => {
    expect(atmosphereFogRange("high", 0, 0)).toEqual({ near: 82, far: 430 });
    expect(atmosphereFogRange("high", 1, 0)).toEqual({ near: 48, far: 245 });
    expect(atmosphereFogRange("high", 0, 1)).toEqual({ near: 82, far: 455 });
  });
});
