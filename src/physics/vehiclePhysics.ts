import RAPIER, { type Collider, type DynamicRayCastVehicleController, type RigidBody, type World } from "@dimforge/rapier3d-compat";
import { Euler, Quaternion, Vector3 } from "three";
import { config } from "../game/config";
import { RoadModel } from "../game/route";
import type { AppliedControls, VehiclePose } from "../game/types";
import { clamp } from "../shared/math";

const LOCAL_FORWARD = new Vector3(-1, 0, 0);
const LOCAL_WHEEL_AXLE = new Vector3(0, 0, -1);
const LOCAL_SUSPENSION = new Vector3(0, -1, 0);
const WORLD_UP = new Vector3(0, 1, 0);
const MAX_WALL_COLLIDER_AGE_M = 24;
type WallCollider = { collider: Collider; side: "left" | "right" };

export interface WheelVisualState {
  position: Vector3;
  steering: number;
  rotation: number;
  suspension: number;
  radius: number;
}

export class VehiclePhysics {
  readonly world: World;
  readonly chassis: RigidBody;
  readonly controller: DynamicRayCastVehicleController;
  readonly fixedDt = 1 / config.fixedHz;

  private readonly groundBody: RigidBody;
  private readonly wallBody: RigidBody;
  private readonly chassisCollider: Collider;
  private readonly wallColliders: WallCollider[] = [];
  private lastColliderBase = Number.NaN;
  private currentSteering = 0;
  private lastControls: AppliedControls = { steer: 0, accelerator: 0, brake: 0 };

  private constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = this.fixedDt;

    this.groundBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(900, 0.08, 4000).setTranslation(0, -0.12, -1500).setFriction(1.45),
      this.groundBody
    );
    this.wallBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed());

    const spawnRot = quaternionFromRoadHeading(0);
    this.chassis = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0, 0.84, 0)
        .setRotation(spawnRot)
        .setLinearDamping(0.12)
        .setAngularDamping(1.5)
        .setCanSleep(false)
    );
    this.chassis.setAdditionalMassProperties(
      1150,
      { x: 0.0, y: -0.42, z: 0.0 },
      { x: 1800, y: 2200, z: 600 },
      { x: 0.0, y: 0.0, z: 0.0, w: 1.0 },
      true
    );
    this.chassisCollider = this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(1.0, 0.33, 0.46).setTranslation(-0.06, 0, 0).setFriction(0.9),
      this.chassis
    );

    this.controller = this.world.createVehicleController(this.chassis);
    this.controller.indexUpAxis = 1;
    this.controller.setIndexForwardAxis = 0;
    this.addWheels();
    this.resetToRoad(new RoadModel(1), 0, config.laneWidth / 2, 0);
  }

  static async create(): Promise<VehiclePhysics> {
    await RAPIER.init();
    return new VehiclePhysics();
  }

  dispose(): void {
    this.world.removeVehicleController(this.controller);
  }

  resetToRoad(road: RoadModel, s: number, lateral: number, speedMps = 0): void {
    const frame = road.worldFromRoad(Math.max(0, s), lateral, 0.84);
    const rotation = quaternionFromRoadHeading(frame.heading);
    this.chassis.setTranslation({ x: frame.x, y: frame.y, z: frame.z }, true);
    this.chassis.setRotation(rotation, true);
    const forward = forwardFromHeading(frame.heading).multiplyScalar(speedMps);
    this.chassis.setLinvel({ x: forward.x, y: 0, z: forward.z }, true);
    this.chassis.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.currentSteering = 0;
    this.lastControls = { steer: 0, accelerator: 0, brake: 0 };
    this.syncRoadColliders(road, s, true);
  }

  step(road: RoadModel, controls: AppliedControls): VehiclePose {
    const poseBefore = this.pose(road);
    this.syncRoadColliders(road, poseBefore.s);
    this.applyControls(controls);

    // Keep the ground collider underneath the chassis (infinite ground plane)
    const translation = this.chassis.translation();
    this.groundBody.setTranslation({ x: translation.x, y: -0.12, z: translation.z }, true);

    // Dynamic anti-roll stabilizer: leveling torque proportional to tilt angle with damping
    const rot = this.chassis.rotation();
    const chassisQuat = new Quaternion(rot.x, rot.y, rot.z, rot.w);
    const up = new Vector3(0, 1, 0).applyQuaternion(chassisQuat);
    const worldUp = new Vector3(0, 1, 0);
    const tiltAxis = new Vector3().crossVectors(up, worldUp);
    const tiltAngle = Math.asin(clamp(tiltAxis.length(), -1, 1));
    if (tiltAngle > 0.01) {
      tiltAxis.normalize();
      const angvel = this.chassis.angvel();
      const damping = new Vector3(angvel.x, angvel.y, angvel.z).multiplyScalar(-0.4);
      const restoring = tiltAxis.multiplyScalar(tiltAngle * 65.0);
      const netTorque = restoring.add(damping);
      this.chassis.addTorque({ x: netTorque.x, y: netTorque.y, z: netTorque.z }, true);
    }

    this.controller.updateVehicle(this.fixedDt);
    this.world.step();
    
    // Kinematic snapping disabled for dynamic physics:
    // this.applyKinematicRoadMotion(road, controls);
    
    this.enforceSpeedLimit();
    this.stabilizeAtRest(road, controls);
    return this.pose(road);
  }

  pose(road: RoadModel): VehiclePose {
    const translation = this.chassis.translation();
    const linvel = this.chassis.linvel();
    const yaw = headingFromRotation(this.chassis.rotation());
    const roadPoint = road.roadFromWorld(translation.x, translation.z);
    return {
      x: translation.x,
      y: translation.y,
      z: translation.z,
      yaw,
      speedMps: Math.hypot(linvel.x, linvel.z),
      s: roadPoint.s,
      lateral: roadPoint.lateral,
      headingError: road.normalizeHeadingError(yaw, roadPoint.s),
      steerAngle: this.currentSteering
    };
  }

  wheelVisuals(): WheelVisualState[] {
    const wheels: WheelVisualState[] = [];
    for (let i = 0; i < 4; i++) {
      const connection = this.controller.wheelChassisConnectionPointCs(i);
      const suspension = this.controller.wheelSuspensionLength(i) ?? 0;
      const base = connection ? new Vector3(connection.x, connection.y, connection.z) : new Vector3();
      base.y -= suspension;
      const controllerSteering = this.controller.wheelSteering(i) ?? 0;
      wheels.push({
        position: base,
        steering: i < 2 ? -controllerSteering : 0,
        rotation: this.controller.wheelRotation(i) ?? 0,
        suspension,
        radius: this.controller.wheelRadius(i) ?? 0.36
      });
    }
    return wheels;
  }

  chassisQuaternion(): Quaternion {
    const rot = this.chassis.rotation();
    return new Quaternion(rot.x, rot.y, rot.z, rot.w);
  }

  controls(): AppliedControls {
    return { ...this.lastControls };
  }

  guardrailContactSide(): "left" | "right" | null {
    let side: "left" | "right" | null = null;
    this.world.contactPairsWith(this.chassisCollider, (other) => {
      const wall = this.wallColliders.find((item) => item.collider.handle === other.handle);
      if (wall) side = wall.side;
    });
    return side;
  }

  private addWheels(): void {
    const wheelInfo = {
      axleCs: LOCAL_WHEEL_AXLE,
      suspensionRestLength: 0.34,
      suspensionStiffness: 115,
      maxSuspensionTravel: 0.62,
      frictionSlip: 2.2,
      sideFrictionStiffness: 5.5,
      radius: 0.36
    };
    const track = 0.82;
    const front = -1.28;
    const rear = 1.22;
    const wheelPositions = [
      new Vector3(front, -0.25, -track),
      new Vector3(front, -0.25, track),
      new Vector3(rear, -0.25, -track),
      new Vector3(rear, -0.25, track)
    ];
    for (const position of wheelPositions) {
      this.controller.addWheel(position, LOCAL_SUSPENSION, wheelInfo.axleCs, wheelInfo.suspensionRestLength, wheelInfo.radius);
      const index = this.controller.numWheels() - 1;
      this.controller.setWheelSuspensionStiffness(index, wheelInfo.suspensionStiffness);
      this.controller.setWheelMaxSuspensionTravel(index, wheelInfo.maxSuspensionTravel);
      this.controller.setWheelFrictionSlip(index, wheelInfo.frictionSlip);
      this.controller.setWheelSideFrictionStiffness(index, wheelInfo.sideFrictionStiffness);
      this.controller.setWheelMaxSuspensionForce(index, 22000);
      this.controller.setWheelSuspensionCompression(index, 6.2);
      this.controller.setWheelSuspensionRelaxation(index, 8.5);
    }
  }

  private applyControls(controls: AppliedControls): void {
    const steerTarget = clamp(controls.steer, -1, 1) * config.maxSteerRad;
    this.currentSteering += (steerTarget - this.currentSteering) * 0.46;
    const rapierSteering = -this.currentSteering;

    const speed = Math.hypot(this.chassis.linvel().x, this.chassis.linvel().z);
    const speedRatio = clamp(speed / config.maxSpeedMps, 0, 1);
    const engineForce = controls.accelerator * 4200 * (1 - speedRatio * 0.68);
    const reverseForce = controls.brake > 0.85 && speed < 0.6 ? -220 : 0;
    const brakeForce = controls.brake * 165;

    let steerLeft = 0;
    let steerRight = 0;
    if (rapierSteering !== 0) {
      const L = 2.50; // Wheelbase: distance between front and rear axles
      const halfTrack = 0.82; // Half track width
      const term = (halfTrack / L) * Math.tan(Math.abs(rapierSteering));
      const insideAngle = Math.sign(rapierSteering) * Math.atan(Math.tan(Math.abs(rapierSteering)) / (1 - term));
      const outsideAngle = Math.sign(rapierSteering) * Math.atan(Math.tan(Math.abs(rapierSteering)) / (1 + term));
      
      if (rapierSteering > 0) { // Left turn
        steerLeft = insideAngle;
        steerRight = outsideAngle;
      } else { // Right turn
        steerLeft = outsideAngle;
        steerRight = insideAngle;
      }
    }

    this.controller.setWheelSteering(0, steerLeft);
    this.controller.setWheelSteering(1, steerRight);
    this.controller.setWheelSteering(2, 0);
    this.controller.setWheelSteering(3, 0);

    this.controller.setWheelEngineForce(0, engineForce + reverseForce);
    this.controller.setWheelEngineForce(1, engineForce + reverseForce);
    this.controller.setWheelEngineForce(2, engineForce * 0.32 + reverseForce);
    this.controller.setWheelEngineForce(3, engineForce * 0.32 + reverseForce);

    for (let i = 0; i < 4; i++) this.controller.setWheelBrake(i, brakeForce);
    this.lastControls = { ...controls };
  }

  // applyKinematicRoadMotion is removed to support true dynamic physics.

  private enforceSpeedLimit(): void {
    const velocity = this.chassis.linvel();
    const planar = Math.hypot(velocity.x, velocity.z);
    if (planar <= config.maxSpeedMps) return;
    const scale = config.maxSpeedMps / planar;
    this.chassis.setLinvel({ x: velocity.x * scale, y: velocity.y, z: velocity.z * scale }, true);
  }

  private stabilizeAtRest(road: RoadModel, controls: AppliedControls): void {
    const driverActive = Math.abs(controls.steer) > 0.02 || controls.accelerator > 0.02 || controls.brake > 0.02;
    const velocity = this.chassis.linvel();
    const planar = Math.hypot(velocity.x, velocity.z);
    const spin = this.chassis.angvel();
    const angular = Math.hypot(spin.x, spin.y, spin.z);
    if (driverActive || planar > 0.22 || angular > 0.08) return;

    const pose = this.pose(road);
    const lane = road.nearestLane(pose.lateral);
    const snapped = Math.abs(pose.lateral - lane.center) < 0.04 ? lane.center : pose.lateral;
    const roadPoint = road.worldFromRoad(pose.s, snapped, 0.84);
    this.chassis.setTranslation({ x: roadPoint.x, y: roadPoint.y, z: roadPoint.z }, true);
    this.chassis.setRotation(quaternionFromRoadHeading(roadPoint.heading), true);
    this.chassis.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.chassis.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.currentSteering *= 0.65;
  }

  private syncRoadColliders(road: RoadModel, s: number, force = false): void {
    const base = Math.floor(s / MAX_WALL_COLLIDER_AGE_M) * MAX_WALL_COLLIDER_AGE_M;
    if (!force && base === this.lastColliderBase) return;
    this.lastColliderBase = base;
    for (const wall of this.wallColliders.splice(0)) this.world.removeCollider(wall.collider, true);

    const step = 14;
    const start = Math.max(0, base - 70);
    const end = base + 260;
    for (let segmentS = start; segmentS < end; segmentS += step) {
      const mid = segmentS + step / 2;
      const frame = road.frameAt(mid);
      const bounds = road.boundsAt(mid);
      for (const side of ["left", "right"] as const) {
        const lateral = side === "left" ? bounds.leftWall : bounds.rightWall;
        const world = road.worldFromRoad(mid, lateral, 0.46);
        const rot = new Quaternion().setFromAxisAngle(WORLD_UP, Math.PI + frame.heading);
        const desc = RAPIER.ColliderDesc.cuboid(0.16, 0.46, step * 0.56)
          .setTranslation(world.x, world.y, world.z)
          .setRotation(rot)
          .setFriction(0.8);
        this.wallColliders.push({ collider: this.world.createCollider(desc, this.wallBody), side });
      }
    }
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
