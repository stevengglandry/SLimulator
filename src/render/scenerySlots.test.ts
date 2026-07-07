import { describe, expect, it } from "vitest";
import { SCENES } from "../game/config";
import { roadsideSlotForScene, roadsideVariantFor, sceneBoundsFor } from "./scenerySlots";

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

});
