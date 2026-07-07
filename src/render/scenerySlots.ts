import { config, SCENES } from "../game/config";
import type { RoadBounds, RoadFrame, SceneKey } from "../game/types";
import { hash01, lerp, TAU } from "../shared/math";

export type RoadsideVariant = "standard" | "shop" | "bulk" | "skyscraper" | "billboard";

export type RoadsideSlot = {
  side: -1 | 1;
  sOffset: number;
  lateral: number;
  clearance: number;
  rotationJitter: number;
  variant: RoadsideVariant;
};

export function sceneBoundsFor(scene: SceneKey): RoadBounds {
  const sceneConfig = SCENES[scene];
  const laneFloat = sceneConfig.lanes;
  const roadWidth = 2 * laneFloat * config.laneWidth;
  const leftEdge = -laneFloat * config.laneWidth;
  const rightEdge = laneFloat * config.laneWidth;
  return {
    laneCount: sceneConfig.lanes,
    laneFloat,
    leftEdge,
    rightEdge,
    leftWall: leftEdge - sceneConfig.guardrailDistance,
    rightWall: rightEdge + sceneConfig.guardrailDistance,
    roadWidth,
    medianWidth: sceneConfig.median,
    laneCenters: Array.from({ length: sceneConfig.lanes }, (_, i) => config.laneWidth * (i + 0.5))
  };
}

export function sceneFrameAt(scene: SceneKey, s: number, seed: number): RoadFrame {
  const amp = SCENES[scene].curveAmp;
  const wave = config.routeWaveMeters;
  const seedPhase = (seed % 4096) / 4096 * TAU;
  const a = s / wave * TAU + seedPhase;
  const b = s / (wave * 0.43) * TAU + seedPhase * 0.37;
  const x = Math.sin(a) * amp + Math.sin(b) * amp * 0.28;
  const dx = Math.cos(a) * (TAU / wave) * amp + Math.cos(b) * (TAU / (wave * 0.43)) * amp * 0.28;
  const ddx = -Math.sin(a) * (TAU / wave) ** 2 * amp - Math.sin(b) * (TAU / (wave * 0.43)) ** 2 * amp * 0.28;
  const heading = Math.atan(dx);
  const curvature = ddx / Math.pow(1 + dx * dx, 1.5);
  const rightX = Math.cos(heading);
  const rightZ = Math.sin(heading);
  return {
    s,
    x,
    z: -s,
    heading,
    curvature,
    rightX,
    rightZ,
    forwardX: -rightZ,
    forwardZ: -rightX
  };
}

export function worldFromSceneRoad(scene: SceneKey, s: number, lateral: number, y: number, seed: number): { x: number; y: number; z: number; heading: number } {
  const frame = sceneFrameAt(scene, s, seed);
  return {
    x: frame.x + frame.rightX * lateral,
    y,
    z: frame.z + frame.rightZ * lateral,
    heading: frame.heading
  };
}

export function roadsideVariantFor(scene: SceneKey, anchor: number, sideIndex: number, seed: number): RoadsideVariant {
  const roll = hash01(seed + anchor * 41.7 + sideIndex * 131.9);
  if (scene === "l3") {
    if (roll > 0.74) return "billboard";
    if (roll > 0.55) return "skyscraper";
    if (roll > 0.42) return "bulk";
    if (roll > 0.28) return "shop";
    return "standard";
  }
  if (scene === "l2") {
    if (roll > 0.92) return "billboard";
    if (roll > 0.72) return "bulk";
    if (roll > 0.42) return "shop";
    return "standard";
  }
  return roll > 0.88 ? "shop" : "standard";
}

export function roadsideSlotForScene(scene: SceneKey, anchor: number, sideIndex: number, seed: number, objectRadiusM = 8): RoadsideSlot {
  const bounds = sceneBoundsFor(scene);
  const side: -1 | 1 = sideIndex ? 1 : -1;
  const clearance = side < 0 ? bounds.leftWall : bounds.rightWall;
  const slotSeed = seed + anchor * 17.31 + sideIndex * 73.7;
  const sceneSetback = SCENES[scene].buildingSetback;
  const minSetback = Math.max(3.5, sceneSetback * 0.38) + objectRadiusM + 2;
  const spread = scene === "l3" ? lerp(24, 86, hash01(slotSeed + 3)) : lerp(8, 34, hash01(slotSeed + 3));
  return {
    side,
    clearance,
    lateral: clearance + side * (minSetback + spread),
    sOffset: (hash01(slotSeed + 7) - 0.5) * 12,
    rotationJitter: (hash01(slotSeed + 11) - 0.5) * 0.32,
    variant: roadsideVariantFor(scene, anchor, sideIndex, seed)
  };
}
