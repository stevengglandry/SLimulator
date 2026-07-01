import { describe, expect, it } from "vitest";
import { VERSION } from "./config";
import { createLogText } from "./logging";
import type { SimSnapshot } from "./types";

describe("createLogText", () => {
  it("keeps the public export fields", () => {
    const snapshot = {
      version: VERSION,
      session: { subId: "sub-1", started: true, status: "running", elapsed: 12, startedAt: "now", seed: 1 },
      inputSource: "local",
      vehicle: {
        speedMps: 4,
        speedMph: 8.9,
        roadPositionM: 20,
        distanceM: 20,
        lateralM: 0,
        headingErrorRad: 0,
        steerAngleRad: 0,
        controls: { steer: 0, accelerator: 0, brake: 0 },
        pose: { x: 0, y: 0, z: 0, yaw: 0, speedMps: 4, s: 20, lateral: 0, headingError: 0, steerAngle: 0 },
        crashReset: null
      },
      road: {
        scene: "unmapped",
        requestedScene: "unmapped",
        lanesPerDirection: 1,
        transition: null,
        queue: [],
        seed: 1,
        bounds: { laneCount: 1, laneFloat: 1, leftEdge: -1, rightEdge: 1, leftWall: -4, rightWall: 4, roadWidth: 2, medianWidth: 0, laneCenters: [0] },
        lane: { index: 0, center: 0, error: 0 }
      },
      adas: { accActive: false, lcaActive: false, autoArmed: false, setSpeedMps: 0, assistSteerAngle: 0, mode: "manual", setSpeedMph: 0 },
      metrics: {
        steeringPoints: 2,
        offRoadPenalty: 1,
        offRoadSeconds: 0.1,
        crashCount: 0,
        laneChanges: 0,
        sdlp: 0,
        sdlpN: 0,
        sdlpMean: 0,
        sdlpM2: 0,
        timeByMode: { manual: 12, acc: 0, l2: 0, l3: 0 },
        alertCounts: { earcon: 0, haptic: 0 },
        totalScore: 1,
        crashPenaltyTotal: 0
      },
      crashes: [],
      trials: [],
      dicMessage: "READY"
    } satisfies SimSnapshot;

    const text = createLogText(snapshot);
    expect(text).toContain("SLimulator Driving Performance Log");
    expect(text).toContain("SubID: sub-1");
    expect(text).toContain("Total score: 1.0");
    expect(text).toContain("Crashes");
  });
});
