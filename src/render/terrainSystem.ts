import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DodecahedronGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
  Object3D,
  Scene
} from "three";
import { RoadModel } from "../game/route";
import type { RenderQuality, SimSnapshot } from "../game/types";
import { hash01, lerp, smoothstep } from "../shared/math";
import { getTerrainTexture } from "./terrainTexture";

const TILE_LENGTH_M = 36;
const TILE_ROWS = 7;
const TILE_COLUMNS = 11;
const TILE_BACK_COUNT = 2;
const TILE_AHEAD_COUNT = 15;
const TILE_BUILDS_PER_FRAME = 2;
const MAX_COVER_INSTANCES = 256;

export type TerrainProfile = {
  forest: number;
  urban: number;
  buildings: number;
  reliefM: number;
  widthM: number;
  hue: number;
  saturation: number;
  lightness: number;
};

type TerrainSide = -1 | 1;

type CoverPoint = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
};

type TerrainTile = {
  mesh: Mesh<BufferGeometry, MeshStandardMaterial>;
  positions: Float32Array;
  colors: Float32Array;
  uvs: Float32Array;
  key: string;
  segment: number;
  side: TerrainSide;
  profileKey: string;
  cover: CoverPoint[];
};

type TileBuild = {
  key: string;
  segment: number;
  side: TerrainSide;
};

function terrainNoise(seed: number, x: number, z: number): number {
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const tx = smoothstep(x - x0);
  const tz = smoothstep(z - z0);
  const sample = (sx: number, sz: number) => hash01(sx * 127.1 + sz * 311.7 + seed * 17.17);
  const a = lerp(sample(x0, z0), sample(x0 + 1, z0), tx);
  const b = lerp(sample(x0, z0 + 1), sample(x0 + 1, z0 + 1), tx);
  return lerp(a, b, tz) * 2 - 1;
}

export function terrainProfileAt(road: RoadModel, s: number): TerrainProfile {
  const forest = road.roadValueAt("forest", s);
  const urban = road.roadValueAt("city", s);
  const buildings = road.roadValueAt("buildings", s);
  const reliefM = 0.18 + forest * 4.8 + (1 - buildings) * (1 - urban) * 0.65;
  return {
    forest,
    urban,
    buildings,
    reliefM,
    widthM: 62 + forest * 18 - urban * 8,
    hue: lerp(0.4, 0.46, urban),
    saturation: lerp(0.2, 0.07, urban),
    lightness: lerp(0.22, 0.27, urban)
  };
}

export function terrainProfileKey(road: RoadModel, s: number): string {
  const profile = terrainProfileAt(road, s);
  return [
    road.sceneAt(s),
    Math.round(profile.forest * 10),
    Math.round(profile.urban * 10),
    Math.round(profile.buildings * 10)
  ].join(":");
}

export function terrainHeightAt(seed: number, worldX: number, worldZ: number, distanceFromWallM: number, reliefM: number): number {
  const roadClearance = smoothstep((distanceFromWallM - 3) / 19);
  const broad = terrainNoise(seed, worldX / 92, worldZ / 92);
  const medium = terrainNoise(seed + 37, worldX / 38, worldZ / 38);
  const fine = terrainNoise(seed + 83, worldX / 17, worldZ / 17);
  const rolling = 0.52 + broad * 0.3 + medium * 0.14 + fine * 0.04;
  return -0.015 + roadClearance * reliefM * Math.max(0.08, rolling);
}

function tileKey(segment: number, side: TerrainSide): string {
  return `${segment}:${side}`;
}

export class TerrainSystem {
  private readonly root = new Group();
  private readonly material: MeshStandardMaterial;
  private readonly nearCover: InstancedMesh;
  private readonly farCover: InstancedMesh;
  private readonly active = new Map<string, TerrainTile>();
  private readonly pool: TerrainTile[] = [];
  private readonly queue: TileBuild[] = [];
  private readonly queued = new Set<string>();
  private readonly instanceDummy = new Object3D();
  private readonly tmpColor = new Color();
  private qualityMode: RenderQuality = "high";
  private lastCenterSegment = Number.NaN;

  constructor(scene: Scene, private readonly road: RoadModel) {
    this.root.name = "highTerrain";
    scene.add(this.root);

    this.material = new MeshStandardMaterial({
      color: 0xffffff,
      map: getTerrainTexture(),
      vertexColors: true,
      roughness: 0.96,
      metalness: 0,
      side: DoubleSide
    });

    this.nearCover = new InstancedMesh(
      new DodecahedronGeometry(1, 1),
      new MeshLambertMaterial({ color: 0x315044 }),
      MAX_COVER_INSTANCES
    );
    this.farCover = new InstancedMesh(
      new DodecahedronGeometry(1, 0),
      new MeshLambertMaterial({ color: 0x29433b }),
      MAX_COVER_INSTANCES
    );
    this.nearCover.name = "terrainCoverNear";
    this.farCover.name = "terrainCoverFar";
    this.nearCover.frustumCulled = false;
    this.farCover.frustumCulled = false;
    this.nearCover.count = 0;
    this.farCover.count = 0;
    this.root.add(this.nearCover, this.farCover);
  }

  setQualityMode(mode: RenderQuality): void {
    this.qualityMode = mode;
    this.root.visible = mode === "high";
    if (mode === "high") this.lastCenterSegment = Number.NaN;
  }

  update(snapshot: SimSnapshot): void {
    if (this.qualityMode !== "high") return;
    const centerSegment = Math.floor(snapshot.vehicle.roadPositionM / TILE_LENGTH_M);
    const desired = new Set<string>();
    for (let segment = Math.max(0, centerSegment - TILE_BACK_COUNT); segment <= centerSegment + TILE_AHEAD_COUNT; segment++) {
      for (const side of [-1, 1] as const) {
        const key = tileKey(segment, side);
        desired.add(key);
        const existing = this.active.get(key);
        const expectedProfile = terrainProfileKey(this.road, (segment + 0.5) * TILE_LENGTH_M);
        if (!existing || existing.profileKey !== expectedProfile) this.enqueue({ key, segment, side });
      }
    }

    for (const [key, tile] of this.active) {
      if (desired.has(key)) continue;
      this.active.delete(key);
      tile.mesh.visible = false;
      tile.key = "";
      this.pool.push(tile);
    }

    let builds = 0;
    let coverDirty = centerSegment !== this.lastCenterSegment;
    while (builds < TILE_BUILDS_PER_FRAME && this.queue.length > 0) {
      const build = this.queue.shift();
      if (!build) break;
      this.queued.delete(build.key);
      if (!desired.has(build.key)) continue;
      let tile = this.active.get(build.key);
      if (!tile) {
        tile = this.pool.pop() ?? this.createTile();
        this.active.set(build.key, tile);
      }
      this.buildTile(tile, build.segment, build.side);
      builds++;
      coverDirty = true;
    }

    if (coverDirty) this.rebuildCover(centerSegment);
    this.lastCenterSegment = centerSegment;
  }

  private enqueue(build: TileBuild): void {
    if (this.queued.has(build.key)) return;
    this.queued.add(build.key);
    this.queue.push(build);
  }

  private createTile(): TerrainTile {
    const vertexCount = TILE_ROWS * TILE_COLUMNS;
    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices: number[] = [];
    for (let row = 0; row < TILE_ROWS - 1; row++) {
      for (let column = 0; column < TILE_COLUMNS - 1; column++) {
        const a = row * TILE_COLUMNS + column;
        indices.push(a, a + TILE_COLUMNS, a + 1, a + 1, a + TILE_COLUMNS, a + TILE_COLUMNS + 1);
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("color", new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2).setUsage(DynamicDrawUsage));
    geometry.setIndex(indices);
    const mesh = new Mesh(geometry, this.material);
    mesh.visible = false;
    mesh.receiveShadow = false;
    this.root.add(mesh);
    return { mesh, positions, colors, uvs, key: "", segment: 0, side: 1, profileKey: "", cover: [] };
  }

  private buildTile(tile: TerrainTile, segment: number, side: TerrainSide): void {
    const startS = segment * TILE_LENGTH_M;
    tile.key = tileKey(segment, side);
    tile.segment = segment;
    tile.side = side;
    tile.profileKey = terrainProfileKey(this.road, startS + TILE_LENGTH_M * 0.5);
    tile.cover.length = 0;

    for (let row = 0; row < TILE_ROWS; row++) {
      const s = startS + row / (TILE_ROWS - 1) * TILE_LENGTH_M;
      const profile = terrainProfileAt(this.road, s);
      const bounds = this.road.boundsAt(s);
      const wall = side < 0 ? bounds.leftWall : bounds.rightWall;
      for (let column = 0; column < TILE_COLUMNS; column++) {
        const distance = column / (TILE_COLUMNS - 1) * profile.widthM;
        const lateral = wall + side * distance;
        const flatPoint = this.road.worldFromRoad(s, lateral, 0);
        const height = terrainHeightAt(this.road.seed, flatPoint.x, flatPoint.z, distance, profile.reliefM);
        const point = this.road.worldFromRoad(s, lateral, height);
        const vertex = row * TILE_COLUMNS + column;
        const p = vertex * 3;
        tile.positions[p] = point.x;
        tile.positions[p + 1] = point.y;
        tile.positions[p + 2] = point.z;

        const colorNoise = terrainNoise(this.road.seed + 191, point.x / 55, point.z / 55) * 0.018;
        this.tmpColor.setHSL(profile.hue, profile.saturation, profile.lightness + colorNoise);
        tile.colors[p] = this.tmpColor.r;
        tile.colors[p + 1] = this.tmpColor.g;
        tile.colors[p + 2] = this.tmpColor.b;
        const uv = vertex * 2;
        tile.uvs[uv] = point.x / 18;
        tile.uvs[uv + 1] = point.z / 18;
      }
    }

    const position = tile.mesh.geometry.getAttribute("position");
    const color = tile.mesh.geometry.getAttribute("color");
    const uv = tile.mesh.geometry.getAttribute("uv");
    position.needsUpdate = true;
    color.needsUpdate = true;
    uv.needsUpdate = true;
    tile.mesh.geometry.computeVertexNormals();
    tile.mesh.geometry.computeBoundingSphere();
    tile.mesh.visible = true;
    this.buildCoverPoints(tile);
  }

  private buildCoverPoints(tile: TerrainTile): void {
    const centerS = (tile.segment + 0.5) * TILE_LENGTH_M;
    const profile = terrainProfileAt(this.road, centerS);
    if (profile.forest < 0.14) return;
    const count = 2 + Math.floor(profile.forest * 3);
    for (let index = 0; index < count; index++) {
      const seed = tile.segment * 43.17 + tile.side * 11.3 + index * 7.91 + this.road.seed;
      const s = tile.segment * TILE_LENGTH_M + hash01(seed) * TILE_LENGTH_M;
      const bounds = this.road.boundsAt(s);
      const wall = tile.side < 0 ? bounds.leftWall : bounds.rightWall;
      const distance = 22 + hash01(seed + 3.1) * Math.max(8, profile.widthM - 26);
      const lateral = wall + tile.side * distance;
      const flatPoint = this.road.worldFromRoad(s, lateral, 0);
      const height = terrainHeightAt(this.road.seed, flatPoint.x, flatPoint.z, distance, profile.reliefM);
      tile.cover.push({
        x: flatPoint.x,
        y: height + 0.35,
        z: flatPoint.z,
        scale: 0.55 + hash01(seed + 5.2) * 1.35,
        rotation: hash01(seed + 8.7) * Math.PI * 2
      });
    }
  }

  private rebuildCover(centerSegment: number): void {
    let nearIndex = 0;
    let farIndex = 0;
    for (const tile of this.active.values()) {
      const near = Math.abs(tile.segment - centerSegment) <= 6;
      for (const point of tile.cover) {
        const target = near ? this.nearCover : this.farCover;
        const index = near ? nearIndex++ : farIndex++;
        if (index >= MAX_COVER_INSTANCES) continue;
        this.instanceDummy.position.set(point.x, point.y, point.z);
        this.instanceDummy.rotation.set(0, point.rotation, 0);
        const scale = near ? point.scale : point.scale * 1.25;
        this.instanceDummy.scale.set(scale * 1.25, scale * 0.72, scale);
        this.instanceDummy.updateMatrix();
        target.setMatrixAt(index, this.instanceDummy.matrix);
      }
    }
    this.nearCover.count = Math.min(nearIndex, MAX_COVER_INSTANCES);
    this.farCover.count = Math.min(farIndex, MAX_COVER_INSTANCES);
    this.nearCover.instanceMatrix.needsUpdate = true;
    this.farCover.instanceMatrix.needsUpdate = true;
  }
}
