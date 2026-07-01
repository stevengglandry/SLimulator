import { config } from "./config";
import type { AdasState, AppliedControls, Controls, DriveMode, LaneInfo, VehiclePose } from "./types";
import { clamp, lerp } from "../shared/math";

export function driveMode(adas: AdasState): DriveMode {
  if (adas.lcaActive) return adas.setSpeedMps > 0 ? "l3" : "l2";
  if (adas.accActive) return "acc";
  return "manual";
}

export function shapeDriverSteer(input: number): number {
  const steer = clamp(input, -1, 1);
  return Math.sign(steer) * Math.pow(Math.abs(steer), config.driverSteerExponent);
}

export function computeAccPedals(speedMps: number, setSpeedMps: number, brakeOverride: number): Pick<AppliedControls, "accelerator" | "brake"> {
  if (brakeOverride > 0.05) return { accelerator: 0, brake: brakeOverride };
  const error = setSpeedMps - speedMps;
  const accel = clamp(error * 0.22 + 0.08, 0, 0.72);
  const brake = clamp(-error * 0.2 - 0.03, 0, 0.62);
  return { accelerator: accel, brake };
}

export function computeLaneCenterSteer(pose: VehiclePose, lane: LaneInfo, authority: "l2" | "l3"): number {
  const speed = Math.max(pose.speedMps, 4);
  const lateralGain = authority === "l3" ? 0.78 : 0.48;
  const headingGain = authority === "l3" ? 1.06 : 0.74;
  const preview = lane.error + Math.sin(pose.headingError) * Math.min(speed * 0.42, 12);
  const target = -preview * lateralGain / Math.max(speed, 8) - pose.headingError * headingGain;
  const limit = authority === "l3" ? config.maxSteerRad * 0.98 : config.maxSteerRad * 0.54;
  return clamp(target, -limit, limit);
}

export function manualSteerLimit(speedMps: number): number {
  const speedRatio = clamp(speedMps / config.maxSpeedMps, 0, 1);
  return lerp(config.lowSpeedSteerRad, config.highSpeedSteerRad, speedRatio);
}

export function mergeControls(driver: Controls, adas: AdasState, pose: VehiclePose, lane: LaneInfo, scene: string): AppliedControls {
  const maxSteer = manualSteerLimit(pose.speedMps);
  const driverSteer = shapeDriverSteer(driver.steer) * maxSteer * config.driverSteerGain;
  let steerAngle = driverSteer;
  let accelerator = clamp(driver.accelerator, 0, 1);
  let brake = clamp(driver.brake, 0, 1);

  if (adas.accActive) {
    const pedals = computeAccPedals(pose.speedMps, adas.setSpeedMps, brake);
    accelerator = pedals.accelerator;
    brake = pedals.brake;
  }

  if (adas.lcaActive) {
    const authority = scene === "l3" ? "l3" : "l2";
    const assist = computeLaneCenterSteer(pose, lane, authority);
    adas.assistSteerAngle += (assist - adas.assistSteerAngle) * (authority === "l3" ? 0.38 : 0.24);
    steerAngle = clamp(driverSteer + adas.assistSteerAngle, -maxSteer, maxSteer);
  } else {
    adas.assistSteerAngle *= 0.82;
  }

  return {
    steer: clamp(steerAngle / config.maxSteerRad, -1, 1),
    accelerator,
    brake
  };
}
