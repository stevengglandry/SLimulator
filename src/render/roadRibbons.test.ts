import { describe, expect, it } from "vitest";
import { RoadModel } from "../game/route";
import { fillGuardrailRibbonSamples, fillRoadRibbonSamples, firstLaneDashStart, guardrailRibbonSettings, laneDividerVisible, roadRibbonSettings } from "./roadRibbons";

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

  it("anchors explicit dash segments to a stable global phase", () => {
    expect(firstLaneDashStart(0)).toBe(0);
    expect(firstLaneDashStart(2)).toBe(0);
    expect(firstLaneDashStart(4)).toBeCloseTo(8.2);
    expect(firstLaneDashStart(123.45 + 8.2) - firstLaneDashStart(123.45)).toBeCloseTo(8.2);
    expect(firstLaneDashStart(-1)).toBe(0);
  });

  it("uses identical lane-line segmentation in both modes while high extends farther", () => {
    const high = guardrailRibbonSettings("high");
    const perf = guardrailRibbonSettings("perf");
    expect(high.spacing).toBe(perf.spacing);
    expect(high.sampleCount * high.spacing - high.backDistance).toBeGreaterThan(
      perf.sampleCount * perf.spacing - perf.backDistance
    );
  });

  it("waits for usable lane width before revealing a new divider", () => {
    expect(laneDividerVisible(1.5, 1)).toBe(false);
    expect(laneDividerVisible(1.68, 1)).toBe(false);
    expect(laneDividerVisible(1.7, 1)).toBe(true);
    expect(laneDividerVisible(2.7, 2)).toBe(true);
  });

});
