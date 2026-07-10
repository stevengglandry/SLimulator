import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DodecahedronGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  Fog,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  Scene,
  Vector3,
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
  rotationY: number;
  scale: Vector3;
  puffs: Matrix4[];
};

export class AtmosphereSystem {
  private readonly sky = new Mesh(new PlaneGeometry(4000, 1600), new MeshBasicMaterial({ color: 0x82a9b5, depthWrite: false }));
  private readonly mountainFar: Mesh<BufferGeometry, MeshBasicMaterial>;
  private readonly mountainNear: Mesh<BufferGeometry, MeshBasicMaterial>;
  private readonly lowFogBand: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly clouds: InstancedMesh;
  private readonly cloudBases: CloudBase[] = [];
  private readonly fogColor = new Color();
  private readonly ruralFogColor = new Color(0x6f9ca9);
  private readonly forestFogColor = new Color(0x607f87);
  private readonly urbanFogColor = new Color(0x657a84);
  private readonly cloudMatrix = new Matrix4();
  private readonly cloudWorldMatrix = new Matrix4();
  private readonly cloudPosition = new Vector3();
  private readonly cloudRotation = new Quaternion();
  private readonly up = new Vector3(0, 1, 0);
  private bloom: BloomControl | null = null;
  private qualityMode: RenderQuality = "high";

  constructor(
    private readonly scene: Scene,
    private readonly road: RoadModel,
    private readonly renderer: WebGLRenderer
  ) {
    this.scene.background = new Color(0x6f9ca9);
    this.scene.fog = new Fog(0x6f9ca9, 54, 370);

    this.sky.position.set(0, 420, -900);
    this.sky.rotation.x = -Math.PI / 2.7;
    this.scene.add(this.sky);

    this.mountainFar = this.createMountainRidge(0x356f79, 0.36, 31);
    this.mountainNear = this.createMountainRidge(0x285c66, 0.44, 83);
    this.lowFogBand = new Mesh(
      new PlaneGeometry(1800, 115),
      new MeshBasicMaterial({ color: 0xb6c8c5, transparent: true, opacity: 0.14, depthWrite: false, side: DoubleSide })
    );
    this.lowFogBand.renderOrder = -3;
    this.scene.add(this.lowFogBand);

    // Generative clouds
    const cloudGeo = new DodecahedronGeometry(1, 1);
    const cloudMaterial = new MeshStandardMaterial({
      color: 0xf6f4ed,
      roughness: 1,
      metalness: 0,
      flatShading: true,
      fog: false
    });

    for (let i = 0; i < 18; i++) {
      const puffCount = 6 + Math.floor(hash01(i * 47) * 6);
      const puffs: Matrix4[] = [];
      for (let j = 0; j < puffCount; j++) {
        const puffSeed = i * 73 + j * 19;
        const t = (j - (puffCount - 1) / 2) / Math.max(1, (puffCount - 1) / 2);
        const centerFactor = 1.0 - Math.abs(t) * 0.6;

        const pScaleX = (14 + hash01(puffSeed) * 16) * centerFactor;
        const pScaleY = (10 + hash01(puffSeed + 5) * 10) * centerFactor;
        const pScaleZ = (12 + hash01(puffSeed + 11) * 14) * centerFactor;

        const posX = (j - (puffCount - 1) / 2) * (8 + hash01(puffSeed + 17) * 8);
        const posY = pScaleY * 0.4 + (hash01(puffSeed + 23) - 0.5) * 2;
        const posZ = (hash01(puffSeed + 29) - 0.5) * (10 + hash01(puffSeed + 31) * 8);
        puffs.push(composeMatrix(
          posX,
          posY,
          posZ,
          pScaleX,
          pScaleY,
          pScaleZ,
          hash01(puffSeed + 31) * Math.PI,
          hash01(puffSeed + 37) * Math.PI,
          hash01(puffSeed + 41) * Math.PI
        ));

        // Overlapping top puff
        if (hash01(puffSeed + 43) > 0.35) {
          const topScaleX = pScaleX * (0.45 + hash01(puffSeed + 47) * 0.2);
          const topScaleY = pScaleY * (0.45 + hash01(puffSeed + 53) * 0.2);
          const topScaleZ = pScaleZ * (0.45 + hash01(puffSeed + 59) * 0.2);

          puffs.push(composeMatrix(
            posX + (hash01(puffSeed + 61) - 0.5) * pScaleX * 0.3,
            posY + pScaleY * 0.4 + topScaleY * 0.2,
            posZ + (hash01(puffSeed + 67) - 0.5) * pScaleZ * 0.3,
            topScaleX,
            topScaleY,
            topScaleZ,
            hash01(puffSeed + 71) * Math.PI,
            hash01(puffSeed + 73) * Math.PI,
            hash01(puffSeed + 79) * Math.PI
          ));
        }
      }
      const base: CloudBase = {
        x: -430 + hash01(i * 31) * 860,
        y: 82 + hash01(i * 37) * 122,
        z: -150 - hash01(i * 41) * 640,
        speed: 2.4 + hash01(i * 43) * 5.8,
        phase: hash01(i * 89) * Math.PI * 2,
        rotationY: (hash01(i * 67) - 0.5) * 0.35,
        scale: new Vector3(
          lerp(0.72, 1.34, hash01(i * 53)),
          lerp(0.82, 1.18, hash01(i * 59)),
          lerp(0.72, 1.38, hash01(i * 61))
        ),
        puffs
      };
      this.cloudBases.push(base);
    }
    const totalPuffs = this.cloudBases.reduce((total, cloud) => total + cloud.puffs.length, 0);
    this.clouds = new InstancedMesh(cloudGeo, cloudMaterial, totalPuffs);
    this.clouds.instanceMatrix.setUsage(DynamicDrawUsage);
    this.clouds.frustumCulled = false;
    this.scene.add(this.clouds);
  }

  setQualityMode(mode: RenderQuality): void {
    this.qualityMode = mode;
  }

  setBloomControl(bloom: BloomControl): void {
    this.bloom = bloom;
  }

  update(snapshot: SimSnapshot, nowSeconds = 0): void {
    const highQuality = this.qualityMode === "high";
    const pose = snapshot.vehicle.pose;
    const forest = this.road.roadValueAt("forest", pose.s);
    const buildings = this.road.roadValueAt("buildingScale", pose.s);
    const urban = Math.min(1, buildings);
    const fogColor = this.fogColor
      .copy(this.ruralFogColor)
      .lerp(this.forestFogColor, forest * 0.34)
      .lerp(this.urbanFogColor, urban * 0.26);

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
    if (this.bloom) this.bloom.strength = highQuality ? lerp(0.06, 0.11, urban) : 0;

    // Move the instanced cloud field with the camera. One instanced draw replaces
    // hundreds of individual puff meshes while preserving the same silhouettes.
    this.sky.position.set(pose.x, 420, pose.z - 900);
    let cloudInstance = 0;
    for (let index = 0; index < this.cloudBases.length; index++) {
      if (!highQuality && index % 3 !== 0) continue;
      const base = this.cloudBases[index];
      const travel = pose.s * 0.08 + nowSeconds * base.speed;
      const z = wrapRange(base.z + travel, -820, 180);
      const x = base.x + Math.sin(nowSeconds * 0.015 + base.phase) * 18;
      this.cloudPosition.set(pose.x + x, base.y, pose.z + z);
      this.cloudRotation.setFromAxisAngle(this.up, base.rotationY);
      this.cloudWorldMatrix.compose(this.cloudPosition, this.cloudRotation, base.scale);
      for (const puff of base.puffs) {
        this.cloudMatrix.multiplyMatrices(this.cloudWorldMatrix, puff);
        this.clouds.setMatrixAt(cloudInstance++, this.cloudMatrix);
      }
    }
    this.clouds.count = cloudInstance;
    this.clouds.instanceMatrix.needsUpdate = true;

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

function composeMatrix(
  x: number,
  y: number,
  z: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  rotationX: number,
  rotationY: number,
  rotationZ: number
): Matrix4 {
  return new Matrix4().compose(
    new Vector3(x, y, z),
    new Quaternion().setFromEuler(new Euler(rotationX, rotationY, rotationZ)),
    new Vector3(scaleX, scaleY, scaleZ)
  );
}
