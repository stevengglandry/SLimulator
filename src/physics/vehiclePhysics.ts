import { Euler, Quaternion, Vector3 } from "three";
import { config } from "../game/config";
import { RoadModel } from "../game/route";
import type { AppliedControls, VehiclePose } from "../game/types";
import { clamp, normalizeAngle } from "../shared/math";

const LOCAL_FORWARD = new Vector3(-1, 0, 0);
const WHEEL_RADIUS_M = 0.36;
const WHEEL_TRACK_HALF_M = 0.82;
const FRONT_AXLE_X_M = -1.28;
const REAR_AXLE_X_M = 1.22;
const CHASSIS_Y_M = 0.84;
const ENGINE_ACCEL_MPS2 = 7.4;
const BRAKE_DECEL_MPS2 = 12.5;
const ROLLING_DRAG_MPS2 = 0.18;
const AERO_DRAG = 0.014;
const STEER_RESPONSE = 0.42;
const HEADING_DAMPING = 0.34;
const REVERSE_ACCEL_MPS2 = 1.2;

export interface WheelVisualState {
  position: Vector3;
  steering: number;
  rotation: number;
  suspension: number;
  radius: number;
}

type VehicleState = {
  s: number;
  lateral: number;
  headingError: number;
  speedMps: number;
  steerAngle: number;
  wheelSpin: number;
};

export class VehiclePhysics {
  readonly fixedDt = 1 / config.fixedHz;

  private readonly wheelPositions = [
    new Vector3(FRONT_AXLE_X_M, -0.25, -WHEEL_TRACK_HALF_M),
    new Vector3(FRONT_AXLE_X_M, -0.25, WHEEL_TRACK_HALF_M),
    new Vector3(REAR_AXLE_X_M, -0.25, -WHEEL_TRACK_HALF_M),
    new Vector3(REAR_AXLE_X_M, -0.25, WHEEL_TRACK_HALF_M)
  ];
  private readonly cachedQuaternion = new Quaternion();
  private state: VehicleState = {
    s: 0,
    lateral: config.laneWidth / 2,
    headingError: 0,
    speedMps: 0,
    steerAngle: 0,
    wheelSpin: 0
  };
  private lastControls: AppliedControls = { steer: 0, accelerator: 0, brake: 0 };
  private lastPose: VehiclePose | null = null;
  private lastGuardrailContact: "left" | "right" | null = null;

  private constructor() {}

  static async create(): Promise<VehiclePhysics> {
    return new VehiclePhysics();
  }

  dispose(): void {
    // No external physics resources are held by the deterministic model.
  }

  resetToRoad(road: RoadModel, s: number, lateral: number, speedMps = 0): void {
    this.state = {
      s: Math.max(0, s),
      lateral,
      headingError: 0,
      speedMps: clamp(speedMps, 0, config.maxSpeedMps),
      steerAngle: 0,
      wheelSpin: 0
    };
    this.lastControls = { steer: 0, accelerator: 0, brake: 0 };
    this.lastGuardrailContact = null;
    this.lastPose = this.computePose(road);
  }

  step(road: RoadModel, controls: AppliedControls): VehiclePose {
    const dt = this.fixedDt;
    const state = this.state;
    const steerTarget = clamp(controls.steer, -1, 1) * config.maxSteerRad;
    state.steerAngle += (steerTarget - state.steerAngle) * STEER_RESPONSE;

    const speedRatio = clamp(state.speedMps / config.maxSpeedMps, 0, 1);
    const engine = controls.accelerator * ENGINE_ACCEL_MPS2 * (1 - speedRatio * 0.76);
    const braking = controls.brake * BRAKE_DECEL_MPS2;
    const drag = ROLLING_DRAG_MPS2 + state.speedMps * state.speedMps * AERO_DRAG;
    let acceleration = engine - braking - drag;
    if (state.speedMps <= 0.08 && controls.brake > 0.85 && controls.accelerator < 0.05) {
      acceleration = -REVERSE_ACCEL_MPS2;
    }

    state.speedMps = clamp(state.speedMps + acceleration * dt, 0, config.maxSpeedMps);
    const frame = road.frameAt(state.s);
    const curvature = frame.curvature;
    const sDot = Math.max(0, state.speedMps * Math.cos(state.headingError)) / Math.max(0.62, 1 - curvature * state.lateral);
    const lateralDot = state.speedMps * Math.sin(state.headingError);
    const yawRate = state.speedMps / config.wheelbase * Math.tan(state.steerAngle);

    state.s = Math.max(0, state.s + sDot * dt);
    state.lateral += lateralDot * dt;
    state.headingError = normalizeAngle(state.headingError + (yawRate - curvature * sDot) * dt);
    state.headingError -= state.headingError * HEADING_DAMPING * dt * clamp(1 - Math.abs(controls.steer), 0, 1);
    state.wheelSpin += state.speedMps * dt / WHEEL_RADIUS_M;

    this.lastControls = { ...controls };
    this.lastPose = this.computePose(road);
    this.lastGuardrailContact = this.guardrailContactAt(road, this.lastPose);
    return this.lastPose;
  }

  pose(road: RoadModel): VehiclePose {
    this.lastPose = this.computePose(road);
    this.lastGuardrailContact = this.guardrailContactAt(road, this.lastPose);
    return this.lastPose;
  }

  wheelVisuals(): WheelVisualState[] {
    return this.wheelPositions.map((position, index) => ({
      position,
      steering: index < 2 ? -this.state.steerAngle : 0,
      rotation: this.state.wheelSpin,
      suspension: 0,
      radius: WHEEL_RADIUS_M
    }));
  }

  chassisQuaternion(): Quaternion {
    return this.cachedQuaternion;
  }

  controls(): AppliedControls {
    return { ...this.lastControls };
  }

  guardrailContactSide(): "left" | "right" | null {
    return this.lastGuardrailContact;
  }

  private computePose(road: RoadModel): VehiclePose {
    const state = this.state;
    const world = road.worldFromRoad(state.s, state.lateral, CHASSIS_Y_M);
    const yaw = normalizeAngle(world.heading + state.headingError);
    this.cachedQuaternion.copy(quaternionFromRoadHeading(yaw));
    return {
      x: world.x,
      y: world.y,
      z: world.z,
      yaw,
      speedMps: state.speedMps,
      s: state.s,
      lateral: state.lateral,
      headingError: state.headingError,
      steerAngle: state.steerAngle
    };
  }

  private guardrailContactAt(road: RoadModel, pose: VehiclePose): "left" | "right" | null {
    const bounds = road.boundsAt(pose.s);
    const halfWidth = config.vehicleWidth / 2;
    if (pose.lateral - halfWidth <= bounds.leftWall) return "left";
    if (pose.lateral + halfWidth >= bounds.rightWall) return "right";
    return null;
  }
}

export function quaternionFromRoadHeading(heading: number): Quaternion {
  return new Quaternion().setFromEuler(new Euler(0, -Math.PI / 2 - heading, 0, "YXZ"));
}

export function headingFromRotation(rotation: { x: number; y: number; z: number; w: number }): number {
  const forward = LOCAL_FORWARD.clone().applyQuaternion(new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
  return Math.atan2(forward.x, -forward.z);
}

export function forwardFromHeading(heading: number): Vector3 {
  return new Vector3(Math.sin(heading), 0, -Math.cos(heading));
}
