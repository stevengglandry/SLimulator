import { describe, expect, it } from "vitest";
import { SCENES } from "../game/config";
import { OUTER_GROUND_MARGIN_M } from "./roadRibbons";
import { roadsideSlotForScene, roadsideVariantFor, sceneBoundsFor, transitionSignRoadPosition } from "./scenerySlots";

describe("scenery slots", () => {
  it("defines scene speed limits", () => {
    expect(SCENES.unmapped.speedLimitMph).toBe(30);
    expect(SCENES.l2.speedLimitMph).toBe(50);
    expect(SCENES.l3.speedLimitMph).toBe(70);
  });

  it("keeps roadside slots outside scene guardrails", () => {
    for (const scene of ["unmapped", "l2", "l3"] as const) {
      const bounds = sceneBoundsFor(scene);
      for (let anchor = -3; anchor < 12; anchor++) {
        const left = roadsideSlotForScene(scene, anchor, 0, 1234, 12);
        const right = roadsideSlotForScene(scene, anchor, 1, 1234, 12);
        expect(left.lateral).toBeLessThan(bounds.leftWall - 12);
        expect(right.lateral).toBeGreaterThan(bounds.rightWall + 12);
      }
    }
  });

  it("is deterministic for slot and variant selection", () => {
    expect(roadsideSlotForScene("l3", 18, 1, 77)).toEqual(roadsideSlotForScene("l3", 18, 1, 77));
    expect(roadsideVariantFor("l3", 18, 1, 77)).toBe(roadsideVariantFor("l3", 18, 1, 77));
  });

  it("places the transition sign well ahead of the viewer without crossing the taper", () => {
    const transition = { from: "unmapped", to: "l2", progress: 0, originS: 100, taperStartS: 355, lockS: 620 } as const;
    const signS = transitionSignRoadPosition(transition);
    expect(signS).toBeGreaterThan((transition.originS + transition.taperStartS) * 0.5);
    expect(signS).toBeLessThan(transition.taperStartS);
  });

  it("keeps the full L3 building setback over the outer ground", () => {
    const bounds = sceneBoundsFor("l3");
    for (let anchor = 0; anchor < 240; anchor++) {
      for (const sideIndex of [0, 1]) {
        const variant = roadsideVariantFor("l3", anchor, sideIndex, 9970);
        const radius = variant === "bulk" ? 20 : variant === "skyscraper" ? 14 : 8;
        const slot = roadsideSlotForScene("l3", anchor, sideIndex, 9970, radius);
        if (slot.side < 0) expect(slot.lateral - radius).toBeGreaterThan(bounds.leftWall - OUTER_GROUND_MARGIN_M);
        else expect(slot.lateral + radius).toBeLessThan(bounds.rightWall + OUTER_GROUND_MARGIN_M);
      }
    }
  });

});
