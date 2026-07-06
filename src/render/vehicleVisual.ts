import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Scene,
  SpotLight,
  Vector3
} from "three";
import type { CameraMode, SimSnapshot } from "../game/types";
import { VehiclePhysics } from "../physics/vehiclePhysics";
import { createHeadlightBeamMesh, LightTrail } from "./vehicleLights";

export class VehicleVisual {
  readonly group = new Group();

  private readonly exterior = new Group();
  private readonly wheels: Group[] = [];
  private readonly headlightLeft: Mesh;
  private readonly headlightRight: Mesh;
  private readonly headlightBeam: Mesh;
  private readonly leftTrail: LightTrail;
  private readonly rightTrail: LightTrail;
  private readonly localTailLeft = new Vector3(1.8, 0.45, -0.55);
  private readonly localTailRight = new Vector3(1.8, 0.45, 0.55);
  private readonly localRightAxis = new Vector3(0, 0, 1);
  private readonly tailLeftWorld = new Vector3();
  private readonly tailRightWorld = new Vector3();
  private readonly carRightWorld = new Vector3();
  private readonly wheelSteerAxis = new Vector3(0, 1, 0);
  private cameraMode: CameraMode = "cockpit";

  constructor(scene: Scene, private readonly physics: VehiclePhysics) {
    this.leftTrail = new LightTrail(scene, 0xff1133);
    this.rightTrail = new LightTrail(scene, 0xff1133);
    this.group.add(this.exterior);
    const headlights = this.createCar();
    this.headlightLeft = headlights.left;
    this.headlightRight = headlights.right;
    this.headlightBeam = headlights.beam;
    scene.add(this.group);
  }

  setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
    const exteriorVisible = mode !== "cockpit";
    this.exterior.visible = exteriorVisible;
    this.headlightLeft.visible = exteriorVisible;
    this.headlightRight.visible = exteriorVisible;
    this.headlightBeam.visible = exteriorVisible;
    this.leftTrail.mesh.visible = exteriorVisible;
    this.rightTrail.mesh.visible = exteriorVisible;
  }

  update(snapshot: SimSnapshot, nowSeconds: number): void {
    const pose = snapshot.vehicle.pose;
    this.group.position.set(pose.x, pose.y - 0.35, pose.z);
    this.group.quaternion.copy(this.physics.chassisQuaternion());
    this.group.updateMatrixWorld(true);

    this.tailLeftWorld.copy(this.localTailLeft).applyMatrix4(this.group.matrixWorld);
    this.tailRightWorld.copy(this.localTailRight).applyMatrix4(this.group.matrixWorld);
    this.carRightWorld.copy(this.localRightAxis).applyQuaternion(this.group.quaternion);

    const exteriorVisible = this.cameraMode !== "cockpit";
    const lastLeft = exteriorVisible ? this.leftTrail.lastPoint() : null;
    if (!exteriorVisible) {
      this.leftTrail.clear();
      this.rightTrail.clear();
    } else if (lastLeft && lastLeft.distanceTo(this.tailLeftWorld) > 10) {
      this.leftTrail.clear();
      this.rightTrail.clear();
    }

    if (exteriorVisible) {
      this.leftTrail.update(this.tailLeftWorld, this.carRightWorld);
      this.rightTrail.update(this.tailRightWorld, this.carRightWorld);
      this.updateWheels();
    }
    this.animateLights(nowSeconds);
  }

  private createCar(): { left: Mesh; right: Mesh; beam: Mesh } {
    const bodyMat = new MeshStandardMaterial({ color: 0xe8484f, roughness: 0.58, metalness: 0.1 });
    const darkBodyMat = new MeshStandardMaterial({ color: 0x671a23, roughness: 0.72, metalness: 0.05 });
    const glassMat = new MeshStandardMaterial({
      color: 0x20384b,
      emissive: new Color(0x0e2632).multiplyScalar(0.8),
      emissiveIntensity: 0.5,
      roughness: 0.26,
      metalness: 0.08
    });
    const tireMat = new MeshStandardMaterial({ color: 0x15181b, roughness: 0.9 });
    const rimMat = new MeshStandardMaterial({ color: 0xd3d8d6, roughness: 0.5, metalness: 0.24 });
    const lightMat = new MeshStandardMaterial({ color: 0xfff4b0, emissive: new Color(0xffe27d).multiplyScalar(2.0), emissiveIntensity: 2.2 });
    const tailLightMat = new MeshStandardMaterial({ color: 0xff1122, emissive: new Color(0xff1122).multiplyScalar(3.0), emissiveIntensity: 3.0 });

    const base = new Mesh(new BoxGeometry(3.85, 0.54, 1.7), bodyMat);
    base.position.y = 0.36;
    base.castShadow = true;
    this.exterior.add(base);

    const lowerSkirt = new Mesh(new BoxGeometry(3.95, 0.18, 1.86), darkBodyMat);
    lowerSkirt.position.y = 0.18;
    this.exterior.add(lowerSkirt);

    const cabin = new Mesh(new BoxGeometry(1.32, 0.7, 1.25), bodyMat);
    cabin.position.set(0.34, 0.9, 0);
    cabin.castShadow = true;
    this.exterior.add(cabin);

    const windshield = new Mesh(new BoxGeometry(0.12, 0.46, 1.12), glassMat);
    windshield.position.set(-0.34, 1.0, 0);
    windshield.rotation.z = -0.2;
    this.exterior.add(windshield);

    const rearGlass = new Mesh(new BoxGeometry(0.12, 0.42, 1.08), glassMat);
    rearGlass.position.set(0.98, 0.98, 0);
    rearGlass.rotation.z = 0.18;
    this.exterior.add(rearGlass);

    const roof = new Mesh(new BoxGeometry(1.0, 0.12, 1.14), darkBodyMat);
    roof.position.set(0.38, 1.3, 0);
    this.exterior.add(roof);

    const frontBumper = new Mesh(new BoxGeometry(0.12, 0.22, 1.78), darkBodyMat);
    frontBumper.position.set(-1.98, 0.34, 0);
    this.exterior.add(frontBumper);

    const spoiler = new Mesh(new BoxGeometry(0.12, 0.1, 1.9), bodyMat);
    spoiler.position.set(1.88, 0.86, 0);
    spoiler.castShadow = true;
    this.exterior.add(spoiler);

    for (let i = 0; i < 4; i++) {
      const wheel = new Group();
      const tire = new Mesh(new CylinderGeometry(0.36, 0.36, 0.28, 14), tireMat);
      tire.rotation.x = Math.PI / 2;
      const rim = new Mesh(new CylinderGeometry(0.21, 0.21, 0.3, 8), rimMat);
      rim.rotation.x = Math.PI / 2;
      wheel.add(tire, rim);
      this.wheels.push(wheel);
      this.exterior.add(wheel);
    }

    const left = new Mesh(new BoxGeometry(0.08, 0.12, 0.26), lightMat);
    left.position.set(-2.02, 0.5, -0.52);
    const right = left.clone();
    right.position.z = 0.52;
    this.group.add(left, right);

    const beam = createHeadlightBeamMesh();
    this.group.add(beam);

    const headlightTarget = new Object3D();
    headlightTarget.position.set(-28, 0.05, 0);
    this.group.add(headlightTarget);
    for (const z of [-0.52, 0.52]) {
      const spot = new SpotLight(0xffefbd, 4.2, 82, 0.72, 0.98, 1.08);
      spot.position.set(-1.94, 0.58, z);
      spot.target = headlightTarget;
      spot.castShadow = false;
      this.group.add(spot);
    }

    const tailLeft = new Mesh(new BoxGeometry(0.08, 0.12, 0.26), tailLightMat);
    tailLeft.position.set(1.94, 0.5, -0.52);
    const tailRight = tailLeft.clone();
    tailRight.position.z = 0.52;
    this.exterior.add(tailLeft, tailRight);

    return { left, right, beam };
  }

  private animateLights(nowSeconds: number): void {
    const pulse = 0.75 + Math.sin(nowSeconds * 4.4) * 0.12;
    this.headlightLeft.scale.set(1, pulse, 1);
    this.headlightRight.scale.set(1, pulse, 1);
    this.headlightBeam.scale.set(1, 1, 0.96 + pulse * 0.06);
  }

  private updateWheels(): void {
    const wheelVisuals = this.physics.wheelVisuals();
    for (let i = 0; i < this.wheels.length; i++) {
      const visual = wheelVisuals[i];
      const wheel = this.wheels[i];
      wheel.position.copy(visual.position);
      wheel.quaternion.setFromAxisAngle(this.wheelSteerAxis, visual.steering);
      wheel.rotateZ(visual.rotation);
    }
  }
}
