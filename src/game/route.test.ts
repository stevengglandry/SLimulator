import { describe, expect, it } from "vitest";
import { config } from "./config";
import { RoadModel } from "./route";

describe("RoadModel", () => {
  it("streams requested scenes from ahead and locks after the handoff distance", () => {
    const road = new RoadModel(123);
    expect(road.laneCount()).toBe(1);
    road.requestScene("l3", undefined, 100);
    expect(road.transition?.originS).toBe(100);
    expect(road.scenerySceneAt(120)).toBe("unmapped");
    expect(road.scenerySceneAt(100 + config.sceneTransitionLeadM + 1)).toBe("l3");
    expect(road.laneFloat(120)).toBe(1);
    expect(road.laneFloat(100 + config.sceneTransitionLeadM + config.sceneTransitionTaperM * 0.5)).toBeGreaterThan(1);
    expect(road.laneFloat(100 + config.sceneTransitionLeadM + config.sceneTransitionTaperM * 0.5)).toBeLessThan(3);
    road.update(1, 100 + config.sceneTransitionLeadM + config.sceneTransitionTaperM - 1);
    expect(road.scene).toBe("unmapped");
    road.update(1, 100 + config.sceneTransitionLeadM + config.sceneTransitionTaperM + 1);
    expect(road.scene).toBe("l3");
    expect(road.laneCount()).toBe(3);
  });

  it("returns symmetric lane centers and wall bounds", () => {
    const road = new RoadModel(5);
    road.reset("l2");
    const bounds = road.boundsAt(0);
    expect(bounds.laneCenters[0]).toBeCloseTo(config.laneWidth / 2);
    expect(bounds.laneCenters[1]).toBeCloseTo(config.laneWidth * 1.5);
    expect(bounds.leftWall).toBeLessThan(bounds.leftEdge);
    expect(bounds.rightWall).toBeGreaterThan(bounds.rightEdge);
  });

  it("ignores scene requests while a transition is active", () => {
    const road = new RoadModel(9);
    expect(road.requestScene("l2", undefined, 50)).toBe("started");
    expect(road.requestScene("l3", undefined, 60)).toBe("ignored");
    expect(road.transition?.to).toBe("l2");

    road.update(1, 50 + config.sceneTransitionLeadM + config.sceneTransitionTaperM + 1);
    expect(road.scene).toBe("l2");
    expect(road.transition).toBeNull();
  });

  it("round-trips world and road coordinates near the route", () => {
    const road = new RoadModel(77);
    const world = road.worldFromRoad(120, 2.2, 0);
    const local = road.roadFromWorld(world.x, world.z);
    expect(local.s).toBeCloseTo(120, 0);
    expect(local.lateral).toBeCloseTo(2.2, 1);
  });
});
