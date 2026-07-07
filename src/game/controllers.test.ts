import { describe, expect, it } from "vitest";
import { computeAccPedals, computeLaneCenterSteer, manualSteerLimit, mergeControls } from "./controllers";
import type { AdasState, LaneInfo, VehiclePose } from "./types";

const pose: VehiclePose = {
  x: 0,
  y: 0,
  z: 0,
  yaw: 0,
  speedMps: 18,
  s: 0,
  lateral: 1.5,
  headingError: 0.08,
  steerAngle: 0
};

const lane: LaneInfo = { index: 0, center: 0, error: 1.5 };

describe("ADAS controllers", () => {
  it("accelerates when below ACC set speed and brakes when above it", () => {
    expect(computeAccPedals(10, 20, 0).accelerator).toBeGreaterThan(0);
    expect(computeAccPedals(24, 18, 0).brake).toBeGreaterThan(0);
  });

  it("lane centering steers back toward the lane center", () => {
    expect(computeLaneCenterSteer(pose, lane, "l2")).toBeLessThan(0);
    expect(Math.abs(computeLaneCenterSteer(pose, lane, "l3"))).toBeGreaterThan(Math.abs(computeLaneCenterSteer(pose, lane, "l2")));
  });

  it("merges driver and active ADAS controls into normalized vehicle controls", () => {
    const adas: AdasState = { accActive: true, lcaActive: true, autoArmed: false, setSpeedMps: 22, assistSteerAngle: 0 };
    const controls = mergeControls({ steer: 0.2, accelerator: 0, brake: 0 }, adas, pose, lane, "l3");
    expect(controls.accelerator).toBeGreaterThan(0);
    expect(controls.steer).toBeGreaterThanOrEqual(-1);
    expect(controls.steer).toBeLessThanOrEqual(1);
  });

  it("lets driver accelerator temporarily override ACC without disabling speed recovery", () => {
    const adas: AdasState = { accActive: true, lcaActive: false, autoArmed: false, setSpeedMps: 12, assistSteerAngle: 0 };
    const override = mergeControls({ steer: 0, accelerator: 0.85, brake: 0 }, adas, pose, lane, "l2");
    expect(override.accelerator).toBeCloseTo(0.85);
    expect(override.brake).toBe(0);
    expect(adas.accActive).toBe(true);

    const recovered = mergeControls({ steer: 0, accelerator: 0, brake: 0 }, adas, pose, lane, "l2");
    expect(recovered.accelerator).toBe(0);
    expect(recovered.brake).toBeGreaterThan(0);
    expect(adas.accActive).toBe(true);
  });

  it("keeps LCA steering while driver accelerator overrides ACC", () => {
    const adas: AdasState = { accActive: true, lcaActive: true, autoArmed: false, setSpeedMps: 12, assistSteerAngle: 0 };
    const controls = mergeControls({ steer: 0, accelerator: 1, brake: 0 }, adas, pose, lane, "l3");
    expect(controls.accelerator).toBe(1);
    expect(controls.brake).toBe(0);
    expect(Math.abs(controls.steer)).toBeGreaterThan(0);
    expect(adas.accActive).toBe(true);
    expect(adas.lcaActive).toBe(true);
  });

  it("keeps the v5 speed-dependent manual steering shape", () => {
    expect(manualSteerLimit(0)).toBeCloseTo(0.52);
    expect(manualSteerLimit(35.8)).toBeLessThan(0.2);
  });
});
