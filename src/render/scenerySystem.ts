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
  RepeatWrapping,
  Scene,
  SphereGeometry
} from "three";
import { RoadModel } from "../game/route";
import type { RenderQuality, SimSnapshot } from "../game/types";
import { hash01, lerp, TAU } from "../shared/math";
import { createClumpyFoliageGeometry } from "./geometry";
import { createStreetlightConeMaterial } from "./vehicleLights";

const tmpObject = new Object3D();
const tmpColor = new Color();
const CROSSWALK_MAX_STRIPES = 240;
const CROSSWALK_STRIPE_SEGMENTS = 4;
const CROSSWALK_VERTS_PER_STRIPE = (CROSSWALK_STRIPE_SEGMENTS + 1) * 2;

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

type CrosswalkPaint = {
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>;
  positions: Float32Array;
  uvs: Float32Array;
  maxStripes: number;
};

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
  private qualityMode: RenderQuality = "high";
  private lastUpdateKey = "";

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
    const transitionBucket = transition ? Math.floor(transition.progress * 16) : 0;
    const startAnchor = Math.floor((snapshot.vehicle.roadPositionM - settings.backDistance) / 18);
    const endAnchor = Math.ceil((snapshot.vehicle.roadPositionM + settings.forwardDistance) / 18);
    const timeBucket = Math.floor(nowSeconds * settings.timeHz);
    const updateKey = `${this.qualityMode}:${startAnchor}:${endAnchor}:${timeBucket}:${snapshot.road.scene}:${transition?.from ?? ""}:${transition?.to ?? ""}:${transitionBucket}`;
    if (updateKey === this.lastUpdateKey) return;
    this.lastUpdateKey = updateKey;

    const city = this.road.sceneValue("city");
    let buildingDensity = this.road.sceneValue("buildings");
    let treeDensity = this.road.sceneValue("trees");
    const forest = this.road.sceneValue("forest");
    const crosswalkPresence = this.road.sceneValue("crosswalks");
    const trafficLightPresence = this.road.sceneValue("trafficLights");
    const buildingScale = this.road.sceneValue("buildingScale");
    const safetyMargin = this.road.sceneValue("buildingSetback");
    const skylineDensity = this.road.sceneValue("skylineDensity");
    buildingDensity *= settings.density;
    treeDensity *= this.qualityMode === "high" ? 1 : 0.48;

    const activeBuildingScale = buildingScale;
    const activeUrbanScale = skylineDensity * 1.45;
    const activeUrban = skylineDensity > 0.01;
    const seedOffset = this.road.seed % 10000;
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

        if (activeBuildingScale > 0 && (h < buildingDensity || forcedUrbanBuilding)) {
          if (building >= this.capacity(this.buildingMesh) || cap >= this.capacity(this.buildingCaps)) continue;
          const shapeSeed = anchor * 12.31 + sideIndex * 91.7 + seedOffset;
          const baseHeight = forcedUrbanBuilding ? lerp(18, activeBuildingScale > 1.1 ? 66 : 38, hash01(shapeSeed + 5)) : lerp(10, activeBuildingScale > 1.1 ? 58 : 44, Math.pow(hash01(shapeSeed), 0.75));
          const height = baseHeight * activeBuildingScale;
          const width = lerp(6.5, activeBuildingScale > 1.1 ? 26 : 20, hash01(shapeSeed + 3));
          const depth = lerp(7, activeBuildingScale > 1.1 ? 30 : 22, hash01(shapeSeed + 7));

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

    if (activeUrban) {
      const urbanSpacing = activeUrbanScale > 1.1 ? 42 : 56;
      const startUrbanAnchor = Math.floor((baseS - settings.backDistance) / urbanSpacing);
      const endUrbanAnchor = Math.ceil((baseS + settings.forwardDistance) / urbanSpacing);

      for (let anchor = startUrbanAnchor; anchor <= endUrbanAnchor; anchor++) {
        const s = anchor * urbanSpacing;
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
      [this.urbanRoofCaps, urbanCap]
    ]);
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
}

function setInstance(mesh: InstancedMesh, index: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, rotY = 0): void {
  tmpObject.position.set(x, y, z);
  tmpObject.rotation.set(0, rotY, 0);
  tmpObject.scale.set(sx, sy, sz);
  tmpObject.updateMatrix();
  mesh.setMatrixAt(index, tmpObject.matrix);
}
