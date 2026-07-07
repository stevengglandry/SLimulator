import {
  BufferAttribute,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  InstancedMesh,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SphereGeometry
} from "three";
import { SCENES } from "../game/config";
import { RoadModel } from "../game/route";
import type { RenderQuality, SceneKey, SimSnapshot } from "../game/types";
import { clamp, hash01, lerp, smoothstep, TAU } from "../shared/math";
import { createClumpyFoliageGeometry } from "./geometry";
import { roadsideSlotForScene, sceneBoundsFor, worldFromSceneRoad } from "./scenerySlots";
import { createStreetlightConeMaterial } from "./vehicleLights";

const tmpObject = new Object3D();
const tmpColor = new Color();
const CROSSWALK_MAX_STRIPES = 240;
const CROSSWALK_STRIPE_SEGMENTS = 4;
const CROSSWALK_VERTS_PER_STRIPE = (CROSSWALK_STRIPE_SEGMENTS + 1) * 2;
const BILLBOARD_PHRASES = [
  "KEEP YOUR LANE",
  "SMOOTH IS FAST",
  "CHECK MIRRORS",
  "DRIVE AHEAD",
  "MIND THE GAP",
  "CRUISE CLEAN",
  "LOOK FAR",
  "SIGNAL EARLY"
];
const SPEED_SIGN_LIMITS = [30, 50, 70] as const;

function createBuildingTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  
  // Base building wall: light gray/white so it tints beautifully
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 0, 64, 128);
  
  const cols = 4;
  const rows = 12;
  const colW = 64 / cols;
  const rowH = 128 / rows;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const randVal = (Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;
      const noise = Math.abs(randVal);
      if (noise > 0.6) {
        ctx.fillStyle = "#fff59d"; // bright light-yellow window
      } else {
        ctx.fillStyle = "#1e293b"; // dark slate window
      }
      ctx.fillRect(c * colW + 3, r * rowH + 3, colW - 6, rowH - 6);
    }
  }
  
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

function createDenseWindowTexture(seed = 0): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#d8e3e4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#6e9298";
  ctx.fillRect(0, 0, canvas.width, 5);
  ctx.fillRect(0, canvas.height - 7, canvas.width, 7);
  const cols = 6;
  const rows = 24;
  const colW = canvas.width / cols;
  const rowH = canvas.height / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = hash01(seed + row * 19.7 + col * 53.1);
      ctx.fillStyle = lit > 0.68 ? "#fff0a3" : lit > 0.36 ? "#375867" : "#183241";
      ctx.fillRect(col * colW + 4, row * rowH + 4, colW - 8, rowH - 6);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

function createBillboardTexture(text: string, seed: number): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const hue = Math.floor(170 + hash01(seed) * 180);
  ctx.fillStyle = `hsl(${hue}, 44%, 34%)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.09)";
  ctx.fillRect(0, 0, canvas.width, 42);
  ctx.fillRect(0, canvas.height - 34, canvas.width, 34);
  ctx.strokeStyle = "#c9d8d4";
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  ctx.fillStyle = "#d9e8e3";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 54px system-ui, sans-serif";
  const words = text.split(" ");
  if (words.length > 2) {
    ctx.fillText(words.slice(0, 2).join(" "), canvas.width / 2, 102);
    ctx.fillText(words.slice(2).join(" "), canvas.width / 2, 162);
  } else {
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.fillText("SLIMULATOR", canvas.width / 2, canvas.height - 28);
  return new CanvasTexture(canvas);
}

function createSpeedLimitTexture(limit: number): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 240;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#d9e0dc";
  roundRect(ctx, 18, 14, canvas.width - 36, canvas.height - 28, 14);
  ctx.fill();
  ctx.strokeStyle = "#283238";
  ctx.lineWidth = 8;
  roundRect(ctx, 18, 14, canvas.width - 36, canvas.height - 28, 14);
  ctx.stroke();
  ctx.fillStyle = "#283238";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 28px system-ui, sans-serif";
  ctx.fillText("SPEED", canvas.width / 2, 58);
  ctx.fillText("LIMIT", canvas.width / 2, 92);
  ctx.font = "900 86px system-ui, sans-serif";
  ctx.fillText(String(limit), canvas.width / 2, 162);
  return new CanvasTexture(canvas);
}

function createTransitionSignTexture(label: string): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const lines = label.split("\n");

  ctx.fillStyle = "#163b3f";
  roundRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 18);
  ctx.fill();
  ctx.strokeStyle = "#c7d7d2";
  ctx.lineWidth = 8;
  roundRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, 18);
  ctx.stroke();
  ctx.fillStyle = "#d3e1dd";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 54px system-ui, sans-serif";
  ctx.fillText(lines[0] ?? "", canvas.width / 2, 92);
  ctx.font = "900 72px system-ui, sans-serif";
  ctx.fillText(lines[1] ?? "", canvas.width / 2, 164);
  return new CanvasTexture(canvas);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

type CrosswalkPaint = {
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>;
  positions: Float32Array;
  uvs: Float32Array;
  maxStripes: number;
};

type LandmarkCounts = {
  shop: number;
  awning: number;
  bulk: number;
  lot: number;
  stripe: number;
  tower: number;
  billboardPost: number;
  billboardFace: number;
};

type SpeedSignCounts = {
  post: number;
  face: number;
};

type TransitionSignCounts = {
  post: number;
  face: number;
};

function sceneSeedShift(scene: SceneKey): number {
  if (scene === "l2") return 4099;
  if (scene === "l3") return 9970;
  return 0;
}

function transitionSignLabel(from: SceneKey, to: SceneKey): string {
  if (to === "unmapped") return "EXITING\nHWY";
  if (from === "unmapped") return "ENTERING\nHWY";
  return `ENTERING\n${to.toUpperCase()} HWY`;
}

export class ScenerySystem {
  private readonly buildingMesh: InstancedMesh;
  private readonly buildingCaps: InstancedMesh;
  private readonly treeTrunks: InstancedMesh;
  private readonly treeCrowns: InstancedMesh;
  private readonly roadsideBrush: InstancedMesh;
  private readonly trafficPoles: InstancedMesh;
  private readonly trafficLights: InstancedMesh;
  private readonly utilityPoles: InstancedMesh;
  private readonly utilityCrossbars: InstancedMesh;
  private readonly utilityWires: InstancedMesh;
  private readonly streetlightCones: InstancedMesh;
  private readonly crosswalkPaint: CrosswalkPaint;
  private readonly crosswalkLampPosts: InstancedMesh;
  private readonly crosswalkLampHeads: InstancedMesh;
  private readonly reflectorMesh: InstancedMesh;
  private readonly guardrailPosts: InstancedMesh;
  private readonly pedestrianBodies: InstancedMesh;
  private readonly pedestrianHeads: InstancedMesh;
  private readonly pedestrianArms: InstancedMesh;
  private readonly pedestrianLegs: InstancedMesh;
  private readonly urbanBlocks: InstancedMesh;
  private readonly urbanRoofCaps: InstancedMesh;
  private readonly buildingWings: InstancedMesh;
  private readonly shopBuildings: InstancedMesh;
  private readonly shopAwnings: InstancedMesh;
  private readonly bulkStores: InstancedMesh;
  private readonly parkingLots: InstancedMesh;
  private readonly parkingStripes: InstancedMesh;
  private readonly skyscrapers: InstancedMesh;
  private readonly billboardPosts: InstancedMesh;
  private readonly speedSignPosts: InstancedMesh;
  private readonly transitionSignPosts: InstancedMesh;
  private readonly billboardFaces: Array<Mesh<PlaneGeometry, MeshBasicMaterial>> = [];
  private readonly billboardMaterials: MeshBasicMaterial[];
  private readonly speedSignFaces: Array<Mesh<PlaneGeometry, MeshBasicMaterial>> = [];
  private readonly speedSignMaterials: Map<number, MeshBasicMaterial>;
  private readonly transitionSignFaces: Array<Mesh<PlaneGeometry, MeshBasicMaterial>> = [];
  private readonly transitionSignMaterials = new Map<string, MeshBasicMaterial>();
  private qualityMode: RenderQuality = "high";
  private lastUpdateKey = "";
  private speedSignScene: SceneKey | null = null;
  private speedSignSessionStartedAt = "";
  private speedSignAnchor = 0;

  constructor(private readonly scene: Scene, private readonly road: RoadModel) {
    const buildingTex = createBuildingTexture();
    this.buildingMesh = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ map: buildingTex, color: 0xffffff }), 180, true);
    this.buildingCaps = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xb4d1ca }), 180, true);
    this.treeTrunks = this.createInstanced(new CylinderGeometry(0.45, 0.55, 1, 5), new MeshLambertMaterial({ color: 0x2d5449 }), 180, true);
    this.treeCrowns = this.createInstanced(createClumpyFoliageGeometry(), new MeshLambertMaterial({ color: 0x3a7c61 }), 260, true);
    this.roadsideBrush = this.createInstanced(createClumpyFoliageGeometry(), new MeshLambertMaterial({ color: 0x356f56 }), 420, true);
    this.trafficPoles = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x789ba0 }), 90, true);
    this.trafficLights = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x102a2e, emissive: new Color(0x5def9a).multiplyScalar(4.2), emissiveIntensity: 1.0 }), 90, false);
    this.utilityPoles = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x20393d }), 180, true);
    this.utilityCrossbars = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x1d3438 }), 300, true);
    this.utilityWires = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x0c2025, transparent: true, opacity: 0.72 }), 420, false);

    const streetlightConeGeom = new ConeGeometry(2.2, 5.8, 8, 1, true);
    streetlightConeGeom.translate(0, -2.9, 0);
    this.streetlightCones = this.createInstanced(streetlightConeGeom, createStreetlightConeMaterial(), 180, false);
    this.crosswalkPaint = this.createCrosswalkPaint();
    this.crosswalkLampPosts = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x8aa9aa }), 64, true);
    this.crosswalkLampHeads = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xfff0b0, emissive: new Color(0xffdd7a).multiplyScalar(3.8), emissiveIntensity: 1.0 }), 64, false);
    this.reflectorMesh = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xdaf77f, emissive: new Color(0xd9f05a).multiplyScalar(4.6), emissiveIntensity: 1.0 }), 180, false);
    this.guardrailPosts = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x7c9293 }), 280, true);
    this.pedestrianBodies = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xd85b68 }), 48, true);
    this.pedestrianHeads = this.createInstanced(new SphereGeometry(1, 8, 6), new MeshLambertMaterial({ color: 0xf1c58f }), 48, true);
    this.pedestrianArms = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xf1c58f }), 96, true);
    this.pedestrianLegs = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x29333d }), 96, true);
    this.buildingWings = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ map: buildingTex, color: 0xffffff }), 180, true);
    this.urbanBlocks = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ map: buildingTex, color: 0xffffff }), 180, true);
    this.urbanRoofCaps = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x93b4bb }), 180, true);
    this.shopBuildings = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xcbd7d2 }), 56, true);
    this.shopAwnings = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x4ea6b1 }), 56, true);
    this.bulkStores = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xb7c6c9 }), 42, true);
    this.parkingLots = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x263034 }), 86, false);
    this.parkingStripes = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0xd9e2df }), 220, false);
    this.skyscrapers = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ map: createDenseWindowTexture(this.road.seed), color: 0xffffff }), 54, true);
    this.billboardPosts = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x223238 }), 120, true);
    this.speedSignPosts = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0xcbd5d2 }), 56, true);
    this.transitionSignPosts = this.createInstanced(new BoxGeometry(1, 1, 1), new MeshLambertMaterial({ color: 0x6f8b88 }), 8, true);
    this.billboardMaterials = BILLBOARD_PHRASES.map((phrase, index) => new MeshBasicMaterial({
      map: createBillboardTexture(phrase, this.road.seed + index * 127.3),
      color: 0xb5c2be,
      side: DoubleSide,
      fog: true
    }));
    this.speedSignMaterials = new Map(SPEED_SIGN_LIMITS.map((limit) => [limit, new MeshBasicMaterial({
      map: createSpeedLimitTexture(limit),
      color: 0xb8c2bd,
      side: DoubleSide,
      fog: true
    })]));
    this.createPlanePool(this.billboardFaces, 38, this.billboardMaterials[0], true);
    this.createPlanePool(this.speedSignFaces, 24, this.speedSignMaterials.get(30)!, true);
    this.createPlanePool(this.transitionSignFaces, 4, this.transitionSignMaterial("ENTERING\nHWY"), true);
  }

  setQualityMode(mode: RenderQuality): void {
    if (this.qualityMode === mode) return;
    this.qualityMode = mode;
    this.lastUpdateKey = "";
  }

  update(snapshot: SimSnapshot, nowSeconds: number): void {
    const settings = this.qualityMode === "high"
      ? { backDistance: 50, forwardDistance: 420, timeHz: 8, density: 1 }
      : { backDistance: 36, forwardDistance: 260, timeHz: 4, density: 0.54 };
    const transition = snapshot.road.transition;
    const transitionKey = transition ? `${transition.from}:${transition.to}:${Math.floor(transition.progress * 1000)}` : "";
    const startAnchor = Math.floor((snapshot.vehicle.roadPositionM - settings.backDistance) / 18);
    const endAnchor = Math.ceil((snapshot.vehicle.roadPositionM + settings.forwardDistance) / 18);
    const timeBucket = Math.floor(nowSeconds * settings.timeHz);
    const updateKey = `${this.qualityMode}:${startAnchor}:${endAnchor}:${timeBucket}:${snapshot.road.scene}:${transitionKey}`;
    if (updateKey === this.lastUpdateKey) return;
    this.lastUpdateKey = updateKey;

    const baseS = snapshot.vehicle.roadPositionM;
    let building = 0;
    let cap = 0;
    let trunk = 0;
    let crown = 0;
    let brush = 0;
    let pole = 0;
    let light = 0;
    let utilityPole = 0;
    let utilityCrossbar = 0;
    let utilityWire = 0;
    let streetlightCone = 0;
    let cross = 0;
    let crosswalkLampPost = 0;
    let crosswalkLampHead = 0;
    let reflectors = 0;
    let guardPost = 0;
    let pedBody = 0;
    let pedHead = 0;
    let pedArm = 0;
    let pedLeg = 0;
    let urbanBlock = 0;
    let urbanCap = 0;
    let wing = 0;
    for (let anchor = startAnchor; anchor <= endAnchor; anchor++) {
      const s = anchor * 18;
      const sceneryScene = this.road.scenerySceneAt(s);
      const sceneConfig = SCENES[sceneryScene];
      const city = sceneConfig.city;
      const forest = sceneConfig.forest;
      const crosswalkPresence = sceneConfig.crosswalks;
      const trafficLightPresence = sceneConfig.trafficLights;
      const buildingScale = sceneConfig.buildingScale;
      const safetyMargin = sceneConfig.buildingSetback;
      const skylineDensity = sceneConfig.skylineDensity;
      const buildingDensity = sceneConfig.buildings * settings.density;
      const treeDensity = sceneConfig.trees * (this.qualityMode === "high" ? 1 : 0.48);
      const activeBuildingScale = buildingScale;
      const activeUrbanScale = skylineDensity * 1.45;
      const activeUrban = skylineDensity > 0.01;
      const seedOffset = (this.road.seed + sceneSeedShift(sceneryScene)) % 10000;
      const bounds = this.road.boundsAt(s);
      const frame = this.road.frameAt(s);
      const rot = Math.PI + frame.heading;

      for (const lateral of [bounds.leftWall, bounds.rightWall]) {
        if (guardPost < this.capacity(this.guardrailPosts)) {
          const postPoint = this.road.worldFromRoad(s, lateral, 0.4);
          setInstance(this.guardrailPosts, guardPost++, postPoint.x, postPoint.y, postPoint.z, 0.16, 0.8, 0.16, rot);
        }
        if (reflectors < this.capacity(this.reflectorMesh)) {
          const p = this.road.worldFromRoad(s, lateral, 0.62);
          setInstance(this.reflectorMesh, reflectors++, p.x, p.y, p.z, 0.1, 0.18, 0.75, rot);
        }
      }

      if (city < 0.72 && buildingScale < 1.2) {
        const brushPresence = Math.min(0.96, 0.38 + forest * 0.58 + (1 - city) * 0.2);
        for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
          if (brush >= this.capacity(this.roadsideBrush)) break;
          const side = sideIndex ? 1 : -1;
          const brushSeed = anchor * 17.13 + sideIndex * 47.9 + seedOffset;
          if (hash01(brushSeed) > brushPresence) continue;
          const brushS = s + (hash01(brushSeed + 2) - 0.5) * 15;
          const height = lerp(0.55, 1.35, hash01(brushSeed + 3));
          const width = lerp(0.95, 2.75, hash01(brushSeed + 5));
          const depth = lerp(0.9, 2.65, hash01(brushSeed + 7));
          const lateralBase = side < 0 ? bounds.leftWall : bounds.rightWall;
          const offset = Math.max(3.4, width * 1.55 + 1.35 + hash01(brushSeed + 1) * 3.8);
          const lateral = lateralBase + side * offset;
          const p = this.road.worldFromRoad(brushS, lateral, height * 0.52);
          setInstance(this.roadsideBrush, brush, p.x, p.y, p.z, width, height, depth, rot + (hash01(brushSeed + 11) - 0.5) * 0.52);
          this.roadsideBrush.setColorAt(brush, tmpColor.setHSL(0.41 + hash01(brushSeed + 13) * 0.08, 0.36, 0.3 + hash01(brushSeed + 17) * 0.14));
          brush++;
        }
      }

      const isCrosswalk = crosswalkPresence > 0.35 && (anchor - 4) % 44 === 0;
      if (isCrosswalk) {
        const stripeCount = Math.max(4, Math.floor(bounds.roadWidth / 0.82));
        const paintedWidth = bounds.roadWidth - 0.62;
        const stripeLength = 5.2;
        const stripeWidth = Math.min(0.48, paintedWidth / (stripeCount * 1.55));
        const firstLateral = -paintedWidth / 2 + stripeWidth / 2;
        const stripeSpacing = paintedWidth / Math.max(1, stripeCount - 1);
        for (let i = 0; i < stripeCount && cross < this.crosswalkPaint.maxStripes; i++) {
          const lateral = firstLateral + i * stripeSpacing;
          this.writeCrosswalkStripe(cross++, s, lateral, stripeWidth, stripeLength, 0.074);
        }
        for (const lateral of [bounds.leftEdge - 1.35, bounds.rightEdge + 1.35]) {
          if (crosswalkLampPost < this.capacity(this.crosswalkLampPosts)) {
            const postPoint = this.road.worldFromRoad(s - 0.85, lateral, 2.35);
            setInstance(this.crosswalkLampPosts, crosswalkLampPost++, postPoint.x, postPoint.y, postPoint.z, 0.13, 4.7, 0.13, rot);
          }
          if (crosswalkLampHead < this.capacity(this.crosswalkLampHeads)) {
            const headPoint = this.road.worldFromRoad(s - 0.85, lateral, 4.85);
            setInstance(this.crosswalkLampHeads, crosswalkLampHead++, headPoint.x, headPoint.y, headPoint.z, 0.52, 0.18, 0.34, rot + Math.PI / 2);
          }
          if (streetlightCone < this.capacity(this.streetlightCones)) {
            const conePoint = this.road.worldFromRoad(s - 0.85, lateral, 4.78);
            setInstance(this.streetlightCones, streetlightCone++, conePoint.x, conePoint.y, conePoint.z, 0.72, 0.72, 0.72, rot);
          }
        }
        const ped = this.road.pedestrianAt(anchor, nowSeconds);
        if (
          ped.active &&
          pedBody < this.capacity(this.pedestrianBodies) &&
          pedHead < this.capacity(this.pedestrianHeads) &&
          pedArm + 1 < this.capacity(this.pedestrianArms) &&
          pedLeg + 1 < this.capacity(this.pedestrianLegs)
        ) {
          const sway = Math.sin(nowSeconds * 2.2 + anchor) * 0.08;
          const walk = Math.sin(nowSeconds * 3.1 + anchor) * 0.08;
          const torso = this.road.worldFromRoad(s - 1.3, ped.lateral + sway, 0.82);
          setInstance(this.pedestrianBodies, pedBody++, torso.x, torso.y, torso.z, 0.26, 0.68, 0.2, rot);
          const head = this.road.worldFromRoad(s - 1.3, ped.lateral + sway, 1.28);
          setInstance(this.pedestrianHeads, pedHead++, head.x, head.y, head.z, 0.18, 0.2, 0.18, rot);
          for (const armOffset of [-0.22, 0.22]) {
            const armPoint = this.road.worldFromRoad(s - 1.3, ped.lateral + sway + armOffset, 0.78);
            setInstance(this.pedestrianArms, pedArm++, armPoint.x, armPoint.y, armPoint.z, 0.06, 0.48, 0.07, rot);
          }
          for (const legOffset of [-0.07, 0.07]) {
            const legPoint = this.road.worldFromRoad(s - 1.3 + walk * Math.sign(legOffset), ped.lateral + sway + legOffset, 0.3);
            setInstance(this.pedestrianLegs, pedLeg++, legPoint.x, legPoint.y, legPoint.z, 0.07, 0.52, 0.08, rot);
          }
        }
        if (trafficLightPresence > 0.45) {
          for (const lateral of [bounds.leftEdge - 3.4, bounds.rightEdge + 3.4]) {
            const p = this.road.worldFromRoad(s + 2.8, lateral, 2.65);
            if (pole < this.capacity(this.trafficPoles)) setInstance(this.trafficPoles, pole++, p.x, p.y, p.z, 0.14, 5.3, 0.14, rot);
            if (light < this.capacity(this.trafficLights)) setInstance(this.trafficLights, light++, p.x, 5.15, p.z, 0.46, 0.8, 0.24, rot);
          }
        }
      }

      if (activeUrban && anchor % (activeUrbanScale > 1.1 ? 2 : 3) === 0) {
        for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
          if (urbanBlock >= this.capacity(this.urbanBlocks) || urbanCap >= this.capacity(this.urbanRoofCaps)) break;
          if (this.reservesBillboardSlot(anchor, sideIndex)) continue;
          const side = sideIndex ? 1 : -1;
          const blockSeed = anchor * 23.9 + sideIndex * 71.1 + seedOffset;
          const lateralBase = (side < 0 ? bounds.leftWall : bounds.rightWall) + side * (safetyMargin + lerp(12, 36, hash01(blockSeed)));
          const height = lerp(activeUrbanScale > 1.1 ? 42 : 24, activeUrbanScale > 1.1 ? 100 : 52, hash01(blockSeed + 3)) * skylineDensity;
          const width = lerp(activeUrbanScale > 1.1 ? 16 : 12, activeUrbanScale > 1.1 ? 38 : 28, hash01(blockSeed + 5)) * skylineDensity;
          const depth = lerp(activeUrbanScale > 1.1 ? 18 : 14, activeUrbanScale > 1.1 ? 42 : 32, hash01(blockSeed + 7)) * skylineDensity;
          const blockS = s + (hash01(blockSeed + 11) - 0.5) * 7;
          const p = this.road.worldFromRoad(blockS, lateralBase, height / 2);
          setInstance(this.urbanBlocks, urbanBlock, p.x, p.y, p.z, width, height, depth, rot + (hash01(blockSeed + 13) - 0.5) * 0.18);
          this.urbanBlocks.setColorAt(urbanBlock, tmpColor.setHSL(0.53 + hash01(blockSeed + 17) * 0.06, 0.26, 0.42 + hash01(blockSeed + 19) * 0.18));
          const capPoint = this.road.worldFromRoad(blockS, lateralBase, height + 0.42);
          setInstance(this.urbanRoofCaps, urbanCap, capPoint.x, capPoint.y, capPoint.z, width * 0.78, 0.48, depth * 0.78, rot);
          this.urbanRoofCaps.setColorAt(urbanCap, tmpColor.setHSL(0.47 + hash01(blockSeed + 29) * 0.08, 0.18, 0.58 + hash01(blockSeed + 31) * 0.12));
          urbanBlock++;
          urbanCap++;
        }
      }

      if (anchor % 4 === 0 && city < 0.55 && buildingScale < 1.15) {
        for (const lateral of [bounds.leftWall - 2.8, bounds.rightWall + 2.8]) {
          if (utilityPole >= this.capacity(this.utilityPoles)) break;
          const polePoint = this.road.worldFromRoad(s + 3, lateral, 4.15);
          setInstance(this.utilityPoles, utilityPole++, polePoint.x, polePoint.y, polePoint.z, 0.18, 8.3, 0.18, rot);
          const crossPoint = this.road.worldFromRoad(s + 3, lateral, 7.2);
          setInstance(this.utilityCrossbars, utilityCrossbar++, crossPoint.x, crossPoint.y, crossPoint.z, 0.12, 0.12, 4.3, rot + Math.PI / 2);
          if (utilityCrossbar < this.capacity(this.utilityCrossbars)) {
            const crown = this.road.worldFromRoad(s + 3, lateral, 7.68);
            setInstance(this.utilityCrossbars, utilityCrossbar++, crown.x, crown.y, crown.z, 0.09, 0.09, 2.7, rot + Math.PI / 2);
          }
          if (this.qualityMode === "high" && s >= baseS + 28) {
            for (const wireOffset of [-1.35, -0.45, 0.45, 1.35]) {
              if (utilityWire >= this.capacity(this.utilityWires)) break;
              const wirePoint = this.road.worldFromRoad(s + 58, lateral + wireOffset, 7.74 + Math.abs(wireOffset) * 0.04);
              setInstance(this.utilityWires, utilityWire++, wirePoint.x, wirePoint.y, wirePoint.z, 0.016, 0.016, 46, rot);
            }
          }
          if (this.qualityMode === "high" && streetlightCone < this.capacity(this.streetlightCones)) {
            const offset = lateral < 0 ? 1.7 : -1.7;
            const lightPoint = this.road.worldFromRoad(s + 3, lateral + offset, 6.9);
            setInstance(this.streetlightCones, streetlightCone++, lightPoint.x, lightPoint.y, lightPoint.z, 1.0, 1.0, 1.0, rot);
          }
        }
      }

      for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
        if (this.reservesBillboardSlot(anchor, sideIndex)) continue;
        const side = sideIndex ? 1 : -1;
        const h = hash01(anchor * 11.17 + sideIndex * 43 + seedOffset);
        const objectS = s + (hash01(anchor * 5.13 + sideIndex) - 0.5) * 12;
        const objectBounds = this.road.boundsAt(objectS);
        const clearance = side < 0 ? objectBounds.leftWall : objectBounds.rightWall;
        const nearOffset = forest > 0.45 ? 8.2 : activeBuildingScale > 0 ? 6.6 : 13.5;
        const farOffset = forest > 0.45 ? 38 : activeBuildingScale > 1.1 ? 30 : activeBuildingScale > 0 ? 28 : 44;
        const offsetBase = clearance + side * lerp(nearOffset, farOffset, h);
        const forcedUrbanBuilding = activeBuildingScale > 0.05 && skylineDensity > 0.05 && anchor > startAnchor + 2 && anchor % (activeBuildingScale > 1.1 ? 2 : 4) === sideIndex;

        const frame = this.road.frameAt(objectS);
        const rot = Math.PI + frame.heading;

        const buildingVisibility = forcedUrbanBuilding ? 1 : smoothstep(clamp((buildingDensity - h + 0.16) / 0.34, 0, 1));
        if (activeBuildingScale > 0 && buildingVisibility > 0.04) {
          if (building >= this.capacity(this.buildingMesh) || cap >= this.capacity(this.buildingCaps)) continue;
          const shapeSeed = anchor * 12.31 + sideIndex * 91.7 + seedOffset;
          const growthScale = forcedUrbanBuilding ? 1 : lerp(0.38, 1, buildingVisibility);
          const baseHeight = forcedUrbanBuilding ? lerp(18, activeBuildingScale > 1.1 ? 66 : 38, hash01(shapeSeed + 5)) : lerp(10, activeBuildingScale > 1.1 ? 58 : 44, Math.pow(hash01(shapeSeed), 0.75));
          const height = baseHeight * activeBuildingScale * growthScale;
          const width = lerp(6.5, activeBuildingScale > 1.1 ? 26 : 20, hash01(shapeSeed + 3)) * lerp(0.72, 1, growthScale);
          const depth = lerp(7, activeBuildingScale > 1.1 ? 30 : 22, hash01(shapeSeed + 7)) * lerp(0.72, 1, growthScale);

          // Calculate safety margin and setback based on the diagonal radius
          const diagonalRadius = Math.sqrt(width * width + depth * depth) / 2;
          const minSetback = diagonalRadius + safetyMargin;
          
          const jitter = (hash01(shapeSeed + 11) - 0.5) * 2.8;
          const randomSetback = lerp(4.0, 24.0, hash01(shapeSeed + 2));
          const baseOffset = clearance + side * (minSetback + randomSetback) + jitter;
          // Clamp to guarantee it is strictly outside the minSetback from the guardrail:
          const buildingOffset = side < 0 ? Math.min(clearance - minSetback, baseOffset) : Math.max(clearance + minSetback, baseOffset);

          const p = this.road.worldFromRoad(objectS, buildingOffset, height / 2);
          setInstance(this.buildingMesh, building, p.x, p.y, p.z, width, height, depth, rot + (hash01(shapeSeed + 13) - 0.5) * 0.4);
          this.buildingMesh.setColorAt(building, tmpColor.setHSL(0.54 + hash01(shapeSeed + 17) * 0.08, 0.28, 0.34 + hash01(shapeSeed + 19) * 0.22));
          const cp = this.road.worldFromRoad(objectS, buildingOffset, height + 0.35);
          setInstance(this.buildingCaps, cap++, cp.x, cp.y, cp.z, width * 0.78, 0.48, depth * 0.78, rot);
          building++;

          // Optional building wing for detail (always projects away from the road using wingSide = side)
          if (this.qualityMode === "high" && hash01(shapeSeed + 37) > 0.36 && wing < this.capacity(this.buildingWings)) {
            const wingW = width * lerp(0.4, 0.75, hash01(shapeSeed + 41));
            const wingH = height * lerp(0.35, 0.8, hash01(shapeSeed + 43));
            const wingD = depth * lerp(0.4, 0.75, hash01(shapeSeed + 47));
            const wingSide = side; // Always project away from the road (left side goes left, right side goes right)
            const wingOffset = buildingOffset;
            const wingLateral = wingOffset + wingSide * (width + wingW) / 2;
            const wp = this.road.worldFromRoad(objectS, wingLateral, wingH / 2);
            setInstance(this.buildingWings, wing++, wp.x, wp.y, wp.z, wingW, wingH, wingD, rot);
            this.buildingWings.setColorAt(wing - 1, tmpColor.setHSL(0.53 + hash01(shapeSeed + 59) * 0.08, 0.26, 0.3 + hash01(shapeSeed + 61) * 0.18));
          }
        } else {
          // Spawn trees based on treeDensity (supporting multiple trees per anchor when treeDensity > 1)
          const treesCount = Math.floor(treeDensity) + (h < (treeDensity % 1) ? 1 : 0);
          for (let tIdx = 0; tIdx < treesCount; tIdx++) {
            if (trunk >= this.capacity(this.treeTrunks) || crown >= this.capacity(this.treeCrowns)) break;
            const treeSeed = anchor * 15.41 + sideIndex * 59.3 + tIdx * 113.7 + seedOffset;
            const height = forest > 0.45 ? lerp(7.4, 21, hash01(treeSeed)) : lerp(5.4, 14.6, hash01(treeSeed));
            const treeLateral = offsetBase + (hash01(treeSeed + 11) - 0.5) * 8.0;
            const treeS = objectS + (hash01(treeSeed + 13) - 0.5) * 10.0;

            const p = this.road.worldFromRoad(treeS, treeLateral, 0);
            const trunkHeight = height * 0.44;
            setInstance(this.treeTrunks, trunk++, p.x, trunkHeight * 0.5, p.z, 0.62, trunkHeight, 0.62, rot);
            const crownScale = forest > 0.45 ? 1.34 : 1.08;
            const cp = this.road.worldFromRoad(treeS, treeLateral, trunkHeight);
            setInstance(this.treeCrowns, crown, cp.x, cp.y, cp.z, 3.3 * crownScale, 2.5 * crownScale, 3.0 * crownScale, hash01(treeSeed + 19) * TAU);
            this.treeCrowns.setColorAt(crown, tmpColor.setHSL(0.42 + hash01(treeSeed + 23) * 0.05, 0.46, 0.28 + hash01(treeSeed + 29) * 0.14));
            crown++;
          }
        }
      }
    }

    for (const urbanSpacing of [42, 56]) {
      const startUrbanAnchor = Math.floor((baseS - settings.backDistance) / urbanSpacing);
      const endUrbanAnchor = Math.ceil((baseS + settings.forwardDistance) / urbanSpacing);

      for (let anchor = startUrbanAnchor; anchor <= endUrbanAnchor; anchor++) {
        const s = anchor * urbanSpacing;
        const sceneryScene = this.road.scenerySceneAt(s);
        const sceneConfig = SCENES[sceneryScene];
        const skylineDensity = sceneConfig.skylineDensity;
        if (skylineDensity <= 0.01) continue;
        const activeUrbanScale = skylineDensity * 1.45;
        if ((activeUrbanScale > 1.1 && urbanSpacing !== 42) || (activeUrbanScale <= 1.1 && urbanSpacing !== 56)) continue;
        const safetyMargin = sceneConfig.buildingSetback;
        const seedOffset = (this.road.seed + sceneSeedShift(sceneryScene)) % 10000;
        const bounds = this.road.boundsAt(s);
        const frame = this.road.frameAt(s);
        const rot = Math.PI + frame.heading;
        for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
          if (urbanBlock >= this.capacity(this.urbanBlocks) || urbanCap >= this.capacity(this.urbanRoofCaps)) break;
          const side = sideIndex ? 1 : -1;
          const blockSeed = anchor * 31.7 + sideIndex * 79.3 + seedOffset;
          // Position them much further back (setback of 116 to 170 meters) to form a background skyline and avoid overlapping the road or closer buildings
          const lateral = (side < 0 ? bounds.leftWall : bounds.rightWall) + side * (safetyMargin + lerp(36, 90, hash01(blockSeed)));
          const baseHeight = lerp(activeUrbanScale > 1.1 ? 48 : 24, activeUrbanScale > 1.1 ? 110 : 48, hash01(blockSeed + 3));
          const baseWidth = lerp(activeUrbanScale > 1.1 ? 18 : 12, activeUrbanScale > 1.1 ? 42 : 28, hash01(blockSeed + 5));
          const baseDepth = lerp(activeUrbanScale > 1.1 ? 20 : 14, activeUrbanScale > 1.1 ? 46 : 32, hash01(blockSeed + 7));
          const height = baseHeight * skylineDensity;
          const width = baseWidth * skylineDensity;
          const depth = baseDepth * skylineDensity;
          const p = this.road.worldFromRoad(s + (hash01(blockSeed + 11) - 0.5) * 5, lateral, height / 2);
          setInstance(this.urbanBlocks, urbanBlock, p.x, p.y, p.z, width, height, depth, rot + (hash01(blockSeed + 13) - 0.5) * 0.16);
          this.urbanBlocks.setColorAt(urbanBlock, tmpColor.setHSL(0.53 + hash01(blockSeed + 17) * 0.06, 0.26, 0.46 + hash01(blockSeed + 19) * 0.18));
          const cp = this.road.worldFromRoad(s, lateral, height + 0.42);
          setInstance(this.urbanRoofCaps, urbanCap, cp.x, cp.y, cp.z, width * 0.76, 0.5, depth * 0.76, rot);
          this.urbanRoofCaps.setColorAt(urbanCap, tmpColor.setHSL(0.47 + hash01(blockSeed + 29) * 0.08, 0.18, 0.58 + hash01(blockSeed + 31) * 0.14));
          urbanBlock++;
          urbanCap++;
        }
      }
    }

    const landmarkCounts = this.writeLandmarks(startAnchor, endAnchor);
    const speedSignCounts = this.writeSpeedSigns(snapshot, startAnchor, endAnchor);
    const transitionSignCounts = this.writeTransitionSign(snapshot, startAnchor, endAnchor);
    this.applyCrosswalkCount(cross);
    this.applyCounts([
      [this.buildingMesh, building],
      [this.buildingCaps, cap],
      [this.buildingWings, wing],
      [this.treeTrunks, trunk],
      [this.treeCrowns, crown],
      [this.roadsideBrush, brush],
      [this.trafficPoles, pole],
      [this.trafficLights, light],
      [this.utilityPoles, utilityPole],
      [this.utilityCrossbars, utilityCrossbar],
      [this.utilityWires, utilityWire],
      [this.streetlightCones, streetlightCone],
      [this.crosswalkLampPosts, crosswalkLampPost],
      [this.crosswalkLampHeads, crosswalkLampHead],
      [this.reflectorMesh, reflectors],
      [this.guardrailPosts, guardPost],
      [this.pedestrianBodies, pedBody],
      [this.pedestrianHeads, pedHead],
      [this.pedestrianArms, pedArm],
      [this.pedestrianLegs, pedLeg],
      [this.urbanBlocks, urbanBlock],
      [this.urbanRoofCaps, urbanCap],
      [this.shopBuildings, landmarkCounts.shop],
      [this.shopAwnings, landmarkCounts.awning],
      [this.bulkStores, landmarkCounts.bulk],
      [this.parkingLots, landmarkCounts.lot],
      [this.parkingStripes, landmarkCounts.stripe],
      [this.skyscrapers, landmarkCounts.tower],
      [this.billboardPosts, landmarkCounts.billboardPost],
      [this.speedSignPosts, speedSignCounts.post],
      [this.transitionSignPosts, transitionSignCounts.post]
    ]);
    this.hidePlanePool(this.billboardFaces, landmarkCounts.billboardFace);
    this.hidePlanePool(this.speedSignFaces, speedSignCounts.face);
    this.hidePlanePool(this.transitionSignFaces, transitionSignCounts.face);
  }

  private writeLandmarks(startAnchor: number, endAnchor: number): LandmarkCounts {
    const counts: LandmarkCounts = { shop: 0, awning: 0, bulk: 0, lot: 0, stripe: 0, tower: 0, billboardPost: 0, billboardFace: 0 };
    const spacing = this.qualityMode === "high" ? 4 : 6;

    for (let anchor = startAnchor; anchor <= endAnchor; anchor++) {
      const scene = this.road.scenerySceneAt(anchor * 18);
      const seedShift = sceneSeedShift(scene);
      const layerSeed = this.road.seed + seedShift;
      const baseScale = 1;
      if (positiveModulo(anchor + Math.floor(seedShift / 997), spacing) !== 0) continue;
      for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
        const preview = roadsideSlotForScene(scene, anchor, sideIndex, layerSeed, 8);
          if (preview.variant === "standard") continue;
          if (this.qualityMode === "perf" && hash01(layerSeed + anchor * 13.1 + sideIndex * 71.7) > 0.66) continue;

          const radius = preview.variant === "bulk" ? 20 : preview.variant === "skyscraper" ? 14 : preview.variant === "billboard" ? 11 : 8;
          const slot = roadsideSlotForScene(scene, anchor, sideIndex, layerSeed, radius);
          const s = anchor * 18 + slot.sOffset;
          const point = worldFromSceneRoad(scene, s, slot.lateral, 0, this.road.seed);
          const rot = Math.PI + point.heading + slot.rotationJitter;
          const faceRot = point.heading + slot.rotationJitter * 0.3;
          const shapeSeed = layerSeed + anchor * 29.7 + sideIndex * 97.3;
          const scale = clamp(baseScale * lerp(0.88, 1.08, hash01(shapeSeed + 1)), 0, 1);
          if (scale < 0.035) continue;

          if (slot.variant === "shop") {
            if (counts.shop >= this.capacity(this.shopBuildings) || counts.awning >= this.capacity(this.shopAwnings)) continue;
            const width = lerp(7.8, 11.8, hash01(shapeSeed + 3)) * lerp(0.72, 1, scale);
            const height = lerp(3.3, 5.0, hash01(shapeSeed + 5)) * scale;
            const depth = lerp(6.4, 9.0, hash01(shapeSeed + 7)) * lerp(0.78, 1, scale);
            const p = worldFromSceneRoad(scene, s, slot.lateral, height * 0.5, this.road.seed);
            setInstance(this.shopBuildings, counts.shop, p.x, p.y, p.z, width, height, depth, rot);
            this.shopBuildings.setColorAt(counts.shop, tmpColor.setHSL(0.48 + hash01(shapeSeed + 13) * 0.12, 0.22, 0.62 + hash01(shapeSeed + 17) * 0.13));
            counts.shop++;

            const awningPoint = worldFromSceneRoad(scene, s - slot.side * 0.2, slot.lateral - slot.side * width * 0.18, Math.max(1.1, height * 0.66), this.road.seed);
            setInstance(this.shopAwnings, counts.awning, awningPoint.x, awningPoint.y, awningPoint.z, width * 0.82, 0.34 * scale, 1.1 * scale, rot);
            this.shopAwnings.setColorAt(counts.awning, tmpColor.setHSL(0.02 + hash01(shapeSeed + 19) * 0.56, 0.54, 0.48));
            counts.awning++;
            this.writeParkingLot(counts, scene, s, slot.side, slot.clearance, rot, 11.5, 14.5, scale, shapeSeed);
            continue;
          }

          if (slot.variant === "bulk") {
            if (counts.bulk >= this.capacity(this.bulkStores)) continue;
            const width = lerp(24, 36, hash01(shapeSeed + 23)) * lerp(0.72, 1, scale);
            const height = lerp(5.5, 8.5, hash01(shapeSeed + 29)) * scale;
            const depth = lerp(14, 22, hash01(shapeSeed + 31)) * lerp(0.78, 1, scale);
            const p = worldFromSceneRoad(scene, s, slot.lateral, height * 0.5, this.road.seed);
            setInstance(this.bulkStores, counts.bulk, p.x, p.y, p.z, width, height, depth, rot);
            this.bulkStores.setColorAt(counts.bulk, tmpColor.setHSL(0.52 + hash01(shapeSeed + 37) * 0.08, 0.16, 0.56 + hash01(shapeSeed + 41) * 0.12));
            counts.bulk++;
            this.writeParkingLot(counts, scene, s, slot.side, slot.clearance, rot, 24, 32, scale, shapeSeed + 47);
            continue;
          }

          if (slot.variant === "skyscraper") {
            if (counts.tower >= this.capacity(this.skyscrapers)) continue;
            const width = lerp(10, 18, hash01(shapeSeed + 43)) * lerp(0.72, 1, scale);
            const height = lerp(48, 112, hash01(shapeSeed + 47)) * scale;
            const depth = lerp(10, 22, hash01(shapeSeed + 53)) * lerp(0.72, 1, scale);
            const p = worldFromSceneRoad(scene, s, slot.lateral, height * 0.5, this.road.seed);
            setInstance(this.skyscrapers, counts.tower, p.x, p.y, p.z, width, height, depth, rot + (hash01(shapeSeed + 59) - 0.5) * 0.12);
            this.skyscrapers.setColorAt(counts.tower, tmpColor.setHSL(0.54 + hash01(shapeSeed + 61) * 0.08, 0.22, 0.5 + hash01(shapeSeed + 67) * 0.14));
            counts.tower++;
            continue;
          }

          if (slot.variant === "billboard") {
            if (
              counts.billboardPost + 1 >= this.capacity(this.billboardPosts) ||
              counts.billboardFace >= this.planeCapacity(this.billboardFaces)
            ) {
              continue;
            }
            const signWidth = lerp(13, 18, hash01(shapeSeed + 71)) * lerp(0.72, 1, scale);
            const signHeight = lerp(5.8, 8.5, hash01(shapeSeed + 73)) * scale;
            const postHeight = 4.6 + signHeight * 0.54;
            for (const lateralOffset of [-signWidth * 0.42, signWidth * 0.42]) {
              const post = worldFromSceneRoad(scene, s, slot.lateral + lateralOffset, postHeight * 0.5, this.road.seed);
              setInstance(this.billboardPosts, counts.billboardPost++, post.x, post.y, post.z, 0.26, postHeight, 0.26, rot);
            }
            const facePoint = worldFromSceneRoad(scene, s, slot.lateral, postHeight + signHeight * 0.12, this.road.seed);
            const materialIndex = Math.floor(hash01(shapeSeed + 79) * this.billboardMaterials.length) % this.billboardMaterials.length;
            this.setPlane(this.billboardFaces, counts.billboardFace++, facePoint.x, facePoint.y, facePoint.z, signWidth, signHeight, faceRot, this.billboardMaterials[materialIndex]);
          }
        }
      }
    return counts;
  }

  private reservesBillboardSlot(anchor: number, sideIndex: number): boolean {
    const spacing = this.qualityMode === "high" ? 4 : 6;
    const scene = this.road.scenerySceneAt(anchor * 18);
    const seedShift = sceneSeedShift(scene);
    if (positiveModulo(anchor + Math.floor(seedShift / 997), spacing) !== 0) return false;
    const layerSeed = this.road.seed + seedShift;
    return roadsideSlotForScene(scene, anchor, sideIndex, layerSeed, 11).variant === "billboard";
  }

  private writeParkingLot(
    counts: LandmarkCounts,
    scene: SceneKey,
    s: number,
    side: -1 | 1,
    clearance: number,
    rot: number,
    lateralDepth: number,
    roadLength: number,
    scale: number,
    seed: number
  ): void {
    if (counts.lot >= this.capacity(this.parkingLots)) return;
    const lotLateral = clearance + side * (2.8 + lateralDepth * 0.5);
    const lotS = s + (hash01(seed + 3) - 0.5) * 2.5;
    const p = worldFromSceneRoad(scene, lotS, lotLateral, 0.055, this.road.seed);
    setInstance(this.parkingLots, counts.lot++, p.x, p.y, p.z, lateralDepth * lerp(0.7, 1, scale), 0.08, roadLength * lerp(0.72, 1, scale), rot);
    if (scale < 0.34) return;
    const stripeCount = this.qualityMode === "high" ? 5 : 3;
    for (let i = 0; i < stripeCount && counts.stripe < this.capacity(this.parkingStripes); i++) {
      const t = i / (stripeCount - 1);
      const stripeS = lotS + lerp(-roadLength * 0.34, roadLength * 0.34, t);
      const stripe = worldFromSceneRoad(scene, stripeS, lotLateral, 0.12, this.road.seed);
      setInstance(this.parkingStripes, counts.stripe++, stripe.x, stripe.y, stripe.z, lateralDepth * 0.58, 0.035, 0.11, rot);
    }
  }

  private writeSpeedSigns(snapshot: SimSnapshot, startAnchor: number, endAnchor: number): SpeedSignCounts {
    const counts: SpeedSignCounts = { post: 0, face: 0 };
    if (snapshot.road.transition) return counts;
    const scene = snapshot.road.scene;
    const sessionStartedAt = snapshot.session.startedAt ?? "";
    if (this.speedSignScene !== scene || this.speedSignSessionStartedAt !== sessionStartedAt) {
      this.speedSignScene = scene;
      this.speedSignSessionStartedAt = sessionStartedAt;
      this.speedSignAnchor = Math.ceil((snapshot.vehicle.roadPositionM + 76) / 18);
    }
    const limit = SCENES[scene].speedLimitMph;
    const material = this.speedSignMaterials.get(limit);
    if (!material) return counts;
    if (this.speedSignAnchor < startAnchor || this.speedSignAnchor > endAnchor) return counts;
    const bounds = sceneBoundsFor(scene);
    if (
      counts.post >= this.capacity(this.speedSignPosts) ||
      counts.face >= this.planeCapacity(this.speedSignFaces)
    ) {
      return counts;
    }
    const s = this.speedSignAnchor * 18 + 7;
    const lateral = bounds.rightWall + 3.0;
    const postHeight = 2.27;
    const signHeight = 2.12;
    const signWidth = 1.7;
    const base = worldFromSceneRoad(scene, s, lateral, postHeight * 0.5, this.road.seed);
    setInstance(this.speedSignPosts, counts.post++, base.x, base.y, base.z, 0.12, postHeight, 0.12, base.heading);
    const faceY = postHeight + 0.16 + signHeight * 0.5;
    const face = worldFromSceneRoad(scene, s, lateral, faceY, this.road.seed);
    this.setPlane(this.speedSignFaces, counts.face++, face.x, face.y, face.z, signWidth, signHeight, face.heading, material);
    return counts;
  }

  private writeTransitionSign(snapshot: SimSnapshot, startAnchor: number, endAnchor: number): TransitionSignCounts {
    const counts: TransitionSignCounts = { post: 0, face: 0 };
    const transition = snapshot.road.transition;
    if (!transition) return counts;

    const markerS = transition.originS + Math.min(82, Math.max(58, (transition.taperStartS - transition.originS) * 0.28));
    const markerAnchor = Math.floor(markerS / 18);
    if (markerAnchor < startAnchor || markerAnchor > endAnchor) return counts;
    if (counts.face >= this.planeCapacity(this.transitionSignFaces) || counts.post + 2 > this.capacity(this.transitionSignPosts)) return counts;

    const label = transitionSignLabel(transition.from, transition.to);
    const material = this.transitionSignMaterial(label);
    const bounds = this.road.boundsAt(markerS);
    const lateral = bounds.rightEdge + 4.2;
    const postHeight = 3.55;
    const signWidth = 6.9;
    const signHeight = 2.75;
    const framePoint = this.road.worldFromRoad(markerS, lateral, 0);
    const rot = framePoint.heading;

    for (const lateralOffset of [-signWidth * 0.34, signWidth * 0.34]) {
      const post = this.road.worldFromRoad(markerS, lateral + lateralOffset, postHeight * 0.5);
      setInstance(this.transitionSignPosts, counts.post++, post.x, post.y, post.z, 0.16, postHeight, 0.16, rot);
    }
    const faceY = postHeight + 0.22 + signHeight * 0.5;
    const face = this.road.worldFromRoad(markerS, lateral, faceY);
    this.setPlane(this.transitionSignFaces, counts.face++, face.x, face.y, face.z, signWidth, signHeight, rot, material);
    return counts;
  }

  private transitionSignMaterial(label: string): MeshBasicMaterial {
    const existing = this.transitionSignMaterials.get(label);
    if (existing) return existing;
    const material = new MeshBasicMaterial({
      map: createTransitionSignTexture(label),
      color: 0xc1ccc8,
      side: DoubleSide,
      fog: true
    });
    this.transitionSignMaterials.set(label, material);
    return material;
  }

  private createInstanced(geometry: BufferGeometry, material: Material, count: number, shadows: boolean): InstancedMesh {
    const mesh = new InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.castShadow = shadows;
    mesh.receiveShadow = shadows;
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    return mesh;
  }

  private createPlanePool(pool: Array<Mesh<PlaneGeometry, MeshBasicMaterial>>, count: number, material: MeshBasicMaterial, shadows: boolean): void {
    for (let i = 0; i < count; i++) {
      const mesh = new Mesh(new PlaneGeometry(1, 1), material);
      mesh.visible = false;
      mesh.castShadow = shadows;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      this.scene.add(mesh);
      pool.push(mesh);
    }
  }

  private setPlane(
    pool: Array<Mesh<PlaneGeometry, MeshBasicMaterial>>,
    index: number,
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    rotY: number,
    material: MeshBasicMaterial
  ): void {
    const mesh = pool[index];
    if (!mesh) return;
    mesh.material = material;
    mesh.visible = true;
    mesh.position.set(x, y, z);
    mesh.rotation.set(0, rotY, 0);
    mesh.scale.set(width, height, 1);
  }

  private hidePlanePool(pool: Array<Mesh<PlaneGeometry, MeshBasicMaterial>>, visibleCount: number): void {
    for (let i = 0; i < pool.length; i++) {
      pool[i].visible = i < visibleCount;
    }
  }

  private createCrosswalkPaint(): CrosswalkPaint {
    const vertexCount = CROSSWALK_MAX_STRIPES * CROSSWALK_VERTS_PER_STRIPE;
    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices: number[] = [];

    for (let i = 0; i < vertexCount; i++) normals[i * 3 + 1] = 1;
    for (let stripe = 0; stripe < CROSSWALK_MAX_STRIPES; stripe++) {
      const vertexBase = stripe * CROSSWALK_VERTS_PER_STRIPE;
      for (let segment = 0; segment < CROSSWALK_STRIPE_SEGMENTS; segment++) {
        const a = vertexBase + segment * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("normal", new BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2).setUsage(DynamicDrawUsage));
    geometry.setIndex(indices);
    geometry.setDrawRange(0, 0);

    const material = new MeshBasicMaterial({
      color: 0xe9eee7,
      depthWrite: false,
      side: DoubleSide
    });
    const mesh = new Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = 14;
    this.scene.add(mesh);
    return { mesh, positions, uvs, maxStripes: CROSSWALK_MAX_STRIPES };
  }

  private writeCrosswalkStripe(index: number, centerS: number, lateral: number, width: number, length: number, y: number): void {
    const vertexBase = index * CROSSWALK_VERTS_PER_STRIPE;
    const halfWidth = width * 0.5;
    const halfLength = length * 0.5;

    for (let segment = 0; segment <= CROSSWALK_STRIPE_SEGMENTS; segment++) {
      const t = segment / CROSSWALK_STRIPE_SEGMENTS;
      const sampleS = centerS - halfLength + t * length;
      const left = this.road.worldFromRoad(sampleS, lateral - halfWidth, y);
      const right = this.road.worldFromRoad(sampleS, lateral + halfWidth, y);
      const positionOffset = (vertexBase + segment * 2) * 3;
      this.crosswalkPaint.positions[positionOffset] = left.x;
      this.crosswalkPaint.positions[positionOffset + 1] = left.y;
      this.crosswalkPaint.positions[positionOffset + 2] = left.z;
      this.crosswalkPaint.positions[positionOffset + 3] = right.x;
      this.crosswalkPaint.positions[positionOffset + 4] = right.y;
      this.crosswalkPaint.positions[positionOffset + 5] = right.z;
      const uvOffset = (vertexBase + segment * 2) * 2;
      this.crosswalkPaint.uvs[uvOffset] = 0;
      this.crosswalkPaint.uvs[uvOffset + 1] = t;
      this.crosswalkPaint.uvs[uvOffset + 2] = 1;
      this.crosswalkPaint.uvs[uvOffset + 3] = t;
    }
  }

  private applyCrosswalkCount(count: number): void {
    this.crosswalkPaint.mesh.visible = count > 0;
    this.crosswalkPaint.mesh.geometry.setDrawRange(0, count * CROSSWALK_STRIPE_SEGMENTS * 6);
    this.crosswalkPaint.mesh.geometry.getAttribute("position").needsUpdate = true;
    this.crosswalkPaint.mesh.geometry.getAttribute("uv").needsUpdate = true;
  }

  private applyCounts(items: Array<[InstancedMesh, number]>): void {
    for (const [mesh, count] of items) {
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }

  private capacity(mesh: InstancedMesh): number {
    const max = mesh.instanceMatrix.array.length / 16;
    if (this.qualityMode === "high") return max;
    if (mesh === this.guardrailPosts || mesh === this.reflectorMesh) return Math.floor(max * 0.7);
    if (mesh === this.pedestrianBodies || mesh === this.pedestrianHeads || mesh === this.pedestrianArms || mesh === this.pedestrianLegs) return max;
    return Math.floor(max * 0.52);
  }

  private planeCapacity(pool: Array<Mesh<PlaneGeometry, MeshBasicMaterial>>): number {
    if (this.qualityMode === "high") return pool.length;
    return Math.floor(pool.length * 0.55);
  }
}

function setInstance(mesh: InstancedMesh, index: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, rotY = 0): void {
  tmpObject.position.set(x, y, z);
  tmpObject.rotation.set(0, rotY, 0);
  tmpObject.scale.set(sx, sy, sz);
  tmpObject.updateMatrix();
  mesh.setMatrixAt(index, tmpObject.matrix);
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
