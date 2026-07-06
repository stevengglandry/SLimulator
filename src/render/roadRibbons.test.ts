import { describe, expect, it } from "vitest";
import { RoadModel } from "../game/route";
import { fillGuardrailRibbonSamples, fillRoadRibbonSamples, guardrailRibbonSettings, laneDashOffsetForSampleBase, roadRibbonSettings } from "./roadRibbons";

describe("road ribbon sample cache", () => {
  it("builds a shorter sample window for perf mode", () => {
    expect(roadRibbonSettings("perf").sampleCount).toBeLessThan(roadRibbonSettings("high").sampleCount);
    expect(roadRibbonSettings("perf").backDistance).toBeLessThan(roadRibbonSettings("high").backDistance);
  });

  it("quantizes sample windows and matches RoadModel world samples", () => {
    const road = new RoadModel(99);
    const samples = new Float32Array(160);
    const result = fillRoadRibbonSamples(samples, 123.45, "perf");
    expect(result.sampleCount).toBe(96);
    expect(samples[0]).toBeCloseTo(result.base);
    expect(samples[1] - samples[0]).toBeCloseTo(result.spacing);

    const left = road.worldFromRoad(samples[8], -2.5, 0.02);
    const right = road.worldFromRoad(samples[8], 2.5, 0.02);
    expect(Number.isFinite(left.x)).toBe(true);
    expect(Number.isFinite(left.z)).toBe(true);
    expect(right.x).not.toBeCloseTo(left.x);
  });

  it("uses denser guardrail samples than the road ribbon", () => {
    const roadSettings = roadRibbonSettings("perf");
    const railSettings = guardrailRibbonSettings("perf");
    expect(railSettings.spacing).toBeLessThan(roadSettings.spacing);
    expect(railSettings.sampleCount).toBeGreaterThan(roadSettings.sampleCount);

    const samples = new Float32Array(guardrailRibbonSettings("high").sampleCount);
    const result = fillGuardrailRibbonSamples(samples, 123.45, "perf");
    expect(result.sampleCount).toBe(railSettings.sampleCount);
    expect(samples[0]).toBeCloseTo(result.base);
    expect(samples[1] - samples[0]).toBeCloseTo(railSettings.spacing);
  });

  it("keeps dashed lane phase bounded to the dash cycle", () => {
    const offset = laneDashOffsetForSampleBase(123.45);
    expect(offset).toBeGreaterThanOrEqual(0);
    expect(offset).toBeLessThan(8.2);
    expect(laneDashOffsetForSampleBase(123.45 + 8.2)).toBeCloseTo(offset);
    expect(laneDashOffsetForSampleBase(-1)).toBeGreaterThanOrEqual(0);
  });
});
