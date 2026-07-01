import type { SceneConfig, SceneKey } from "./types";

export const VERSION = "6.0.0";
export const MPH_PER_MPS = 2.2369362921;
export const MPS_PER_MPH = 1 / MPH_PER_MPS;

export const SCENES: Record<SceneKey, SceneConfig> = {
  unmapped: {
    label: "UNMAPPED",
    lanes: 1,
    curveAmp: 11.5,
    trees: 3.84,
    buildings: 0,
    city: 0,
    median: 0.8,
    guardrailDistance: 10.7,
    forest: 1,
    crosswalks: 0.85,
    trafficLights: 0,
    buildingScale: 0,
    buildingSetback: 16.0,
    skylineDensity: 0
  },
  l2: {
    label: "L2 HIGHWAY",
    lanes: 2,
    curveAmp: 5.4,
    trees: 0.22,
    buildings: 0.28,
    city: 0.28,
    median: 4.1,
    guardrailDistance: 4.5,
    forest: 0.02,
    crosswalks: 0,
    trafficLights: 0.12,
    buildingScale: 0.45,
    buildingSetback: 8.0,
    skylineDensity: 0
  },
  l3: {
    label: "L3 HIGHWAY",
    lanes: 3,
    curveAmp: 2.1,
    trees: 0,
    buildings: 0.92,
    city: 0.18,
    median: 5.2,
    guardrailDistance: 5.25,
    forest: 0,
    crosswalks: 0,
    trafficLights: 0,
    buildingScale: 2.9,
    buildingSetback: 80.0,
    skylineDensity: 1.0
  }
};

export const config = {
  laneWidth: 5.4,
  shoulderWidth: 2.4,
  grassWidth: 5.5,
  vehicleWidth: 1.82,
  vehicleLength: 4.6,
  tireTrack: 1.58,
  wheelbase: 2.7,
  pedestrianHitRadius: 0.5,
  maxSpeedMps: 80 * MPS_PER_MPH,
  routeWaveMeters: 360,
  driverSteerGain: 0.72,
  driverSteerExponent: 1.22,
  lowSpeedSteerRad: 0.52,
  highSpeedSteerRad: 0.115,
  maxSteerRad: 0.52,
  steeringPointsPerSecond: 10,
  offRoadPenaltyPerSecond: 10,
  crashPenalty: 200,
  transitionMs: 10000,
  fixedHz: 60,
  stateBroadcastHz: 10,
  sampleHz: 10
} as const;
