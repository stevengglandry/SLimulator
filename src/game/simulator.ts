import { VERSION, config, MPH_PER_MPS, MPS_PER_MPH, SCENES } from "./config";
import { computeAccPedals, mergeControls } from "./controllers";
import { RoadModel } from "./route";
import type {
  AdasState,
  AlertTrial,
  AlertType,
  AppliedControls,
  Controls,
  CrashRecord,
  CrashState,
  DriveMode,
  ExpectedAction,
  MetricsState,
  PedestrianHit,
  SceneKey,
  SessionState,
  SimSnapshot,
  VehiclePose
} from "./types";
import { VehiclePhysics } from "../physics/vehiclePhysics";
import { clamp, lerp, lerpAngle } from "../shared/math";
import { publish } from "../engine/events";

const PED_ANCHOR_SPACING = 18;
const PED_CROSSWALK_SPACING_ANCHORS = 44;
const PED_CROSSWALK_PHASE_ANCHOR = 4;
const PED_VISUAL_S_OFFSET_M = -1.3;
const CRASH_RESET_SECONDS = 3;
const CRASH_WAITING_SPEED_MPS = 0.08;
const GUARDRAIL_HALF_WIDTH_M = 0.16;
const CONTACT_EPSILON_M = 0.03;

function blankMetrics(): MetricsState {
  return {
    steeringPoints: 0,
    offRoadPenalty: 0,
    offRoadSeconds: 0,
    crashCount: 0,
    laneChanges: 0,
    sdlp: 0,
    sdlpN: 0,
    sdlpMean: 0,
    sdlpM2: 0,
    timeByMode: { manual: 0, acc: 0, l2: 0, l3: 0 },
    alertCounts: { earcon: 0, haptic: 0 }
  };
}

export class Simulator {
  readonly road: RoadModel;
  readonly physics: VehiclePhysics;

  inputSource: "local" | "external" = "local";
  externalControls: Controls = { steer: 0, accelerator: 0, brake: 0 };
  session: SessionState = { subId: "", started: false, status: "idle", elapsed: 0, startedAt: null };
  adas: AdasState = { accActive: false, lcaActive: false, autoArmed: false, setSpeedMps: 0, assistSteerAngle: 0 };
  metrics: MetricsState = blankMetrics();
  crashes: CrashRecord[] = [];
  trials: AlertTrial[] = [];
  activeTrial: AlertTrial | null = null;
  crashState: CrashState | null = null;
  dicMessage = "READY - MANUAL";
  dicUntil = 0;

  private fixedAccumulator = 0;
  private currentControls: AppliedControls = { steer: 0, accelerator: 0, brake: 0 };
  private sampleClock = 0;
  private lastLane = 0;
  private laneCandidate: number | null = null;
  private laneCandidateTime = 0;
  private distanceOffset = 0;
  private previousPose: VehiclePose | null = null;
  private currentPose: VehiclePose | null = null;

  private constructor(physics: VehiclePhysics, seed = Date.now() >>> 0) {
    this.physics = physics;
    this.road = new RoadModel(seed);
    this.newSession({ seed });
  }

  static async create(seed = Date.now() >>> 0): Promise<Simulator> {
    const physics = await VehiclePhysics.create();
    return new Simulator(physics, seed);
  }

  newSession({ subId = "", seed = Date.now() >>> 0 }: { subId?: string; seed?: number } = {}): void {
    this.road.reset("unmapped", seed);
    this.session = { subId: String(subId || ""), started: false, status: "idle", elapsed: 0, startedAt: null };
    this.adas = { accActive: false, lcaActive: false, autoArmed: false, setSpeedMps: 0, assistSteerAngle: 0 };
    this.metrics = blankMetrics();
    this.crashes = [];
    this.trials = [];
    this.activeTrial = null;
    this.crashState = null;
    this.currentControls = { steer: 0, accelerator: 0, brake: 0 };
    this.sampleClock = 0;
    this.lastLane = 0;
    this.laneCandidate = null;
    this.laneCandidateTime = 0;
    this.distanceOffset = 0;
    this.dicMessage = "READY - MANUAL";
    this.dicUntil = 0;
    this.fixedAccumulator = 0;
    const bounds = this.road.boundsAt(0);
    const initialLateral = bounds.laneCenters[0] ?? 0;
    this.physics.resetToRoad(this.road, 0, initialLateral, 0);
    const pose = this.physics.pose(this.road);
    this.previousPose = { ...pose };
    this.currentPose = { ...pose };
    publish("session", this.snapshot(), false);
  }

  update(dt: number, localControls: Controls): SimSnapshot {
    const safeDt = clamp(dt, 0, 0.1);
    this.fixedAccumulator += safeDt;
    const fixedDt = this.physics.fixedDt;
    let guard = 0;
    while (this.fixedAccumulator >= fixedDt && guard++ < 8) {
      this.stepFixed(fixedDt, localControls);
      this.fixedAccumulator -= fixedDt;
    }
    const snapshot = this.snapshot(true);
    publish("state", snapshot, false);
    return snapshot;
  }

  setInputSource(source: "local" | "external"): void {
    this.inputSource = source;
    publish("event", { type: "input-source", source }, false);
  }

  setExternalControls(controls: Partial<Controls>): void {
    this.externalControls = {
      steer: clamp(Number(controls.steer ?? this.externalControls.steer) || 0, -1, 1),
      accelerator: clamp(Number(controls.accelerator ?? this.externalControls.accelerator) || 0, 0, 1),
      brake: clamp(Number(controls.brake ?? this.externalControls.brake) || 0, 0, 1)
    };
  }

  requestScene(scene: SceneKey, transitionMs: number = config.transitionMs): void {
    const result = this.road.requestScene(scene, transitionMs);
    if (result === "started") {
      this.setDIC(`TRANSITION - ${SCENES[scene].label}`, 3);
      publish("event", { type: "scene-transition-start", from: this.road.scene, to: scene, durationMs: transitionMs }, false);
    } else if (result === "queued") {
      this.setDIC(`QUEUED - ${SCENES[scene].label}`, 2.4);
      publish("event", { type: "scene-transition-queued", to: scene, queue: [...this.road.queue] }, false);
    }
  }

  toggleACC(): void {
    const pose = this.physics.pose(this.road);
    if (this.adas.accActive) {
      this.adas.accActive = false;
      this.adas.lcaActive = false;
      this.adas.autoArmed = false;
      this.setDIC("ACC OFF", 2);
    } else if (pose.speedMps >= 15 * MPS_PER_MPH) {
      this.adas.accActive = true;
      this.adas.setSpeedMps = pose.speedMps;
      this.setDIC(`ACC SET - ${Math.round(pose.speedMps * MPH_PER_MPS)} MPH`, 2.6);
    } else {
      this.setDIC("ACC UNAVAILABLE", 2);
      publish("event", { type: "acc-rejected", reason: "below-min-speed" }, false);
    }
  }

  toggleLCA(): void {
    const pose = this.physics.pose(this.road);
    if (this.adas.lcaActive) {
      this.adas.lcaActive = false;
      this.adas.autoArmed = false;
      if (this.adas.accActive) this.setDIC("LANE CENTER OFF - ACC", 2.4);
      else this.setDIC("LANE CENTER OFF", 2.4);
      return;
    }
    if (this.road.scene === "unmapped" && !this.road.transition) {
      this.adas.autoArmed = true;
      this.adas.accActive = pose.speedMps >= 15 * MPS_PER_MPH;
      this.adas.setSpeedMps = Math.max(pose.speedMps, 15 * MPS_PER_MPH);
      this.setDIC("LCA ARMED", 2.4);
      return;
    }
    if (this.road.scene === "l2" || this.road.scene === "l3") {
      this.adas.lcaActive = true;
      this.adas.accActive = true;
      this.adas.autoArmed = false;
      this.adas.setSpeedMps = Math.max(pose.speedMps, 15 * MPS_PER_MPH);
      this.setDIC(`${this.road.scene.toUpperCase()} ACTIVE`, 2.4);
      return;
    }
    this.setDIC("LCA UNAVAILABLE", 2);
  }

  triggerAlert({ type = "earcon", expectedAction = "brake", id }: { type?: AlertType; expectedAction?: ExpectedAction; id?: string } = {}): string {
    if (this.activeTrial) this.finishTrial("superseded");
    this.startIfNeeded();
    const trial: AlertTrial = {
      id: id || `trial-${this.trials.length + 1}`,
      index: this.trials.length + 1,
      type,
      expectedAction,
      mode: this.mode(),
      startedAt: this.session.elapsed,
      pdt: null,
      drt: null,
      status: "active",
      baseline: { ...this.currentControls }
    };
    this.activeTrial = trial;
    this.trials.push(trial);
    this.metrics.alertCounts[type]++;
    this.setDIC(`${type === "earcon" ? "AUDITORY" : "HAPTIC"} ALERT - RESPOND`, 3);
    publish("event", { type: "alert-triggered", trial }, false);
    return trial.id;
  }

  snapshot(interpolate = false): SimSnapshot {
    const physicsPose = this.physics.pose(this.road);
    const pose = interpolate ? this.interpolatedPose(physicsPose) : physicsPose;
    const lane = this.road.nearestLane(pose.lateral);
    return {
      version: VERSION,
      session: { ...this.session, seed: this.road.seed },
      inputSource: this.inputSource,
      vehicle: {
        speedMps: pose.speedMps,
        speedMph: pose.speedMps * MPH_PER_MPS,
        roadPositionM: pose.s,
        distanceM: this.distanceOffset + pose.s,
        lateralM: pose.lateral,
        headingErrorRad: pose.headingError,
        steerAngleRad: pose.steerAngle,
        controls: { ...this.currentControls },
        pose,
        crashReset: this.crashState ? { ...this.crashState } : null
      },
      road: {
        scene: this.road.scene,
        requestedScene: this.road.requestedScene(),
        lanesPerDirection: this.road.laneCount(),
        transition: this.road.transition ? { ...this.road.transition } : null,
        queue: this.road.queue.map((item) => ({ ...item })),
        seed: this.road.seed,
        bounds: this.road.boundsAt(pose.s),
        lane,
        curvePoints: Array.from({ length: 9 }, (_, i) => {
          const ds = -10 + i * 5;
          const framePose = this.road.frameAt(pose.s);
          const frameDs = this.road.frameAt(pose.s + ds);
          const dx = frameDs.x - framePose.x;
          const dz = frameDs.z - framePose.z;
          return {
            sOffset: ds,
            xOffset: dx * framePose.rightX + dz * framePose.rightZ
          };
        })
      },
      adas: { ...this.adas, mode: this.mode(), setSpeedMph: this.adas.setSpeedMps * MPH_PER_MPS },
      metrics: {
        ...this.metrics,
        totalScore: this.totalScore(),
        crashPenaltyTotal: this.metrics.crashCount * config.crashPenalty
      },
      crashes: this.crashes.map((x) => ({ ...x })),
      trials: this.trials.map((x) => ({ ...x })),
      dicMessage: this.session.elapsed > this.dicUntil && !this.crashState ? `${this.mode().toUpperCase()} - ${SCENES[this.road.scene].label}` : this.dicMessage
    };
  }

  totalScore(): number {
    return this.metrics.steeringPoints - this.metrics.offRoadPenalty - this.metrics.crashCount * config.crashPenalty;
  }

  mode(): DriveMode {
    if (this.adas.lcaActive && this.road.scene === "l3") return "l3";
    if (this.adas.lcaActive && this.road.scene === "l2") return "l2";
    if (this.adas.accActive) return "acc";
    return "manual";
  }

  private stepFixed(dt: number, localControls: Controls): void {
    const transition = this.road.update(dt);
    if (transition.completed) {
      this.finishSceneTransition(transition.completed.from, transition.completed.to);
    }
    if (transition.started) {
      publish("event", { type: "scene-transition-start", from: this.road.scene, to: transition.started, durationMs: config.transitionMs }, false);
    }

    let driver = this.inputSource === "external" ? { ...this.externalControls } : { ...localControls };
    driver = {
      steer: clamp(Number(driver.steer) || 0, -1, 1),
      accelerator: clamp(Number(driver.accelerator) || 0, 0, 1),
      brake: clamp(Number(driver.brake) || 0, 0, 1)
    };
    if (driver.brake > 0.05) {
      this.adas.accActive = false;
      this.adas.lcaActive = false;
      this.adas.autoArmed = false;
    }
    if (this.meaningful(driver)) this.startIfNeeded();
    if (this.session.started) this.session.elapsed += dt;

    const before = this.physics.pose(this.road);
    const lane = this.road.nearestLane(before.lateral);
    if (this.crashState) driver = { steer: 0, accelerator: 0, brake: 1 };

    if (this.adas.accActive && !this.adas.lcaActive) {
      const pedals = computeAccPedals(before.speedMps, this.adas.setSpeedMps, driver.brake);
      driver.accelerator = pedals.accelerator;
      driver.brake = pedals.brake;
    }
    const applied = this.crashState ? { steer: 0, accelerator: 0, brake: 1 } : mergeControls(driver, this.adas, before, lane, this.road.scene);
    this.currentControls = applied;
    this.previousPose = { ...before };
    const after = this.physics.step(this.road, applied);
    this.noteControlActions(driver);
    this.detectCrashes(before, after);
    this.updateMetrics(dt, after);
    this.updateCrashReset(dt, after);
    this.currentPose = { ...this.physics.pose(this.road) };
  }

  private interpolatedPose(fallback: VehiclePose): VehiclePose {
    if (!this.previousPose || !this.currentPose) return fallback;
    const alpha = clamp(this.fixedAccumulator / this.physics.fixedDt, 0, 1);
    return {
      x: lerp(this.previousPose.x, this.currentPose.x, alpha),
      y: lerp(this.previousPose.y, this.currentPose.y, alpha),
      z: lerp(this.previousPose.z, this.currentPose.z, alpha),
      yaw: lerpAngle(this.previousPose.yaw, this.currentPose.yaw, alpha),
      speedMps: lerp(this.previousPose.speedMps, this.currentPose.speedMps, alpha),
      s: lerp(this.previousPose.s, this.currentPose.s, alpha),
      lateral: lerp(this.previousPose.lateral, this.currentPose.lateral, alpha),
      headingError: lerpAngle(this.previousPose.headingError, this.currentPose.headingError, alpha),
      steerAngle: lerp(this.previousPose.steerAngle, this.currentPose.steerAngle, alpha)
    };
  }

  private finishSceneTransition(from: SceneKey, to: SceneKey): void {
    if (to === "unmapped") {
      if (this.adas.lcaActive) this.adas.autoArmed = true;
      this.adas.lcaActive = false;
    } else if (this.adas.autoArmed) {
      this.adas.lcaActive = true;
      this.adas.accActive = true;
      this.adas.setSpeedMps = Math.max(this.physics.pose(this.road).speedMps, 15 * MPS_PER_MPH);
      this.adas.autoArmed = false;
    }
    const pose = this.physics.pose(this.road);
    const bounds = this.road.boundsAt(pose.s);
    const outOfBounds = pose.lateral < bounds.leftEdge || pose.lateral > bounds.rightEdge;
    if (!this.session.started || pose.speedMps < 2 || outOfBounds) {
      const lane = this.road.nearestLane(pose.lateral);
      this.physics.resetToRoad(this.road, pose.s, lane.center, 0);
      this.currentControls = { steer: 0, accelerator: 0, brake: 0 };
    }
    this.setDIC(`${SCENES[to].label} ACTIVE`, 2.6);
    publish("event", { type: "scene-transition-complete", from, to, mode: this.mode() }, false);
  }

  private updateMetrics(dt: number, after: VehiclePose): void {
    if (!this.session.started) return;
    const mode = this.mode();
    this.metrics.timeByMode[mode] += dt;
    const bounds = this.road.boundsAt(after.s);
    const lane = this.road.nearestLane(after.lateral);
    const leftTire = after.lateral - config.tireTrack / 2;
    const rightTire = after.lateral + config.tireTrack / 2;
    const offroad = leftTire < bounds.leftEdge || rightTire > bounds.rightEdge;
    if (offroad) {
      this.metrics.offRoadSeconds += dt;
      this.metrics.offRoadPenalty += config.offRoadPenaltyPerSecond * dt;
    } else if (after.speedMps > 2) {
      const proximity = clamp(1 - Math.abs(lane.error) / (config.laneWidth / 2), 0, 1);
      this.metrics.steeringPoints += config.steeringPointsPerSecond * proximity * dt;
    }

    this.sampleClock += dt;
    if (this.sampleClock >= 1 / config.sampleHz) {
      this.sampleClock %= 1 / config.sampleHz;
      if (after.speedMps > 2 && !this.crashState) {
        const x = lane.error;
        this.metrics.sdlpN++;
        const delta = x - this.metrics.sdlpMean;
        this.metrics.sdlpMean += delta / this.metrics.sdlpN;
        this.metrics.sdlpM2 += delta * (x - this.metrics.sdlpMean);
        this.metrics.sdlp = this.metrics.sdlpN > 1 ? Math.sqrt(this.metrics.sdlpM2 / (this.metrics.sdlpN - 1)) : 0;
      }
    }

    const currentLane = lane.index;
    if (currentLane !== this.lastLane) {
      if (this.laneCandidate === currentLane) this.laneCandidateTime += dt;
      else {
        this.laneCandidate = currentLane;
        this.laneCandidateTime = 0;
      }
      if (this.laneCandidateTime > 0.55) {
        this.metrics.laneChanges++;
        this.lastLane = currentLane;
        this.laneCandidate = null;
      }
    } else {
      this.laneCandidate = null;
      this.laneCandidateTime = 0;
    }

  }

  private detectCrashes(before: VehiclePose, after: VehiclePose): void {
    if (this.crashState) return;
    const pedestrianHit = this.findPedestrianCollision(before, after);
    if (pedestrianHit) {
      this.crash(pedestrianHit.side, { type: "pedestrian", zone: "Pedestrian crosswalk", pedestrian: pedestrianHit });
      return;
    }

    const guardrailSide = this.physics.guardrailContactSide() ?? this.findGuardrailContact(before, after);
    if (guardrailSide) this.crash(guardrailSide, { type: "wall", zone: "Guard rail" });
  }

  private findGuardrailContact(before: VehiclePose, after: VehiclePose): "left" | "right" | null {
    const samples = 4;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const s = lerp(before.s, after.s, t);
      const lateral = lerp(before.lateral, after.lateral, t);
      const side = this.guardrailContactAt(s, lateral);
      if (side) return side;
    }
    return null;
  }

  private guardrailContactAt(s: number, lateral: number): "left" | "right" | null {
    const bounds = this.road.boundsAt(s);
    const halfWidth = config.vehicleWidth / 2;
    const leftVehicleEdge = lateral - halfWidth;
    const rightVehicleEdge = lateral + halfWidth;
    if (leftVehicleEdge <= bounds.leftWall + GUARDRAIL_HALF_WIDTH_M + CONTACT_EPSILON_M) return "left";
    if (rightVehicleEdge >= bounds.rightWall - GUARDRAIL_HALF_WIDTH_M - CONTACT_EPSILON_M) return "right";
    return null;
  }

  private updateCrashReset(dt: number, pose: VehiclePose): void {
    if (!this.crashState) return;
    this.crashState.stoppedFor += dt;
    this.crashState.phase = pose.speedMps < CRASH_WAITING_SPEED_MPS ? "waiting" : "braking";
    if (this.crashState.stoppedFor >= CRASH_RESET_SECONDS) {
      const lane = this.road.nearestLane(pose.lateral);
      this.physics.resetToRoad(this.road, pose.s, lane.center, 0);
      this.currentControls = { steer: 0, accelerator: 0, brake: 0 };
      this.crashState = null;
      this.setDIC("CONTROL RESTORED", 2.5);
      publish("event", { type: "crash-reset-complete", laneCenter: lane.center }, false);
    }
  }

  private crash(side: string, options: { type: "wall" | "pedestrian"; zone?: string; pedestrian?: PedestrianHit }): void {
    if (this.crashState) return;
    this.startIfNeeded();
    const snapshot = this.snapshot();
    const record: CrashRecord = {
      index: this.crashes.length + 1,
      time: this.session.elapsed,
      type: options.type,
      side,
      zone: options.zone || "Crash boundary wall",
      mph: snapshot.vehicle.speedMph,
      mode: this.mode(),
      odometer: snapshot.vehicle.distanceM,
      lateral: snapshot.vehicle.lateralM,
      score: this.totalScore() - config.crashPenalty
    };
    if (options.pedestrian) record.pedestrian = { ...options.pedestrian };
    this.crashes.push(record);
    this.metrics.crashCount++;
    this.adas.accActive = false;
    this.adas.lcaActive = false;
    this.adas.autoArmed = false;
    this.crashState = { phase: "braking", stoppedFor: 0 };
    this.setDIC(options.type === "pedestrian" ? "PEDESTRIAN CRASH!" : "CRASH!", 10);
    publish("event", { type: "crash", crash: record }, false);
  }

  private findPedestrianCollision(before: VehiclePose, after: VehiclePose): PedestrianHit | null {
    if (this.road.sceneValue("crosswalks") <= 0.3) return null;
    const pedestrianRadius = config.pedestrianHitRadius;
    const halfVehicleLength = config.vehicleLength / 2;
    const halfVehicleWidth = config.vehicleWidth / 2;
    const minS = Math.min(before.s, after.s) - halfVehicleLength - pedestrianRadius;
    const maxS = Math.max(before.s, after.s) + halfVehicleLength + pedestrianRadius;
    const firstAnchor = Math.floor(minS / PED_ANCHOR_SPACING);
    const lastAnchor = Math.ceil(maxS / PED_ANCHOR_SPACING);
    for (let anchor = firstAnchor; anchor <= lastAnchor; anchor++) {
      if ((anchor - PED_CROSSWALK_PHASE_ANCHOR) % PED_CROSSWALK_SPACING_ANCHORS !== 0) continue;
      const s = anchor * PED_ANCHOR_SPACING + PED_VISUAL_S_OFFSET_M;
      if (s < minS || s > maxS) continue;
      const ped = this.road.pedestrianAt(anchor, this.session.elapsed);
      if (!ped.active) continue;
      const deltaS = after.s - before.s;
      const t = Math.abs(deltaS) > 0.01 ? clamp((s - before.s) / deltaS, 0, 1) : 0;
      const carS = lerp(before.s, after.s, t);
      const carLateral = before.lateral + (after.lateral - before.lateral) * t;
      const longitudinalOverlap = Math.abs(s - carS) <= halfVehicleLength + pedestrianRadius;
      const lateralOverlap = Math.abs(carLateral - ped.lateral) <= halfVehicleWidth + pedestrianRadius;
      if (longitudinalOverlap && lateralOverlap) {
        return { id: `ped-${anchor}`, segment: anchor, side: ped.side, s, lateral: ped.lateral };
      }
    }
    return null;
  }

  private startIfNeeded(): void {
    if (this.session.started) return;
    this.session.started = true;
    this.session.status = "running";
    this.session.startedAt = new Date().toISOString();
    publish("event", { type: "session-started", startedAt: this.session.startedAt }, false);
  }

  private meaningful(c: Controls): boolean {
    return Math.abs(c.steer) > 0.08 || c.accelerator > 0.05 || c.brake > 0.05;
  }

  private setDIC(message: string, seconds = 2): void {
    this.dicMessage = message;
    this.dicUntil = this.session.elapsed + seconds;
  }

  private noteControlActions(c: Controls): void {
    if (!this.activeTrial) return;
    const baseline = this.activeTrial.baseline || { steer: 0, accelerator: 0, brake: 0 };
    if (c.brake - baseline.brake > 0.22 && c.brake > 0.3) this.noteAction("brake");
    else if (c.accelerator - baseline.accelerator > 0.22 && c.accelerator > 0.3) this.noteAction("accelerate");
    else if (c.steer - baseline.steer < -0.28 && c.steer < -0.3) this.noteAction("steerLeft");
    else if (c.steer - baseline.steer > 0.28 && c.steer > 0.3) this.noteAction("steerRight");
  }

  private noteAction(action: ExpectedAction): void {
    if (!this.activeTrial) return;
    const elapsed = Math.max(0, this.session.elapsed - this.activeTrial.startedAt);
    if (this.activeTrial.pdt == null) this.activeTrial.pdt = elapsed;
    if (this.activeTrial.drt == null && action === this.activeTrial.expectedAction) {
      this.activeTrial.drt = elapsed;
      this.finishTrial("complete");
    }
  }

  private finishTrial(status: "complete" | "superseded"): void {
    if (!this.activeTrial) return;
    this.activeTrial.status = status;
    publish("event", { type: `alert-trial-${status}`, trial: this.activeTrial }, false);
    this.activeTrial = null;
  }
}
