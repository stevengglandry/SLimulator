import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { config, MPS_PER_MPH } from "./config";
import { Simulator } from "./simulator";

describe("Simulator ADAS activation", () => {
  beforeEach(() => {
    vi.stubGlobal("window", new EventTarget());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets ACC when LCA is requested while armed at a standstill", async () => {
    const simulator = await Simulator.create(12);

    simulator.toggleLCA();

    expect(simulator.adas.autoArmed).toBe(true);
    expect(simulator.adas.lcaActive).toBe(false);
    expect(simulator.adas.accActive).toBe(true);
    expect(simulator.adas.setSpeedMps).toBeCloseTo(15 * MPS_PER_MPH);
  });

  it("arms LCA and keeps ACC set while a highway transition is underway", async () => {
    const simulator = await Simulator.create(13);
    simulator.requestScene("l2");

    simulator.toggleLCA();

    expect(simulator.adas.lcaActive).toBe(false);
    expect(simulator.adas.autoArmed).toBe(true);
    expect(simulator.adas.accActive).toBe(true);
    expect(simulator.adas.setSpeedMps).toBeCloseTo(15 * MPS_PER_MPH);
    expect(simulator.dicMessage).toBe("LCA ARMED - ACC SET");
  });

  it.each(["l2", "l3"] as const)("auto-activates armed %s when its highway transition completes", async (scene) => {
    const simulator = await Simulator.create(scene === "l2" ? 14 : 15);
    simulator.requestScene(scene);
    simulator.toggleLCA();

    const transition = simulator.road.transition;
    expect(transition).not.toBeNull();
    simulator.physics.resetToRoad(simulator.road, transition!.lockS + 1, config.laneWidth * 0.5, 18);
    simulator.update(simulator.physics.fixedDt * 1.1, { steer: 0, accelerator: 0, brake: 0 });

    expect(simulator.road.scene).toBe(scene);
    expect(simulator.adas.accActive).toBe(true);
    expect(simulator.adas.lcaActive).toBe(true);
    expect(simulator.adas.autoArmed).toBe(false);
    expect(simulator.mode()).toBe(scene);
  });
});
