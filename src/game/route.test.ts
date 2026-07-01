import { describe, expect, it } from "vitest";
import { config } from "./config";
import { RoadModel } from "./route";

describe("RoadModel", () => {
  it("blends lane counts through scene transitions", () => {
    const road = new RoadModel(123);
    expect(road.laneCount()).toBe(1);
    road.requestScene("l3", config.transitionMs);
    road.update(5);
    expect(road.laneFloat()).toBeGreaterThan(1);
    expect(road.laneFloat()).toBeLessThan(3);
    road.update(5);
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

  it("round-trips world and road coordinates near the route", () => {
    const road = new RoadModel(77);
    const world = road.worldFromRoad(120, 2.2, 0);
    const local = road.roadFromWorld(world.x, world.z);
    expect(local.s).toBeCloseTo(120, 0);
    expect(local.lateral).toBeCloseTo(2.2, 1);
  });
});
