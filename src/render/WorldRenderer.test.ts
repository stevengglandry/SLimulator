import { describe, expect, it } from "vitest";
import { renderPixelRatio } from "./WorldRenderer";

describe("render quality pixel ratio", () => {
  it("leaves perf mode at its existing one-to-one pixel ratio", () => {
    expect(renderPixelRatio("perf", 1)).toBe(1);
    expect(renderPixelRatio("perf", 2)).toBe(1);
  });

  it("uses bounded supersampling only in high mode", () => {
    expect(renderPixelRatio("high", 1)).toBe(1.2);
    expect(renderPixelRatio("high", 1.5)).toBe(1.5);
    expect(renderPixelRatio("high", 2)).toBe(1.7);
  });
});
