import {
  ACESFilmicToneMapping,
  AmbientLight,
  CameraHelper,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RoadModel } from "../game/route";
import type { CameraMode, SimSnapshot } from "../game/types";
import { VehiclePhysics } from "../physics/vehiclePhysics";
import { AtmosphereSystem } from "./atmosphere";
import { RoadRibbonSystem } from "./roadRibbons";
import { ScenerySystem } from "./scenerySystem";
import { VehicleVisual } from "./vehicleVisual";

export class WorldRenderer {
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;

  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly atmosphere: AtmosphereSystem;
  private readonly roadRibbons: RoadRibbonSystem;
  private readonly scenery: ScenerySystem;
  private readonly vehicleVisual: VehicleVisual;
  private readonly debugHelper: CameraHelper;
  private readonly smoothedCameraPosition = new Vector3();
  private readonly smoothedCameraTarget = new Vector3();
  private readonly cameraForward = new Vector3();
  private readonly cameraRight = new Vector3();
  private readonly cameraTarget = new Vector3();
  private readonly cameraDesired = new Vector3();
  private readonly cameraLookTarget = new Vector3();
  private cameraReady = false;
  private cameraMode: CameraMode = "cockpit";
  private highQuality = true;

  constructor(canvas: HTMLCanvasElement, private readonly road: RoadModel, private readonly physics: VehiclePhysics) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.16;
    this.renderer.shadowMap.enabled = false;

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(68, 1, 0.08, 1800);
    this.camera.rotation.order = "YXZ";

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new Vector2(1, 1), 0.14, 0.28, 0.75);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.atmosphere = new AtmosphereSystem(this.scene, this.road, this.renderer, this.bloom);

    this.addLights();
    this.roadRibbons = new RoadRibbonSystem(this.scene, this.road);
    this.scenery = new ScenerySystem(this.scene, this.road);
    this.vehicleVisual = new VehicleVisual(this.scene, this.physics);
    this.debugHelper = new CameraHelper(this.camera);
    this.debugHelper.visible = false;
    this.scene.add(this.debugHelper);

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      console.warn("SLimulator WebGL context lost");
    });
    canvas.addEventListener("webglcontextrestored", () => this.resize());
    this.resize();
  }

  setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
    this.debugHelper.visible = mode === "debug";
  }

  setHighQuality(high: boolean): void {
    this.highQuality = high;
    this.renderer.setPixelRatio(high ? Math.min(window.devicePixelRatio || 1, 1.7) : 1);
    this.renderer.shadowMap.enabled = false;
    this.bloom.enabled = high;
    this.resize();
  }

  resize(): void {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  render(snapshot: SimSnapshot, now: number): void {
    this.atmosphere.update(snapshot, this.highQuality);
    this.roadRibbons.update(snapshot);
    this.scenery.update(snapshot, now * 0.001);
    this.vehicleVisual.update(snapshot, now * 0.001);
    this.updateCamera(snapshot, now);
    if (this.highQuality) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  private addLights(): void {
    this.scene.add(new AmbientLight(0xa8d7d8, 0.34));
    const hemi = new HemisphereLight(0x9be0dc, 0x1f4b3f, 0.86);
    this.scene.add(hemi);
    const sun = new DirectionalLight(0xffe6aa, 0.54);
    sun.position.set(-90, 115, -55);
    sun.castShadow = false;
    this.scene.add(sun);
    this.scene.add(sun.target);
  }

  private updateCamera(snapshot: SimSnapshot, now: number): void {
    const pose = snapshot.vehicle.pose;
    const forward = this.cameraForward.set(Math.sin(pose.yaw), 0, -Math.cos(pose.yaw));
    const right = this.cameraRight.set(Math.cos(pose.yaw), 0, Math.sin(pose.yaw));
    const bob = snapshot.vehicle.speedMps > 1 ? Math.sin(now * 0.008) * Math.min(0.018, snapshot.vehicle.speedMps * 0.0006) : 0;
    if (this.cameraMode === "chase") {
      const target = this.cameraTarget.set(pose.x, pose.y + 0.6, pose.z);
      const desired = this.cameraDesired.copy(target).addScaledVector(forward, -11.0);
      desired.y += 5.0;
      if (!this.cameraReady) this.camera.position.copy(desired);
      else this.camera.position.lerp(desired, 0.12);
      this.cameraLookTarget.copy(target).addScaledVector(forward, 3.5);
      this.smoothedCameraTarget.lerp(this.cameraLookTarget, this.cameraReady ? 0.18 : 1);
      this.camera.lookAt(this.smoothedCameraTarget);
      this.cameraReady = true;
      return;
    }
    if (this.cameraMode === "debug") {
      this.camera.position.set(pose.x + 24, pose.y + 28, pose.z + 24);
      this.camera.lookAt(pose.x, pose.y, pose.z);
      this.debugHelper.update();
      return;
    }
    const desired = this.cameraDesired.set(pose.x, 1.82 + bob, pose.z).addScaledVector(forward, 0.5).addScaledVector(right, -0.28);
    const lookTarget = this.cameraLookTarget.copy(desired).addScaledVector(forward, 15);
    lookTarget.y += -0.22 - Math.min(0.22, snapshot.vehicle.speedMps * 0.006);
    if (!this.cameraReady) {
      this.smoothedCameraPosition.copy(desired);
      this.smoothedCameraTarget.copy(lookTarget);
    } else {
      this.smoothedCameraPosition.lerp(desired, 0.38);
      this.smoothedCameraTarget.lerp(lookTarget, 0.28);
    }
    this.camera.position.copy(this.smoothedCameraPosition);
    this.camera.lookAt(this.smoothedCameraTarget);
    this.camera.rotation.z = -pose.steerAngle * 0.035;
    this.cameraReady = true;
  }
}
