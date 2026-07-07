import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DodecahedronGeometry,
  DoubleSide,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from "three";
import { RoadModel } from "../game/route";
import type { RenderQuality, SimSnapshot } from "../game/types";
import { hash01, lerp } from "../shared/math";

type BloomControl = {
  strength: number;
};

type CloudBase = {
  x: number;
  y: number;
  z: number;
  speed: number;
  phase: number;
};

export class AtmosphereSystem {
  private readonly sky = new Mesh(new PlaneGeometry(4000, 1600), new MeshBasicMaterial({ color: 0x8fb9c7, depthWrite: false }));
  private readonly mountainFar: Mesh<BufferGeometry, MeshBasicMaterial>;
  private readonly mountainNear: Mesh<BufferGeometry, MeshBasicMaterial>;
  private readonly lowFogBand: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly cloudGroup = new Group();
  private readonly cloudBases: CloudBase[] = [];
  private qualityMode: RenderQuality = "high";

  constructor(
    private readonly scene: Scene,
    private readonly road: RoadModel,
    private readonly renderer: WebGLRenderer,
    private readonly bloom: BloomControl
  ) {
    this.scene.background = new Color(0x4b929a);
    this.scene.fog = new Fog(0x4b929a, 54, 370);

    this.sky.position.set(0, 420, -900);
    this.sky.rotation.x = -Math.PI / 2.7;
    this.scene.add(this.sky);

    this.mountainFar = this.createMountainRidge(0x356f79, 0.36, 31);
    this.mountainNear = this.createMountainRidge(0x285c66, 0.44, 83);
    this.lowFogBand = new Mesh(
      new PlaneGeometry(1800, 115),
      new MeshBasicMaterial({ color: 0x8cc0bd, transparent: true, opacity: 0.14, depthWrite: false, side: DoubleSide })
    );
    this.lowFogBand.renderOrder = -3;
    this.scene.add(this.lowFogBand);

    // Generative clouds
    const cloudGeo = new DodecahedronGeometry(1, 1);
    const cloudMaterial = new MeshStandardMaterial({
      color: 0xf5f8fa,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
      fog: false
    });

    for (let i = 0; i < 18; i++) {
      const cloud = new Group();
      const puffCount = 6 + Math.floor(hash01(i * 47) * 6);
      for (let j = 0; j < puffCount; j++) {
        const puffSeed = i * 73 + j * 19;
        const t = (j - (puffCount - 1) / 2) / Math.max(1, (puffCount - 1) / 2);
        const centerFactor = 1.0 - Math.abs(t) * 0.6;

        const pScaleX = (14 + hash01(puffSeed) * 16) * centerFactor;
        const pScaleY = (10 + hash01(puffSeed + 5) * 10) * centerFactor;
        const pScaleZ = (12 + hash01(puffSeed + 11) * 14) * centerFactor;

        const puff = new Mesh(cloudGeo, cloudMaterial);
        puff.scale.set(pScaleX, pScaleY, pScaleZ);

        const posX = (j - (puffCount - 1) / 2) * (8 + hash01(puffSeed + 17) * 8);
        const posY = pScaleY * 0.4 + (hash01(puffSeed + 23) - 0.5) * 2;
        const posZ = (hash01(puffSeed + 29) - 0.5) * (10 + hash01(puffSeed + 31) * 8);

        puff.position.set(posX, posY, posZ);
        puff.rotation.set(
          hash01(puffSeed + 31) * Math.PI,
          hash01(puffSeed + 37) * Math.PI,
          hash01(puffSeed + 41) * Math.PI
        );
        cloud.add(puff);

        // Overlapping top puff
        if (hash01(puffSeed + 43) > 0.35) {
          const topPuff = new Mesh(cloudGeo, cloudMaterial);
          const topScaleX = pScaleX * (0.45 + hash01(puffSeed + 47) * 0.2);
          const topScaleY = pScaleY * (0.45 + hash01(puffSeed + 53) * 0.2);
          const topScaleZ = pScaleZ * (0.45 + hash01(puffSeed + 59) * 0.2);

          topPuff.scale.set(topScaleX, topScaleY, topScaleZ);
          topPuff.position.set(
            posX + (hash01(puffSeed + 61) - 0.5) * pScaleX * 0.3,
            posY + pScaleY * 0.4 + topScaleY * 0.2,
            posZ + (hash01(puffSeed + 67) - 0.5) * pScaleZ * 0.3
          );
          topPuff.rotation.set(
            hash01(puffSeed + 71) * Math.PI,
            hash01(puffSeed + 73) * Math.PI,
            hash01(puffSeed + 79) * Math.PI
          );
          cloud.add(topPuff);
        }
      }
      cloud.scale.set(
        lerp(0.72, 1.34, hash01(i * 53)),
        lerp(0.82, 1.18, hash01(i * 59)),
        lerp(0.72, 1.38, hash01(i * 61))
      );
      cloud.rotation.y = (hash01(i * 67) - 0.5) * 0.35;
      const base: CloudBase = {
        x: -430 + hash01(i * 31) * 860,
        y: 82 + hash01(i * 37) * 122,
        z: -150 - hash01(i * 41) * 640,
        speed: 2.4 + hash01(i * 43) * 5.8,
        phase: hash01(i * 89) * Math.PI * 2
      };
      cloud.position.set(base.x, base.y, base.z);
      this.cloudBases.push(base);
      this.cloudGroup.add(cloud);
    }
    this.scene.add(this.cloudGroup);
  }

  setQualityMode(mode: RenderQuality): void {
    this.qualityMode = mode;
    this.cloudGroup.visible = true;
    this.cloudGroup.children.forEach((child, index) => {
      child.visible = mode === "high" || index % 3 === 0;
    });
  }

  update(snapshot: SimSnapshot, nowSeconds = 0): void {
    const highQuality = this.qualityMode === "high";
    const pose = snapshot.vehicle.pose;
    const forest = this.road.roadValueAt("forest", pose.s);
    const buildings = this.road.roadValueAt("buildingScale", pose.s);
    const urban = Math.min(1, buildings);
    const fogColor = new Color(0x438a91)
      .lerp(new Color(0x316f7a), forest * 0.34)
      .lerp(new Color(0x255968), urban * 0.26);

    if (this.scene.background instanceof Color) this.scene.background.copy(fogColor);
    const fog = this.scene.fog;
    if (fog instanceof Fog) {
      fog.color.copy(fogColor);
      fog.near = lerp(62, 42, forest);
      fog.far = lerp(390, 260, forest);
      if (urban > 0.75) {
        fog.near = 72;
        fog.far = 470;
      }
    }

    this.sky.material.color.copy(fogColor);
    this.renderer.toneMappingExposure = lerp(1.2, 1.06, forest) + urban * 0.05;
    this.bloom.strength = highQuality ? lerp(0.06, 0.11, urban) : 0;

    // Update sky and cloud position to move with the camera
    this.sky.position.set(pose.x, 420, pose.z - 900);
    this.cloudGroup.position.set(pose.x, 0, pose.z);
    this.cloudGroup.children.forEach((child, index) => {
      const base = this.cloudBases[index];
      if (!base) return;
      child.visible = highQuality || index % 3 === 0;
      const travel = pose.s * 0.08 + nowSeconds * base.speed;
      const z = wrapRange(base.z + travel, -820, 180);
      const x = base.x + Math.sin(nowSeconds * 0.015 + base.phase) * 18;
      child.position.set(x, base.y, z);
    });

    const far = this.road.worldFromRoad(pose.s + 720, 0, 0);
    const near = this.road.worldFromRoad(pose.s + 430, 0, 0);
    this.mountainFar.position.set(far.x, -2, far.z);
    this.mountainNear.position.set(near.x, -6, near.z);
    this.mountainFar.material.opacity = lerp(0.22, 0.42, forest);
    this.mountainNear.material.opacity = lerp(0.14, 0.52, forest);
    this.mountainFar.visible = forest > 0.08;
    this.mountainNear.visible = forest > 0.08;

    const fogPoint = this.road.worldFromRoad(pose.s + 260, 0, 28);
    this.lowFogBand.position.set(fogPoint.x, fogPoint.y, fogPoint.z);
    this.lowFogBand.material.opacity = lerp(0.04, 0.2, forest);
    this.lowFogBand.visible = forest > 0.08;
  }

  private createMountainRidge(color: number, opacity: number, seed: number): Mesh<BufferGeometry, MeshBasicMaterial> {
    const points = 19;
    const positions: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i < points; i++) {
      const x = lerp(-900, 900, i / (points - 1));
      const ridgeA = Math.sin((i + seed) * 0.72) * 34;
      const ridgeB = Math.sin((i + seed) * 1.31) * 18;
      const y = 58 + ridgeA + ridgeB + hash01(i * 19.7 + seed) * 52;
      positions.push(x, -24, 0, x, y, 0);
    }
    for (let i = 0; i < points - 1; i++) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const mesh = new Mesh(
      geometry,
      new MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: DoubleSide })
    );
    mesh.frustumCulled = false;
    mesh.renderOrder = -4;
    this.scene.add(mesh);
    return mesh;
  }
}

function wrapRange(value: number, min: number, max: number): number {
  const span = max - min;
  return min + ((((value - min) % span) + span) % span);
}
