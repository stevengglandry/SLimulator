import { describe, expect, it } from "vitest";
import { config } from "../game/config";
import { RoadModel } from "../game/route";
import { VehiclePhysics } from "./vehiclePhysics";

async function makePhysics(scene: "unmapped" | "l2" | "l3" = "unmapped"): Promise<{ road: RoadModel; physics: VehiclePhysics }> {
  const road = new RoadModel(42);
  road.reset(scene);
  const physics = await VehiclePhysics.create();
  physics.resetToRoad(road, 0, config.laneWidth / 2, 0);
  return { road, physics };
}

describe("VehiclePhysics deterministic model", () => {
  it("accelerates and brakes without Rapier", async () => {
    const { road, physics } = await makePhysics();
    for (let i = 0; i < 120; i++) physics.step(road, { steer: 0, accelerator: 1, brake: 0 });
    const fast = physics.pose(road);
    expect(fast.speedMps).toBeGreaterThan(8);
    expect(fast.s).toBeGreaterThan(6);

    for (let i = 0; i < 120; i++) physics.step(road, { steer: 0, accelerator: 0, brake: 1 });
    expect(physics.pose(road).speedMps).toBeLessThan(fast.speedMps);
  });

  it("clamps speed to the configured maximum", async () => {
    const { road, physics } = await makePhysics();
    physics.resetToRoad(road, 0, config.laneWidth / 2, config.maxSpeedMps * 2);
    expect(physics.pose(road).speedMps).toBeLessThanOrEqual(config.maxSpeedMps);
  });

  it("moves laterally when steering", async () => {
    const { road, physics } = await makePhysics("l2");
    const start = physics.pose(road).lateral;
    for (let i = 0; i < 180; i++) physics.step(road, { steer: 0.65, accelerator: 0.8, brake: 0 });
    expect(Math.abs(physics.pose(road).lateral - start)).toBeGreaterThan(0.25);
    expect(Math.abs(physics.pose(road).steerAngle)).toBeGreaterThan(0.05);
  });

  it("resets cleanly to road coordinates", async () => {
    const { road, physics } = await makePhysics();
    physics.resetToRoad(road, 180, 3.2, 12);
    const pose = physics.pose(road);
    expect(pose.s).toBeCloseTo(180);
    expect(pose.lateral).toBeCloseTo(3.2);
    expect(pose.speedMps).toBeCloseTo(12);
    expect(pose.headingError).toBeCloseTo(0);
  });

  it("keeps finite pose values over long stepping", async () => {
    const { road, physics } = await makePhysics("l3");
    for (let i = 0; i < 900; i++) {
      physics.step(road, {
        steer: Math.sin(i / 24) * 0.8,
        accelerator: i < 650 ? 0.9 : 0,
        brake: i > 700 ? 0.4 : 0
      });
    }
    const pose = physics.pose(road);
    expect(Object.values(pose).every(Number.isFinite)).toBe(true);
  });

  it("allows dynamically tuning parameters", async () => {
    const { physics } = await makePhysics();
    expect(physics.getParams().engineAccel).toBeCloseTo(7.0);
    physics.setParam("engineAccel", 14.5);
    expect(physics.getParams().engineAccel).toBeCloseTo(14.5);
  });
});
