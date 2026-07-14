import { describe, expect, it } from "vitest";
import { RoadModel } from "../game/route";
import { terrainHeightAt, terrainProfileAt, terrainProfileKey } from "./terrainSystem";

describe("High-mode terrain profiles", () => {
  it("keeps highways flatter than the unmapped environment", () => {
    const road = new RoadModel(41);
    const rural = terrainProfileAt(road, 100);
    road.reset("l2");
    const l2 = terrainProfileAt(road, 100);
    road.reset("l3");
    const l3 = terrainProfileAt(road, 100);

    expect(rural.reliefM).toBeGreaterThan(l2.reliefM);
    expect(l2.reliefM).toBeGreaterThan(l3.reliefM);
  });

  it("keeps terrain flat at the guardrail before raising the outer environment", () => {
    const edge = terrainHeightAt(22, 15, -80, 0, 5);
    const outer = terrainHeightAt(22, 15, -80, 60, 5);

    expect(edge).toBeCloseTo(-0.015);
    expect(outer).toBeGreaterThan(edge + 0.25);
  });

  it("changes upcoming tile profiles during a scene transition", () => {
    const road = new RoadModel(77);
    road.requestScene("l3", undefined, 100);

    const beforeTaper = terrainProfileKey(road, 300);
    const duringTaper = terrainProfileKey(road, 440);

    expect(beforeTaper.startsWith("unmapped:")).toBe(true);
    expect(duringTaper).not.toBe(beforeTaper);
    expect(terrainProfileAt(road, 440).buildings).toBeGreaterThan(0.5);
  });
});
