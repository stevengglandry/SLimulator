export type SceneKey = "unmapped" | "l2" | "l3";

export type CameraMode = "cockpit" | "chase" | "debug";

export type RenderQuality = "high" | "perf";

export type DriverInputSource = "local" | "gamepad" | "external";

export interface SceneConfig {
  label: string;
  lanes: number;
  curveAmp: number;
  trees: number;
  buildings: number;
  city: number;
  median: number;
  guardrailDistance: number;
  forest: number;
  crosswalks: number;
  trafficLights: number;
  buildingScale: number;
  buildingSetback: number;
  skylineDensity: number;
  speedLimitMph: number;
}

export interface Controls {
  steer: number;
  accelerator: number;
  brake: number;
  accButton?: boolean;
  lcaButton?: boolean;
}

export interface AppliedControls {
  steer: number;
  accelerator: number;
  brake: number;
}

export interface VehiclePose {
  x: number;
  y: number;
  z: number;
  yaw: number;
  speedMps: number;
  s: number;
  lateral: number;
  headingError: number;
  steerAngle: number;
}

export interface LaneInfo {
  index: number;
  center: number;
  error: number;
}

export interface RoadBounds {
  laneCount: number;
  laneFloat: number;
  leftEdge: number;
  rightEdge: number;
  leftWall: number;
  rightWall: number;
  roadWidth: number;
  medianWidth: number;
  laneCenters: number[];
}

export interface RoadFrame {
  s: number;
  x: number;
  z: number;
  heading: number;
  curvature: number;
  rightX: number;
  rightZ: number;
  forwardX: number;
  forwardZ: number;
}

export interface RoadTransition {
  from: SceneKey;
  to: SceneKey;
  progress: number;
  originS: number;
  taperStartS: number;
  lockS: number;
}

export interface AdasState {
  accActive: boolean;
  lcaActive: boolean;
  autoArmed: boolean;
  setSpeedMps: number;
  assistSteerAngle: number;
}

export interface MetricsState {
  steeringPoints: number;
  offRoadPenalty: number;
  offRoadSeconds: number;
  crashCount: number;
  laneChanges: number;
  sdlp: number;
  sdlpN: number;
  sdlpMean: number;
  sdlpM2: number;
  timeByMode: Record<DriveMode, number>;
  alertCounts: Record<AlertType, number>;
}

export interface SessionState {
  subId: string;
  started: boolean;
  status: "idle" | "running";
  elapsed: number;
  startedAt: string | null;
}

export type DriveMode = "manual" | "acc" | "l2" | "l3";
export type AlertType = "earcon" | "haptic";
export type ExpectedAction = "brake" | "accelerate" | "steerLeft" | "steerRight" | "acc" | "lca";

export interface CrashRecord {
  index: number;
  time: number;
  type: "wall" | "pedestrian";
  side: string;
  zone: string;
  mph: number;
  mode: DriveMode;
  odometer: number;
  lateral: number;
  score: number;
  pedestrian?: {
    id: string;
    segment: number;
    side: string;
    s: number;
    lateral: number;
  };
}

export interface AlertTrial {
  id: string;
  index: number;
  type: AlertType;
  expectedAction: ExpectedAction;
  mode: DriveMode;
  startedAt: number;
  pdt: number | null;
  drt: number | null;
  status: "active" | "complete" | "superseded";
  baseline: AppliedControls;
}

export interface CrashState {
  phase: "braking" | "waiting";
  stoppedFor: number;
}

export interface SimSnapshot {
  version: string;
  session: SessionState & { seed: number };
  inputSource: DriverInputSource;
  vehicle: {
    speedMps: number;
    speedMph: number;
    roadPositionM: number;
    distanceM: number;
    lateralM: number;
    headingErrorRad: number;
    steerAngleRad: number;
    controls: AppliedControls;
    pose: VehiclePose;
    crashReset: CrashState | null;
  };
  road: {
    scene: SceneKey;
    requestedScene: SceneKey;
    lanesPerDirection: number;
    transition: RoadTransition | null;
    queue: Array<{ target: SceneKey }>;
    seed: number;
    bounds: RoadBounds;
    lane: LaneInfo;
    curvePoints?: Array<{ sOffset: number; xOffset: number }>;
  };
  adas: AdasState & {
    mode: DriveMode;
    setSpeedMph: number;
  };
  metrics: MetricsState & {
    totalScore: number;
    crashPenaltyTotal: number;
  };
  crashes: CrashRecord[];
  trials: AlertTrial[];
  dicMessage: string;
}

export interface PedestrianHit {
  id: string;
  segment: number;
  side: string;
  s: number;
  lateral: number;
}
