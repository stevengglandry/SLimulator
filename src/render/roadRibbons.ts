import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Scene
} from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { config } from "../game/config";

import { RoadModel } from "../game/route";
import type { RenderQuality, SimSnapshot } from "../game/types";
import { getTerrainTexture } from "./terrainTexture";

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
};

type LaneDashLine = {
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>;
  positions: Float32Array;
  colors: Float32Array;
  nearColor: Color;
  farColor: Color;
  maxSegmentCount: number;
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
const MAX_LANE_DASH_SEGMENTS = Math.ceil((GUARDRAIL_SAMPLE_COUNT_HIGH * 1.45) / LANE_DASH_CYCLE_M) + 2;
const LANE_DIVIDER_REVEAL_LANES = 0.68;
export const OUTER_GROUND_MARGIN_M = 190;

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
    ? { sampleCount: GUARDRAIL_SAMPLE_COUNT_HIGH, spacing: 1.45, backDistance: 42 }
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

export function firstLaneDashStart(windowStartS: number): number {
  let dashStart = Math.floor(windowStartS / LANE_DASH_CYCLE_M) * LANE_DASH_CYCLE_M;
  if (dashStart + LANE_DASH_SIZE_M <= windowStartS) dashStart += LANE_DASH_CYCLE_M;
  return dashStart;
}

export function laneDividerVisible(laneFloat: number, dividerThreshold: number): boolean {
  return laneFloat > dividerThreshold + LANE_DIVIDER_REVEAL_LANES;
}

export class RoadRibbonSystem {
  private readonly ribbons: Record<string, Ribbon>;
  private readonly grassMaterials: { high: MeshLambertMaterial; perf: MeshLambertMaterial };
  private readonly guardrailLines: { left: GuardrailLine; right: GuardrailLine };
  private readonly markingLines: { edgeL: GuardrailLine; edgeR: GuardrailLine; centerL: GuardrailLine; centerR: GuardrailLine };
  private readonly laneLines: LaneDashLine[] = [];
  private readonly roadSamples = new Float32Array(ROAD_SAMPLE_COUNT_MAX);
  private readonly guardrailSamples = new Float32Array(GUARDRAIL_SAMPLE_COUNT_MAX);
  private qualityMode: RenderQuality = "high";
  private lastUpdateKey = "";

  constructor(private readonly scene: Scene, private readonly road: RoadModel) {
    const objects = this.createRoadRibbons();
    this.ribbons = objects.ribbons;
    this.grassMaterials = objects.grassMaterials;
    this.guardrailLines = objects.guardrailLines;
    this.markingLines = objects.markingLines;
  }

  setQualityMode(mode: RenderQuality): void {
    if (this.qualityMode === mode) return;
    this.qualityMode = mode;
    this.ribbons.ground.mesh.material = mode === "perf" ? this.grassMaterials.perf : this.grassMaterials.high;
    this.ribbons.vergeL.mesh.material = this.grassMaterials.perf;
    this.ribbons.vergeR.mesh.material = this.grassMaterials.perf;
    this.ribbons.vergeL.mesh.visible = mode === "high";
    this.ribbons.vergeR.mesh.visible = mode === "high";
    this.lastUpdateKey = "";
  }

  update(snapshot: SimSnapshot): void {
    const settings = roadRibbonSettings(this.qualityMode);
    const guardrailSettings = guardrailRibbonSettings(this.qualityMode);
    const base = Math.floor((snapshot.vehicle.roadPositionM - settings.backDistance) / settings.spacing) * settings.spacing;
    const guardrailBase = Math.floor((snapshot.vehicle.roadPositionM - guardrailSettings.backDistance) / guardrailSettings.spacing) * guardrailSettings.spacing;
    const transition = snapshot.road.transition;
    const transitionKey = transition ? `${transition.from}:${transition.to}:${transition.originS}` : "";
    const updateKey = `${this.qualityMode}:${base}:${guardrailBase}:${snapshot.road.scene}:${transitionKey}`;
    if (updateKey === this.lastUpdateKey) return;
    this.lastUpdateKey = updateKey;

    fillRoadRibbonSamples(this.roadSamples, snapshot.vehicle.roadPositionM, this.qualityMode);
    fillGuardrailRibbonSamples(this.guardrailSamples, snapshot.vehicle.roadPositionM, this.qualityMode);

    const samples = this.roadSamples;
    const guardrailSamples = this.guardrailSamples;
    const boundsAt = (s: number) => this.road.boundsAt(s);
    const bounds = boundsAt(snapshot.vehicle.roadPositionM);
    this.updateRibbon(
      this.ribbons.ground,
      samples,
      settings.sampleCount,
      (s) => boundsAt(s).leftWall - OUTER_GROUND_MARGIN_M,
      (s) => boundsAt(s).rightWall + OUTER_GROUND_MARGIN_M,
      -0.18,
      18
    );
    this.updateRibbon(this.ribbons.road, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge, (s) => boundsAt(s).rightEdge, 0.02);
    this.updateRibbon(this.ribbons.shoulderL, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge - config.shoulderWidth, (s) => boundsAt(s).leftEdge, 0.012);
    this.updateRibbon(this.ribbons.shoulderR, samples, settings.sampleCount, (s) => boundsAt(s).rightEdge, (s) => boundsAt(s).rightEdge + config.shoulderWidth, 0.012);
    this.updateRibbon(this.ribbons.vergeL, samples, settings.sampleCount, (s) => boundsAt(s).leftWall + 0.18, (s) => boundsAt(s).leftEdge - config.shoulderWidth, 0, 18);
    this.updateRibbon(this.ribbons.vergeR, samples, settings.sampleCount, (s) => boundsAt(s).rightEdge + config.shoulderWidth, (s) => boundsAt(s).rightWall - 0.18, 0, 18);

    this.updateRibbon(this.ribbons.roadSheen, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge + 0.08, (s) => boundsAt(s).rightEdge - 0.08, 0.043);
    this.updateRibbon(this.ribbons.shoulderGlowL, samples, settings.sampleCount, (s) => boundsAt(s).leftEdge - 0.24, (s) => boundsAt(s).leftEdge + 0.08, 0.062);
    this.updateRibbon(this.ribbons.shoulderGlowR, samples, settings.sampleCount, (s) => boundsAt(s).rightEdge - 0.08, (s) => boundsAt(s).rightEdge + 0.24, 0.062);
    this.updateRibbon(this.ribbons.wallL, samples, settings.sampleCount, (s) => boundsAt(s).leftWall - 0.14, (s) => boundsAt(s).leftWall + 0.14, 0.46);
    this.updateRibbon(this.ribbons.wallR, samples, settings.sampleCount, (s) => boundsAt(s).rightWall - 0.14, (s) => boundsAt(s).rightWall + 0.14, 0.46);
    this.updateVerticalRibbon(this.ribbons.guardrailFaceL, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).leftWall, 0.5, 0.82);
    this.updateVerticalRibbon(this.ribbons.guardrailFaceR, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).rightWall, 0.5, 0.82);
    this.updateGuardrailLine(this.guardrailLines.left, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).leftWall, 0.86, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.guardrailLines.right, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).rightWall, 0.86, snapshot.vehicle.roadPositionM);

    this.updateGuardrailLine(this.markingLines.edgeL, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).leftEdge + 0.06, 0.076, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.markingLines.edgeR, guardrailSamples, guardrailSettings.sampleCount, (s) => boundsAt(s).rightEdge - 0.06, 0.076, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.markingLines.centerL, guardrailSamples, guardrailSettings.sampleCount, -0.17, 0.082, snapshot.vehicle.roadPositionM);
    this.updateGuardrailLine(this.markingLines.centerR, guardrailSamples, guardrailSettings.sampleCount, 0.17, 0.082, snapshot.vehicle.roadPositionM);

    for (let i = 0; i < this.laneLines.length; i++) {
      this.laneLines[i].mesh.visible = false;
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
        lineL.mesh.material.opacity = 0.86 * dividerAlpha;
        this.updateLaneDashLine(lineL, guardrailSamples, guardrailSettings.sampleCount, offsetL, 0.108, snapshot.vehicle.roadPositionM, (s) => laneDividerVisible(this.road.laneFloat(s), dividerThreshold));
      }
      // Right side lane divider
      const offsetR = config.laneWidth * (i + 1);
      if (ribbonIdx < this.laneLines.length) {
        const lineR = this.laneLines[ribbonIdx++];
        lineR.mesh.material.opacity = 0.86 * dividerAlpha;
        this.updateLaneDashLine(lineR, guardrailSamples, guardrailSettings.sampleCount, offsetR, 0.108, snapshot.vehicle.roadPositionM, (s) => laneDividerVisible(this.road.laneFloat(s), dividerThreshold));
      }
    }
  }

  private createRoadRibbons(): {
    ribbons: Record<string, Ribbon>;
    grassMaterials: { high: MeshLambertMaterial; perf: MeshLambertMaterial };
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
    const highGrassMaterial = new MeshLambertMaterial({ color: 0x2d5f4f, side: DoubleSide });
    const perfGrassMaterial = new MeshLambertMaterial({
      color: 0x66806d,
      map: getTerrainTexture(),
      emissive: 0x273b2f,
      emissiveIntensity: 0.5,
      side: DoubleSide
    });
    const wallMaterial = new MeshLambertMaterial({ color: 0x496d70, side: DoubleSide });
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
    const laneDivider = new MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      side: DoubleSide,
      fog: true
    });
    const roadSheen = new MeshBasicMaterial({ color: 0x90a096, transparent: true, opacity: 0.13, depthWrite: false, side: DoubleSide });
    const shoulderGlow = new MeshBasicMaterial({ color: 0x98f5dd, transparent: true, opacity: 0.13, depthWrite: false, side: DoubleSide });
    const sampleCount = ROAD_SAMPLE_COUNT_MAX;
    const ribbons = {
      ground: this.createRibbon(sampleCount, highGrassMaterial, "ground"),
      road: this.createRibbon(sampleCount, roadMaterial, "road"),
      shoulderL: this.createRibbon(sampleCount, shoulderMaterial, "shoulderL"),
      shoulderR: this.createRibbon(sampleCount, shoulderMaterial, "shoulderR"),
      vergeL: this.createRibbon(sampleCount, perfGrassMaterial, "vergeL"),
      vergeR: this.createRibbon(sampleCount, perfGrassMaterial, "vergeR"),
      roadSheen: this.createRibbon(sampleCount, roadSheen, "roadSheen"),
      shoulderGlowL: this.createRibbon(sampleCount, shoulderGlow, "shoulderGlowL"),
      shoulderGlowR: this.createRibbon(sampleCount, shoulderGlow, "shoulderGlowR"),
      wallL: this.createRibbon(sampleCount, wallMaterial, "wallL"),
      wallR: this.createRibbon(sampleCount, wallMaterial, "wallR"),
      guardrailFaceL: this.createRibbon(GUARDRAIL_SAMPLE_COUNT_MAX, guardrailFace, "guardrailFaceL"),
      guardrailFaceR: this.createRibbon(GUARDRAIL_SAMPLE_COUNT_MAX, guardrailFace, "guardrailFaceR")
    };
    for (let i = 0; i < 6; i++) {
      const material = laneDivider.clone();
      this.laneLines.push(
        this.createLaneDashLine(material, `lane${i}`)
      );
    }
    return {
      ribbons,
      grassMaterials: { high: highGrassMaterial, perf: perfGrassMaterial },
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
      maxSampleCount: sampleCount
    };
  }

  private createLaneDashLine(material: MeshBasicMaterial, name: string): LaneDashLine {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(MAX_LANE_DASH_SEGMENTS * 4 * 3);
    const colors = new Float32Array(MAX_LANE_DASH_SEGMENTS * 4 * 3);
    const indices = new Uint16Array(MAX_LANE_DASH_SEGMENTS * 6);
    for (let i = 0; i < MAX_LANE_DASH_SEGMENTS; i++) {
      const vertex = i * 4;
      const index = i * 6;
      indices[index] = vertex;
      indices[index + 1] = vertex + 2;
      indices[index + 2] = vertex + 1;
      indices[index + 3] = vertex + 1;
      indices[index + 4] = vertex + 2;
      indices[index + 5] = vertex + 3;
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("color", new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage));
    geometry.setIndex(new BufferAttribute(indices, 1));
    geometry.setDrawRange(0, 0);
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    mesh.frustumCulled = false;
    mesh.renderOrder = 4;
    mesh.visible = false;
    this.scene.add(mesh);
    return {
      mesh,
      positions,
      colors,
      nearColor: new Color(0xe1f8f1),
      farColor: new Color(0x47645e),
      maxSegmentCount: MAX_LANE_DASH_SEGMENTS
    };
  }

  private updateRibbon(
    ribbon: Ribbon,
    samples: ArrayLike<number>,
    activeSampleCount: number,
    left: LateralSource,
    right: LateralSource,
    y: number,
    worldUvMeters?: number
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
      const uv = i * 4;
      if (worldUvMeters) {
        ribbon.uvs[uv] = l.x / worldUvMeters;
        ribbon.uvs[uv + 1] = l.z / worldUvMeters;
        ribbon.uvs[uv + 2] = r.x / worldUvMeters;
        ribbon.uvs[uv + 3] = r.z / worldUvMeters;
      } else {
        const v = i / (activeSampleCount - 1);
        ribbon.uvs[uv] = 0;
        ribbon.uvs[uv + 1] = v;
        ribbon.uvs[uv + 2] = 1;
        ribbon.uvs[uv + 3] = v;
      }
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
        line.line.visible = false;
        return;
      }
    }
    const count = Math.max(0, lastSample - firstSample + 1);
    if (count < 2) {
      line.line.visible = false;
      return;
    }
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
  }

  private updateLaneDashLine(
    line: LaneDashLine,
    samples: ArrayLike<number>,
    activeSampleCount: number,
    lateral: number,
    y: number,
    originS: number,
    visibleAt: (s: number) => boolean
  ): void {
    if (activeSampleCount < 2) {
      line.mesh.visible = false;
      return;
    }
    const windowStartS = samples[0];
    const windowEndS = samples[activeSampleCount - 1];
    let dashStart = firstLaneDashStart(windowStartS);
    let segmentCount = 0;
    while (dashStart < windowEndS && segmentCount < line.maxSegmentCount) {
      const startS = Math.max(windowStartS, dashStart);
      const endS = Math.min(windowEndS, dashStart + LANE_DASH_SIZE_M);
      const midpointS = (startS + endS) * 0.5;
      if (endS > startS && visibleAt(midpointS)) {
        const halfWidth = 0.06;
        const startLeft = this.road.worldFromRoad(startS, lateral - halfWidth, y);
        const startRight = this.road.worldFromRoad(startS, lateral + halfWidth, y);
        const endLeft = this.road.worldFromRoad(endS, lateral - halfWidth, y);
        const endRight = this.road.worldFromRoad(endS, lateral + halfWidth, y);
        const p = segmentCount * 12;
        for (const [vertex, point] of [startLeft, startRight, endLeft, endRight].entries()) {
          const offset = p + vertex * 3;
          line.positions[offset] = point.x;
          line.positions[offset + 1] = point.y;
          line.positions[offset + 2] = point.z;
        }
        for (let endpoint = 0; endpoint < 2; endpoint++) {
          const s = endpoint === 0 ? startS : endS;
          const fade = smooth01((s - originS - 70) / 105);
          for (let side = 0; side < 2; side++) {
            const c = p + (endpoint * 2 + side) * 3;
            line.colors[c] = line.nearColor.r + (line.farColor.r - line.nearColor.r) * fade;
            line.colors[c + 1] = line.nearColor.g + (line.farColor.g - line.nearColor.g) * fade;
            line.colors[c + 2] = line.nearColor.b + (line.farColor.b - line.nearColor.b) * fade;
          }
        }
        segmentCount++;
      }
      dashStart += LANE_DASH_CYCLE_M;
    }
    if (segmentCount === 0) {
      line.mesh.visible = false;
      return;
    }
    line.mesh.geometry.setDrawRange(0, segmentCount * 6);
    line.mesh.geometry.getAttribute("position").needsUpdate = true;
    line.mesh.geometry.getAttribute("color").needsUpdate = true;
    line.mesh.visible = true;
  }
}
