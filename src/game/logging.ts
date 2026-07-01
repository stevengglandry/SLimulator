import { MPH_PER_MPS } from "./config";
import type { SimSnapshot } from "./types";
import { formatTime, fixed } from "../shared/math";

export function createLogText(snapshot: SimSnapshot): string {
  const lines = [
    "SLimulator Driving Performance Log",
    `Version: ${snapshot.version}`,
    `SubID: ${snapshot.session.subId || "none"}`,
    `Duration: ${formatTime(snapshot.session.elapsed)}`,
    `Scene: ${snapshot.road.scene}`,
    `Distance: ${fixed(snapshot.vehicle.distanceM, 1)} m`,
    `Final speed: ${fixed(snapshot.vehicle.speedMps * MPH_PER_MPS, 1)} mph`,
    "",
    "Score",
    `Steering points: ${fixed(snapshot.metrics.steeringPoints, 1)}`,
    `Off-road seconds: ${fixed(snapshot.metrics.offRoadSeconds, 2)}`,
    `Off-road penalty: ${fixed(snapshot.metrics.offRoadPenalty, 1)}`,
    `Crash count: ${snapshot.metrics.crashCount}`,
    `Crash penalty: ${fixed(snapshot.metrics.crashPenaltyTotal, 1)}`,
    `Total score: ${fixed(snapshot.metrics.totalScore, 1)}`,
    `SDLP: ${fixed(snapshot.metrics.sdlp, 3)} m`,
    `Lane changes: ${snapshot.metrics.laneChanges}`,
    "",
    "Time by mode",
    ...Object.entries(snapshot.metrics.timeByMode).map(([mode, value]) => `${mode}: ${fixed(value, 2)} s`),
    "",
    "Alerts",
    ...Object.entries(snapshot.metrics.alertCounts).map(([type, value]) => `${type}: ${value}`),
    "",
    "Crashes",
    snapshot.crashes.length ? "" : "none"
  ];

  for (const crash of snapshot.crashes) {
    lines.push(
      `#${crash.index} ${formatTime(crash.time)} ${crash.type} ${crash.side} ${fixed(crash.mph, 1)} mph ${crash.zone}`
    );
  }

  lines.push("", "Trials", snapshot.trials.length ? "" : "none");
  for (const trial of snapshot.trials) {
    lines.push(
      `#${trial.index} ${trial.type} expected=${trial.expectedAction} status=${trial.status} pdt=${trial.pdt ?? ""} drt=${trial.drt ?? ""}`
    );
  }

  return `${lines.join("\n")}\n`;
}
