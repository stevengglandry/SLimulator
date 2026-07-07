import { config, SCENES } from "./config";
import type { LaneInfo, RoadBounds, RoadFrame, RoadTransition, SceneKey } from "./types";
import { clamp, hash01, lerp, normalizeAngle, smoothstep, TAU } from "../shared/math";

export class RoadModel {
  scene: SceneKey = "unmapped";
  transition: RoadTransition | null = null;
  queue: Array<{ target: SceneKey }> = [];

  constructor(public seed: number) {}

  reset(scene: SceneKey = "unmapped", seed = this.seed): void {
    this.seed = seed >>> 0;
    this.scene = scene;
    this.transition = null;
    this.queue = [];
  }

  requestScene(target: SceneKey, _transitionMs?: number, currentS = 0): "queued" | "started" | "noop" {
    if (!SCENES[target]) throw new Error(`Unknown scene: ${target}`);
    if (!this.transition && target === this.scene) return "noop";
    const last = this.queue[this.queue.length - 1];
    if ((this.transition && this.transition.to === target && this.queue.length === 0) || last?.target === target) {
      return "noop";
    }
    if (this.transition) {
      this.queue.push({ target });
      return "queued";
    }
    this.beginTransition(target, currentS);
    return "started";
  }

  beginTransition(target: SceneKey, currentS = 0): void {
    const originS = Math.max(0, currentS);
    const taperStartS = originS + config.sceneTransitionLeadM;
    this.transition = {
      from: this.scene,
      to: target,
      progress: 0,
      originS,
      taperStartS,
      lockS: taperStartS + config.sceneTransitionTaperM
    };
  }

  update(_dt: number, currentS = 0): { completed?: { from: SceneKey; to: SceneKey }; started?: SceneKey } {
    if (!this.transition) return {};
    this.transition.progress = clamp((currentS - this.transition.originS) / Math.max(1, this.transition.lockS - this.transition.originS), 0, 1);
    if (currentS < this.transition.lockS) return {};
    const from = this.transition.from;
    const to = this.transition.to;
    this.scene = to;
    this.transition = null;
    if (this.queue.length) {
      const next = this.queue.shift()!;
      this.beginTransition(next.target, currentS);
      return { completed: { from, to }, started: next.target };
    }
    return { completed: { from, to } };
  }

  requestedScene(): SceneKey {
    return this.transition?.to ?? this.scene;
  }

  transitionTAt(s: number): number {
    if (!this.transition) return 0;
    return smoothstep((s - this.transition.taperStartS) / Math.max(1, this.transition.lockS - this.transition.taperStartS));
  }

  scenePairAt(): { from: SceneKey; to: SceneKey } {
    if (!this.transition) return { from: this.scene, to: this.scene };
    return { from: this.transition.from, to: this.transition.to };
  }

  sceneAt(s: number): SceneKey {
    const pair = this.scenePairAt();
    return this.transitionTAt(s) >= 0.5 ? pair.to : pair.from;
  }

  scenerySceneAt(s: number): SceneKey {
    if (!this.transition) return this.scene;
    return s >= this.transition.taperStartS ? this.transition.to : this.scene;
  }

  roadValueAt(key: keyof Omit<(typeof SCENES)[SceneKey], "label">, s: number): number {
    const pair = this.scenePairAt();
    return lerp(SCENES[pair.from][key], SCENES[pair.to][key], this.transitionTAt(s));
  }

  laneCount(s = 0): number {
    return SCENES[this.sceneAt(s)].lanes;
  }

  laneFloat(s = 0): number {
    return this.roadValueAt("lanes", s);
  }

  frameAt(s: number): RoadFrame {
    const amp = this.roadValueAt("curveAmp", s);
    const wave = config.routeWaveMeters;
    const seedPhase = (this.seed % 4096) / 4096 * TAU;
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

  worldFromRoad(s: number, lateral: number, y = 0): { x: number; y: number; z: number; heading: number } {
    const frame = this.frameAt(s);
    return {
      x: frame.x + frame.rightX * lateral,
      y,
      z: frame.z + frame.rightZ * lateral,
      heading: frame.heading
    };
  }

  roadFromWorld(x: number, z: number): { s: number; lateral: number; heading: number } {
    let s = Math.max(0, -z);
    for (let i = 0; i < 4; i++) {
      const frame = this.frameAt(s);
      const dx = x - frame.x;
      const dz = z - frame.z;
      const dxds = Math.tan(frame.heading);
      s = Math.max(0, s + (dx * dxds - dz) / (dxds * dxds + 1));
    }
    const frame = this.frameAt(s);
    const dx = x - frame.x;
    const dz = z - frame.z;
    return {
      s,
      lateral: dx * frame.rightX + dz * frame.rightZ,
      heading: frame.heading
    };
  }

  boundsAt(s = 0): RoadBounds {
    const laneFloat = this.laneFloat(s);
    const laneCount = this.laneCount(s);
    const roadWidth = 2 * laneFloat * config.laneWidth;
    const leftEdge = -laneFloat * config.laneWidth;
    const rightEdge = laneFloat * config.laneWidth;
    const guardrailDistance = this.roadValueAt("guardrailDistance", s);
    const laneCenters = Array.from({ length: laneCount }, (_, i) => {
      return config.laneWidth * (i + 0.5);
    });
    return {
      laneCount,
      laneFloat,
      leftEdge,
      rightEdge,
      leftWall: leftEdge - guardrailDistance,
      rightWall: rightEdge + guardrailDistance,
      roadWidth,
      medianWidth: this.roadValueAt("median", s),
      laneCenters
    };
  }

  nearestLane(lateral: number, s = 0): LaneInfo {
    const centers = this.boundsAt(s).laneCenters;
    let index = 0;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < centers.length; i++) {
      const error = Math.abs(lateral - centers[i]);
      if (error < best) {
        best = error;
        index = i;
      }
    }
    return { index, center: centers[index] ?? 0, error: lateral - (centers[index] ?? 0) };
  }

  normalizeHeadingError(vehicleHeading: number, s: number): number {
    return normalizeAngle(vehicleHeading - this.frameAt(s).heading);
  }

  pedestrianAt(segment: number, nowSeconds: number): { lateral: number; side: string; active: boolean } {
    const bounds = this.boundsAt(segment * 16);
    const sideSeed = hash01(segment * 15.71 + this.seed);
    const side = sideSeed < 0.5 ? -1 : 1;
    const phase = sideSeed * TAU;
    const hesitation = 0.18 + Math.sin(nowSeconds * 1.8 + phase) * 0.16;
    const roadEdge = side < 0 ? bounds.leftEdge : bounds.rightEdge;
    const lateral = roadEdge + side * (0.95 + Math.max(0, hesitation));
    return {
      lateral,
      side: side < 0 ? "left" : "right",
      active: this.roadValueAt("crosswalks", segment * 16) > 0.3
    };
  }
}
