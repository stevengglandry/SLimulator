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
import { config } from "../game/config";

function createDashTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(0, 0, 1, 26);
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 26, 1, 38);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

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
import type { SimSnapshot } from "../game/types";

type Ribbon = {
  mesh: Mesh<BufferGeometry, MeshLambertMaterial | MeshBasicMaterial>;
  positions: Float32Array;
  uvs: Float32Array;
  sampleCount: number;
};

const ROAD_SAMPLE_SPACING_M = 3;
const ROAD_BACK_DISTANCE_M = 42;
const ROAD_SAMPLE_COUNT = 256;

export class RoadRibbonSystem {
  private readonly ribbons: Record<string, Ribbon>;
  private readonly laneRibbons: Ribbon[] = [];
  private readonly roadSamples = new Float32Array(ROAD_SAMPLE_COUNT);

  constructor(private readonly scene: Scene, private readonly road: RoadModel) {
    this.ribbons = this.createRoadRibbons();
  }

  update(snapshot: SimSnapshot): void {
    const base = snapshot.vehicle.roadPositionM - ROAD_BACK_DISTANCE_M;
    for (let i = 0; i < this.roadSamples.length; i++) {
      this.roadSamples[i] = base + i * ROAD_SAMPLE_SPACING_M;
    }

    const samples = this.roadSamples;
    const bounds = this.road.boundsAt(snapshot.vehicle.roadPositionM);
    this.updateRibbon(this.ribbons.ground, samples, bounds.leftWall - 60, bounds.rightWall + 60, -0.18);
    this.updateRibbon(this.ribbons.road, samples, bounds.leftEdge, bounds.rightEdge, 0.02);
    this.updateRibbon(this.ribbons.shoulderL, samples, bounds.leftEdge - config.shoulderWidth, bounds.leftEdge, 0.012);
    this.updateRibbon(this.ribbons.shoulderR, samples, bounds.rightEdge, bounds.rightEdge + config.shoulderWidth, 0.012);

    this.updateRibbon(this.ribbons.roadSheen, samples, bounds.leftEdge + 0.08, bounds.rightEdge - 0.08, 0.043);
    this.updateRibbon(this.ribbons.shoulderGlowL, samples, bounds.leftEdge - 0.24, bounds.leftEdge + 0.08, 0.062);
    this.updateRibbon(this.ribbons.shoulderGlowR, samples, bounds.rightEdge - 0.08, bounds.rightEdge + 0.24, 0.062);
    this.updateRibbon(this.ribbons.wallL, samples, bounds.leftWall - 0.14, bounds.leftWall + 0.14, 0.46);
    this.updateRibbon(this.ribbons.wallR, samples, bounds.rightWall - 0.14, bounds.rightWall + 0.14, 0.46);
    this.updateVerticalRibbon(this.ribbons.guardrailFaceL, samples, bounds.leftWall, 0.5, 0.82);
    this.updateVerticalRibbon(this.ribbons.guardrailFaceR, samples, bounds.rightWall, 0.5, 0.82);
    this.updateRibbon(this.ribbons.guardrailTopL, samples, bounds.leftWall - 0.12, bounds.leftWall + 0.12, 0.84);
    this.updateRibbon(this.ribbons.guardrailTopR, samples, bounds.rightWall - 0.12, bounds.rightWall + 0.12, 0.84);

    this.ribbons.urbanFacadeL.mesh.visible = false;
    this.ribbons.urbanFacadeR.mesh.visible = false;

    this.updateRibbon(this.ribbons.edgeL, samples, bounds.leftEdge, bounds.leftEdge + 0.12, 0.045);
    this.updateRibbon(this.ribbons.edgeR, samples, bounds.rightEdge - 0.12, bounds.rightEdge, 0.045);
    this.updateRibbon(this.ribbons.centerL, samples, -0.23, -0.11, 0.052);
    this.updateRibbon(this.ribbons.centerR, samples, 0.11, 0.23, 0.052);

    for (let i = 0; i < this.laneRibbons.length; i++) {
      this.laneRibbons[i].mesh.visible = false;
    }
    const activeLanes = bounds.laneCount;
    let ribbonIdx = 0;
    for (let i = 0; i < activeLanes - 1; i++) {
      // Left side lane divider
      const offsetL = -config.laneWidth * (i + 1);
      if (ribbonIdx < this.laneRibbons.length) {
        const ribbonL = this.laneRibbons[ribbonIdx++];
        ribbonL.mesh.visible = true;
        this.updateRibbon(ribbonL, samples, offsetL - 0.055, offsetL + 0.055, 0.058, 8);
      }
      // Right side lane divider
      const offsetR = config.laneWidth * (i + 1);
      if (ribbonIdx < this.laneRibbons.length) {
        const ribbonR = this.laneRibbons[ribbonIdx++];
        ribbonR.mesh.visible = true;
        this.updateRibbon(ribbonR, samples, offsetR - 0.055, offsetR + 0.055, 0.058, 8);
      }
    }
  }

  private createRoadRibbons(): Record<string, Ribbon> {
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
    const guardrailFace = new MeshBasicMaterial({ color: 0xbdd4cc, side: DoubleSide, transparent: true, opacity: 0.88 });
    const guardrailTop = new MeshBasicMaterial({ color: 0xe7f7ef, side: DoubleSide, transparent: true, opacity: 0.94 });
    const roadSheen = new MeshBasicMaterial({ color: 0x90a096, transparent: true, opacity: 0.13, depthWrite: false, side: DoubleSide });
    const shoulderGlow = new MeshBasicMaterial({ color: 0x98f5dd, transparent: true, opacity: 0.13, depthWrite: false, side: DoubleSide });
    const yellow = new MeshBasicMaterial({ color: new Color(0xffd43f).multiplyScalar(1.38), side: DoubleSide });
    const white = new MeshBasicMaterial({ color: new Color(0xf6fff4).multiplyScalar(1.2), side: DoubleSide });
    const dashTexture = createDashTexture();
    const dashedWhite = new MeshBasicMaterial({
      color: new Color(0xf6fff4).multiplyScalar(1.2),
      map: dashTexture,
      transparent: true,
      depthWrite: false,
      side: DoubleSide
    });
    const sampleCount = ROAD_SAMPLE_COUNT;
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
      guardrailFaceL: this.createRibbon(sampleCount, guardrailFace, "guardrailFaceL"),
      guardrailFaceR: this.createRibbon(sampleCount, guardrailFace, "guardrailFaceR"),
      guardrailTopL: this.createRibbon(sampleCount, guardrailTop, "guardrailTopL"),
      guardrailTopR: this.createRibbon(sampleCount, guardrailTop, "guardrailTopR"),
      urbanFacadeL: this.createRibbon(sampleCount, facadeMaterial, "urbanFacadeL"),
      urbanFacadeR: this.createRibbon(sampleCount, facadeMaterial, "urbanFacadeR"),
      edgeL: this.createRibbon(sampleCount, white, "edgeL"),
      edgeR: this.createRibbon(sampleCount, white, "edgeR"),
      centerL: this.createRibbon(sampleCount, yellow, "centerL"),
      centerR: this.createRibbon(sampleCount, yellow, "centerR")
    };
    for (let i = 0; i < 6; i++) this.laneRibbons.push(this.createRibbon(sampleCount, dashedWhite, `lane${i}`));
    return ribbons;
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
    return { mesh, positions, uvs, sampleCount };
  }

  private updateRibbon(
    ribbon: Ribbon,
    samples: ArrayLike<number>,
    left: number,
    right: number,
    y: number,
    vScale?: number
  ): void {
    for (let i = 0; i < ribbon.sampleCount; i++) {
      const s = samples[i];
      const l = this.road.worldFromRoad(s, left, y);
      const r = this.road.worldFromRoad(s, right, y);
      const p = i * 6;
      ribbon.positions[p] = l.x;
      ribbon.positions[p + 1] = l.y;
      ribbon.positions[p + 2] = l.z;
      ribbon.positions[p + 3] = r.x;
      ribbon.positions[p + 4] = r.y;
      ribbon.positions[p + 5] = r.z;
      const v = vScale ? s / vScale : i / (ribbon.sampleCount - 1);
      const uv = i * 4;
      ribbon.uvs[uv] = 0;
      ribbon.uvs[uv + 1] = v;
      ribbon.uvs[uv + 2] = 1;
      ribbon.uvs[uv + 3] = v;
    }
    const position = ribbon.mesh.geometry.getAttribute("position");
    const uv = ribbon.mesh.geometry.getAttribute("uv");
    position.needsUpdate = true;
    uv.needsUpdate = true;
  }

  private updateVerticalRibbon(ribbon: Ribbon, samples: ArrayLike<number>, lateral: number, bottomY: number, topY: number): void {
    for (let i = 0; i < ribbon.sampleCount; i++) {
      const s = samples[i];
      const bottom = this.road.worldFromRoad(s, lateral, bottomY);
      const top = this.road.worldFromRoad(s, lateral, topY);
      const p = i * 6;
      ribbon.positions[p] = bottom.x;
      ribbon.positions[p + 1] = bottom.y;
      ribbon.positions[p + 2] = bottom.z;
      ribbon.positions[p + 3] = top.x;
      ribbon.positions[p + 4] = top.y;
      ribbon.positions[p + 5] = top.z;
      const u = i / (ribbon.sampleCount - 1);
      const uv = i * 4;
      ribbon.uvs[uv] = 0;
      ribbon.uvs[uv + 1] = u;
      ribbon.uvs[uv + 2] = 1;
      ribbon.uvs[uv + 3] = u;
    }
    const position = ribbon.mesh.geometry.getAttribute("position");
    const uv = ribbon.mesh.geometry.getAttribute("uv");
    position.needsUpdate = true;
    uv.needsUpdate = true;
  }
}
