import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  RepeatWrapping,
  Scene
} from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { config } from "../game/config";

function createFacadeTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#112430");
  grad.addColorStop(1, "#18232c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 256);

  const cols = 8;
  const rows = 24;
  const colW = 128 / cols;
  const rowH = 256 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const randVal = (Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
      const noise = Math.abs(randVal);
      if (noise > 0.65) {
        ctx.fillStyle = noise > 0.88 ? "#ffc640" : "#5be5f7";
      } else {
        ctx.fillStyle = "#0c151c";
      }
      ctx.fillRect(c * colW + 3, r * rowH + 2, colW - 6, rowH - 4);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

import { RoadModel } from "../game/route";
import type { RenderQuality, SimSnapshot } from "../game/types";

type Ribbon = {
  mesh: Mesh<BufferGeometry, MeshLambertMaterial | MeshBasicMaterial>;
  positions: Float32Array;
  uvs: Float32Array;
  maxSampleCount: number;
};

type GuardrailLine = {
  line: Line2;
  geometry: LineGeometry;
  positions: Float32Array;
  colors?: Float32Array;
  nearColor?: Color;
  farColor?: Color;
  fadeStartM?: number;
  fadeEndM?: number;
  maxSampleCount: number;
  dashed: boolean;
};

type LateralSource = number | ((s: number) => number);

const ROAD_SAMPLE_COUNT_HIGH = 160;
const ROAD_SAMPLE_COUNT_PERF = 96;
const ROAD_SAMPLE_COUNT_MAX = ROAD_SAMPLE_COUNT_HIGH;
const GUARDRAIL_SAMPLE_COUNT_HIGH = 432;
const GUARDRAIL_SAMPLE_COUNT_PERF = 224;
const GUARDRAIL_SAMPLE_COUNT_MAX = GUARDRAIL_SAMPLE_COUNT_HIGH;
const LANE_DASH_SIZE_M = 3.1;
const LANE_DASH_GAP_M = 5.1;
const LANE_DASH_CYCLE_M = LANE_DASH_SIZE_M + LANE_DASH_GAP_M;

function smooth01(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function resolveLateral(source: LateralSource, s: number): number {
  return typeof source === "function" ? source(s) : source;
}

export function roadRibbonSettings(mode: RenderQuality): { sampleCount: number; spacing: number; backDistance: number } {
  return mode === "high"
    ? { sampleCount: ROAD_SAMPLE_COUNT_HIGH, spacing: 3, backDistance: 42 }
    : { sampleCount: ROAD_SAMPLE_COUNT_PERF, spacing: 3.4, backDistance: 30 };
}

export function fillRoadRibbonSamples(target: Float32Array, roadPositionM: number, mode: RenderQuality): { base: number; sampleCount: number; spacing: number } {
  const settings = roadRibbonSettings(mode);
  const base = Math.floor((roadPositionM - settings.backDistance) / settings.spacing) * settings.spacing;
  for (let i = 0; i < settings.sampleCount; i++) {
    target[i] = base + i * settings.spacing;
  }
  return { base, sampleCount: settings.sampleCount, spacing: settings.spacing };
}

export function guardrailRibbonSettings(mode: RenderQuality): { sampleCount: number; spacing: number; backDistance: number } {
  return mode === "high"
    ? { sampleCount: GUARDRAIL_SAMPLE_COUNT_HIGH, spacing: 1.1, backDistance: 42 }
    : { sampleCount: GUARDRAIL_SAMPLE_COUNT_PERF, spacing: 1.45, backDistance: 30 };
}

export function fillGuardrailRibbonSamples(target: Float32Array, roadPositionM: number, mode: RenderQuality): { base: number; sampleCount: number; spacing: number } {
  const settings = guardrailRibbonSettings(mode);
  const base = Math.floor((roadPositionM - settings.backDistance) / settings.spacing) * settings.spacing;
  for (let i = 0; i < settings.sampleCount; i++) {
    target[i] = base + i * settings.spacing;
  }
  return { base, sampleCount: settings.sampleCount, spacing: settings.spacing };
}

export function laneDashOffsetForSampleBase(sampleBaseM: number): number {
  return ((sampleBaseM % LANE_DASH_CYCLE_M) + LANE_DASH_CYCLE_M) % LANE_DASH_CYCLE_M;
}

export class RoadRibbonSystem {
  private readonly ribbons: Record<string, Ribbon>;
  private readonly guardrailLines: { left: GuardrailLine; right: GuardrailLine };
  private readonly markingLines: { edgeL: GuardrailLine; edgeR: GuardrailLine; centerL: GuardrailLine; centerR: GuardrailLine };
  private readonly laneLines: GuardrailLine[] = [];
  private readonly roadSamples = new Float32Array(ROAD_SAMPLE_COUNT_MAX);
  private readonly guardrailSamples = new Float32Array(GUARDRAIL_SAMPLE_COUNT_MAX);
  private qualityMode: RenderQuality = "high";
  private lastUpdateKey = "";

  constructor(private readonly scene: Scene, private readonly road: RoadModel) {
    const objects = this.createRoadRibbons();
    this.ribbons = objects.ribbons;
    this.guardrailLines = objects.guardrailLines;
    this.markingLines = objects.markingLines;
  }

  setQualityMode(mode: RenderQuality): void {
    if (this.qualityMode === mode) return;
    this.qualityMode = mode;
    this.lastUpdateKey = "";
  }

  update(snapshot: SimSnapshot): void {
    const settings = roadRibbonSettings(this.qualityMode);
    const guardrailSettings = guardrailRibbonSettings(this.qualityMode);
    const base = Math.floor((snapshot.vehicle.roadPositionM - settings.backDistance) / settings.spacing) * settings.spacing;
    const guardrailBase = Math.floor((snapshot.vehicle.roadPositionM - guardrailSettings.backDistance) / guardrailSettings.spacing) * guardrailSettings.spacing;
    const transition = snapshot.road.transition;
    const transitionKey = transition ? `${transition.from}:${transition.to}:${Math.floor(transition.progress * 1000)}` : "";
    const updateKey = `${this.qualityMode}:${base}:${guardrailBase}:${snapshot.road.scene}:${transitionKey}`;
    if (updateKey === this.lastUpdateKey) return;
    this.lastUpdateKey = updateKey;

    fillRoadRibbonSamples(this.roadSamples, snapshot.vehicle.roadPositionM, this.qualityMode);
    const guardrailSampleWindow = fillGuardrailRibbonSamples(this.guardrailSamples, snapshot.vehicle.roadPositionM, this.qualityMode);
    this.updateLaneDashPhase(guardrailSampleWindow.base);

    const samples = this.roadSamples;
    const guardrailSamples = this.guardrailSamples;
    const boundsAt = (s: number) => this.road.boundsAt(s);
    const bounds = boundsAt(snapshot.vehicle.roadPositionM);
    this.updateRibbon(this.ribbons.ground, samples, settings.sampleCount, (s) => boundsAt(s).leftWall - 60, (s) => boundsAt(s).rightWall + 60, -0.18);
    this.updateRibbon(this.ribbons.road, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge, (s) => boundsAt(s).rightEdge, 0.02);
    this.updateRibbon(this.ribbons.shoulderL, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge - config.shoulderWidth, (s) => boundsAt(s).leftEdge, 0.012);
    this.updateRibbon(this.ribbons.shoulderR, samples, settings.sampleCount, (s) => boundsAt(s).rightEdge, (s) => boundsAt(s).rightEdge + config.shoulderWidth, 0.012);

    this.updateRibbon(this.ribbons.roadSheen, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge + 0.08, (s) => boundsAt(s).rightEdge - 0.08, 0.043);
    this.updateRibbon(this.ribbons.shoulderGlowL, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge - 0.24, (s) => boundsAt(s).leftEdge + 0.08, 0.062);
    this.updateRibbon(this.ribbons.shoulderGlowR, samples, settings.sampleCount, (s) => boundsAt(s).rightEdge - 0.08, (s) => boundsAt(s).rightEdge + 0.24, 0.062);
    this.updateRibbon(this.ribbons.wallL, samples, settings.sampleCount, (s) => boundsAt(s).leftWall - 0.14, (s) => boundsAt(s).leftWall + 0.14, 0.46);
    this.updateRibbon(this.ribbons.wallR, samples, settings.sampleCount, (s) => boundsAt(s).rightWall - 0.14, (s) => boundsAt(s).rightWall + 0.14, 0.46);
    this.updateVerticalRibbon(this.ribbons.guardrailFaceL, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).leftWall, 0.5, 0.82);
    this.updateVerticalRibbon(this.ribbons.guardrailFaceR, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).rightWall, 0.5, 0.82);
    this.updateGuardrailLine(this.guardrailLines.left, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).leftWall, 0.86, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.guardrailLines.right, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).rightWall, 0.86, snapshot.vehicle.roadPositionM);

    this.ribbons.urbanFacadeL.mesh.visible = false;
    this.ribbons.urbanFacadeR.mesh.visible = false;

    this.updateGuardrailLine(this.markingLines.edgeL, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).leftEdge + 0.06, 0.076, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.markingLines.edgeR, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).rightEdge - 0.06, 0.076, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.markingLines.centerL, guardrailSamples, guardrailSettings.sampleCount, -0.17, 0.082, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.markingLines.centerR, guardrailSamples, guardrailSettings.sampleCount, 0.17, 0.082, snapshot.vehicle.roadPositionM);

    for (let i = 0; i < this.laneLines.length; i++) {
      this.laneLines[i].line.visible = false;
    }
    let ribbonIdx = 0;
    const farSampleS = guardrailSamples[Math.max(0, guardrailSettings.sampleCount - 1)] ?? snapshot.vehicle.roadPositionM;
    for (let i = 0; i < 3; i++) {
      const dividerThreshold = i + 1;
      const visibleDividerLaneFloat = Math.max(bounds.laneFloat, this.road.laneFloat(farSampleS));
      const dividerAlpha = smooth01((visibleDividerLaneFloat - dividerThreshold) / 0.4);
      if (dividerAlpha <= 0.01) {
        ribbonIdx += 2;
        continue;
      }
      // Left side lane divider
      const offsetL = -config.laneWidth * (i + 1);
      if (ribbonIdx < this.laneLines.length) {
        const lineL = this.laneLines[ribbonIdx++];
        lineL.line.visible = true;
        lineL.line.material.opacity = 0.86 * dividerAlpha;
        this.updateGuardrailLine(lineL, guardrailSamples, guardrailSettings.sampleCount, offsetL, 0.108, snapshot.vehicle.roadPositionM, (s) => this.road.laneFloat(s) > dividerThreshold + 0.03);
      }
      // Right side lane divider
      const offsetR = config.laneWidth * (i + 1);
      if (ribbonIdx < this.laneLines.length) {
        const lineR = this.laneLines[ribbonIdx++];
        lineR.line.visible = true;
        lineR.line.material.opacity = 0.86 * dividerAlpha;
        this.updateGuardrailLine(lineR, guardrailSamples, guardrailSettings.sampleCount, offsetR, 0.108, snapshot.vehicle.roadPositionM, (s) => this.road.laneFloat(s) > dividerThreshold + 0.03);
      }
    }
  }

  private createRoadRibbons(): {
    ribbons: Record<string, Ribbon>;
    guardrailLines: { left: GuardrailLine; right: GuardrailLine };
    markingLines: { edgeL: GuardrailLine; edgeR: GuardrailLine; centerL: GuardrailLine; centerR: GuardrailLine };
  } {
    const roadMaterial = new MeshLambertMaterial({
      color: 0x52615a,
      emissive: 0x1f2927,
      emissiveIntensity: 0.42,
      side: DoubleSide
    });
    const shoulderMaterial = new MeshLambertMaterial({ color: 0x33574f, side: DoubleSide });
    const grassMaterial = new MeshLambertMaterial({ color: 0x2d5f4f, side: DoubleSide });
    const wallMaterial = new MeshLambertMaterial({ color: 0x496d70, side: DoubleSide });
    const facadeTex = createFacadeTexture();
    const facadeMaterial = new MeshBasicMaterial({
      map: facadeTex,
      side: DoubleSide,
      transparent: true,
      opacity: 0.82
    });
    const guardrailFace = new MeshBasicMaterial({ color: 0xaac5bd, side: DoubleSide, transparent: true, opacity: 0.68, depthWrite: false });
    const guardrailTop = new LineMaterial({
      color: 0xd4e8e0,
      linewidth: 0.18,
      worldUnits: true,
      transparent: true,
      opacity: 0.7,
      alphaToCoverage: true,
      depthWrite: false
    });
    const edgeLine = new LineMaterial({
      color: 0xffffff,
      linewidth: 0.105,
      worldUnits: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      alphaToCoverage: true,
      depthWrite: false
    });
    const centerLine = new LineMaterial({
      color: 0xffffff,
      linewidth: 0.105,
      worldUnits: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      alphaToCoverage: true,
      depthWrite: false
    });
    const laneDivider = new LineMaterial({
      color: 0xffffff,
      linewidth: 0.12,
      worldUnits: true,
      vertexColors: true,
      dashed: true,
      dashSize: LANE_DASH_SIZE_M,
      gapSize: LANE_DASH_GAP_M,
      transparent: true,
      opacity: 0.86,
      alphaToCoverage: true,
      depthWrite: false
    });
    const roadSheen = new MeshBasicMaterial({ color: 0x90a096, transparent: true, opacity: 0.13, depthWrite: false, side: DoubleSide });
    const shoulderGlow = new MeshBasicMaterial({ color: 0x98f5dd, transparent: true, opacity: 0.13, depthWrite: false, side: DoubleSide });
    const sampleCount = ROAD_SAMPLE_COUNT_MAX;
    const ribbons = {
      ground: this.createRibbon(sampleCount, grassMaterial, "ground"),
      road: this.createRibbon(sampleCount, roadMaterial, "road"),
      shoulderL: this.createRibbon(sampleCount, shoulderMaterial, "shoulderL"),
      shoulderR: this.createRibbon(sampleCount, shoulderMaterial, "shoulderR"),
      roadSheen: this.createRibbon(sampleCount, roadSheen, "roadSheen"),
      shoulderGlowL: this.createRibbon(sampleCount, shoulderGlow, "shoulderGlowL"),
      shoulderGlowR: this.createRibbon(sampleCount, shoulderGlow, "shoulderGlowR"),
      wallL: this.createRibbon(sampleCount, wallMaterial, "wallL"),
      wallR: this.createRibbon(sampleCount, wallMaterial, "wallR"),
      guardrailFaceL: this.createRibbon(GUARDRAIL_SAMPLE_COUNT_MAX, guardrailFace, "guardrailFaceL"),
      guardrailFaceR: this.createRibbon(GUARDRAIL_SAMPLE_COUNT_MAX, guardrailFace, "guardrailFaceR"),
      urbanFacadeL: this.createRibbon(sampleCount, facadeMaterial, "urbanFacadeL"),
      urbanFacadeR: this.createRibbon(sampleCount, facadeMaterial, "urbanFacadeR")
    };
    for (let i = 0; i < 6; i++) {
      const material = laneDivider.clone();
      this.laneLines.push(
        this.createGuardrailLine(GUARDRAIL_SAMPLE_COUNT_MAX, material, `lane${i}`, {
          dashed: true,
          renderOrder: 4,
          nearColor: 0xe1f8f1,
          farColor: 0x47645e,
          fadeStartM: 70,
          fadeEndM: 175
        })
      );
    }
    return {
      ribbons,
      guardrailLines: {
        left: this.createGuardrailLine(GUARDRAIL_SAMPLE_COUNT_MAX, guardrailTop, "guardrailTopL", { renderOrder: 2 }),
        right: this.createGuardrailLine(GUARDRAIL_SAMPLE_COUNT_MAX, guardrailTop, "guardrailTopR", { renderOrder: 2 })
      },
      markingLines: {
        edgeL: this.createGuardrailLine(GUARDRAIL_SAMPLE_COUNT_MAX, edgeLine, "edgeL", {
          renderOrder: 4,
          nearColor: 0xd8f6ee,
          farColor: 0x4f6d66,
          fadeStartM: 82,
          fadeEndM: 190
        }),
        edgeR: this.createGuardrailLine(GUARDRAIL_SAMPLE_COUNT_MAX, edgeLine, "edgeR", {
          renderOrder: 4,
          nearColor: 0xd8f6ee,
          farColor: 0x4f6d66,
          fadeStartM: 82,
          fadeEndM: 190
        }),
        centerL: this.createGuardrailLine(GUARDRAIL_SAMPLE_COUNT_MAX, centerLine, "centerL", {
          renderOrder: 4,
          nearColor: 0xf0ce55,
          farColor: 0x6f6746,
          fadeStartM: 78,
          fadeEndM: 185
        }),
        centerR: this.createGuardrailLine(GUARDRAIL_SAMPLE_COUNT_MAX, centerLine, "centerR", {
          renderOrder: 4,
          nearColor: 0xf0ce55,
          farColor: 0x6f6746,
          fadeStartM: 78,
          fadeEndM: 185
        })
      }
    };
  }

  private createRibbon(sampleCount: number, material: MeshLambertMaterial | MeshBasicMaterial, name: string): Ribbon {
    const positions = new Float32Array(sampleCount * 2 * 3);
    const normals = new Float32Array(sampleCount * 2 * 3);
    const uvs = new Float32Array(sampleCount * 2 * 2);
    const indices: number[] = [];
    for (let i = 0; i < sampleCount - 1; i++) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    for (let i = 0; i < sampleCount * 2; i++) {
      normals[i * 3 + 1] = 1;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("normal", new BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2).setUsage(DynamicDrawUsage));
    geometry.setIndex(indices);
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    return { mesh, positions, uvs, maxSampleCount: sampleCount };
  }

  private createGuardrailLine(
    sampleCount: number,
    material: LineMaterial,
    name: string,
    options: {
      dashed?: boolean;
      renderOrder?: number;
      nearColor?: number;
      farColor?: number;
      fadeStartM?: number;
      fadeEndM?: number;
    } = {}
  ): GuardrailLine {
    const geometry = new LineGeometry();
    const positions = new Float32Array(sampleCount * 3);
    const colors = options.nearColor === undefined ? undefined : new Float32Array(sampleCount * 3);
    geometry.setPositions(positions);
    if (colors) geometry.setColors(colors);
    const line = new Line2(geometry, material);
    line.name = name;
    line.frustumCulled = false;
    line.renderOrder = options.renderOrder ?? 2;
    const dashed = options.dashed ?? false;
    if (material.dashed !== dashed) material.dashed = dashed;
    if (dashed) line.computeLineDistances();
    this.scene.add(line);
    return {
      line,
      geometry,
      positions,
      colors,
      nearColor: options.nearColor === undefined ? undefined : new Color(options.nearColor),
      farColor: options.farColor === undefined ? undefined : new Color(options.farColor),
      fadeStartM: options.fadeStartM,
      fadeEndM: options.fadeEndM,
      maxSampleCount: sampleCount,
      dashed: options.dashed ?? false
    };
  }

  private updateRibbon(
    ribbon: Ribbon,
    samples: ArrayLike<number>,
    activeSampleCount: number,
    left: LateralSource,
    right: LateralSource,
    y: number,
    vScale?: number
  ): void {
    for (let i = 0; i < activeSampleCount; i++) {
      const s = samples[i];
      const l = this.road.worldFromRoad(s, resolveLateral(left, s), y);
      const r = this.road.worldFromRoad(s, resolveLateral(right, s), y);
      const p = i * 6;
      ribbon.positions[p] = l.x;
      ribbon.positions[p + 1] = l.y;
      ribbon.positions[p + 2] = l.z;
      ribbon.positions[p + 3] = r.x;
      ribbon.positions[p + 4] = r.y;
      ribbon.positions[p + 5] = r.z;
      const v = vScale ? s / vScale : i / (activeSampleCount - 1);
      const uv = i * 4;
      ribbon.uvs[uv] = 0;
      ribbon.uvs[uv + 1] = v;
      ribbon.uvs[uv + 2] = 1;
      ribbon.uvs[uv + 3] = v;
    }
    const position = ribbon.mesh.geometry.getAttribute("position");
    const uv = ribbon.mesh.geometry.getAttribute("uv");
    ribbon.mesh.geometry.setDrawRange(0, Math.max(0, activeSampleCount - 1) * 6);
    position.needsUpdate = true;
    uv.needsUpdate = true;
  }

  private updateVerticalRibbon(ribbon: Ribbon, samples: ArrayLike<number>, activeSampleCount: number, lateral: LateralSource, bottomY: number, topY: number): void {
    for (let i = 0; i < activeSampleCount; i++) {
      const s = samples[i];
      const resolvedLateral = resolveLateral(lateral, s);
      const bottom = this.road.worldFromRoad(s, resolvedLateral, bottomY);
      const top = this.road.worldFromRoad(s, resolvedLateral, topY);
      const p = i * 6;
      ribbon.positions[p] = bottom.x;
      ribbon.positions[p + 1] = bottom.y;
      ribbon.positions[p + 2] = bottom.z;
      ribbon.positions[p + 3] = top.x;
      ribbon.positions[p + 4] = top.y;
      ribbon.positions[p + 5] = top.z;
      const u = i / (activeSampleCount - 1);
      const uv = i * 4;
      ribbon.uvs[uv] = 0;
      ribbon.uvs[uv + 1] = u;
      ribbon.uvs[uv + 2] = 1;
      ribbon.uvs[uv + 3] = u;
    }
    const position = ribbon.mesh.geometry.getAttribute("position");
    const uv = ribbon.mesh.geometry.getAttribute("uv");
    ribbon.mesh.geometry.setDrawRange(0, Math.max(0, activeSampleCount - 1) * 6);
    position.needsUpdate = true;
    uv.needsUpdate = true;
  }

  private updateGuardrailLine(
    line: GuardrailLine,
    samples: ArrayLike<number>,
    activeSampleCount: number,
    lateral: LateralSource,
    y: number,
    originS: number,
    visibleAt?: (s: number) => boolean
  ): void {
    const sourceCount = Math.min(activeSampleCount, line.maxSampleCount);
    let firstSample = 0;
    let lastSample = sourceCount - 1;
    if (visibleAt) {
      firstSample = -1;
      lastSample = -1;
      for (let i = 0; i < sourceCount; i++) {
        if (!visibleAt(samples[i])) continue;
        if (firstSample < 0) firstSample = i;
        lastSample = i;
      }
      if (firstSample < 0) {
        line.geometry.setPositions(line.positions.subarray(0, 0));
        if (line.colors) line.geometry.setColors(line.colors.subarray(0, 0));
        return;
      }
    }
    const count = Math.max(0, lastSample - firstSample + 1);
    for (let i = 0; i < count; i++) {
      const s = samples[firstSample + i];
      const point = this.road.worldFromRoad(s, resolveLateral(lateral, s), y);
      const p = i * 3;
      line.positions[p] = point.x;
      line.positions[p + 1] = point.y;
      line.positions[p + 2] = point.z;
      if (line.colors && line.nearColor && line.farColor && line.fadeStartM !== undefined && line.fadeEndM !== undefined) {
        const fade = smooth01((s - originS - line.fadeStartM) / Math.max(1, line.fadeEndM - line.fadeStartM));
        line.colors[p] = line.nearColor.r + (line.farColor.r - line.nearColor.r) * fade;
        line.colors[p + 1] = line.nearColor.g + (line.farColor.g - line.nearColor.g) * fade;
        line.colors[p + 2] = line.nearColor.b + (line.farColor.b - line.nearColor.b) * fade;
      }
    }
    line.geometry.setPositions(line.positions.subarray(0, count * 3));
    if (line.colors) line.geometry.setColors(line.colors.subarray(0, count * 3));
    if (line.dashed) {
      if (!line.line.material.dashed) line.line.material.dashed = true;
      line.line.computeLineDistances();
    }
  }

  private updateLaneDashPhase(sampleBaseM: number): void {
    const dashOffset = laneDashOffsetForSampleBase(sampleBaseM);
    for (const line of this.laneLines) {
      if (line.dashed) line.line.material.dashOffset = dashOffset;
    }
  }
}
