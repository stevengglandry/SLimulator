export type PerfStage =
  | "input"
  | "sim"
  | "physics"
  | "render"
  | "atmosphere"
  | "road"
  | "scenery"
  | "vehicle"
  | "camera"
  | "ui"
  | "audio";

export type RendererPerfStats = {
  quality: "high" | "perf";
  pixelRatio: number;
  canvas: {
    width: number;
    height: number;
    clientWidth: number;
    clientHeight: number;
  };
  render: {
    calls: number;
    triangles: number;
    points: number;
    lines: number;
  };
  memory: {
    geometries: number;
    textures: number;
  };
};

export type PerfSnapshot = {
  fps: number;
  frameMs: {
    last: number;
    avg: number;
    max: number;
    p99: number;
    onePercentLowFps: number;
  };
  stages: Partial<Record<PerfStage, { lastMs: number; avgMs: number; maxMs: number }>>;
  renderer?: RendererPerfStats;
};

export interface PerfRecorder {
  measure<T>(stage: PerfStage, fn: () => T): T;
}

type StageAccumulator = {
  lastMs: number;
  avgMs: number;
  maxMs: number;
};

const FRAME_HISTORY = 360;
const STAGE_SMOOTHING = 0.12;

export class PerfTracker {
  private last = performance.now();
  private frames = 0;
  private acc = 0;
  private lastFrameMs = 0;
  private readonly frameHistory: number[] = [];
  private readonly stages = new Map<PerfStage, StageAccumulator>();
  fps = 0;

  mark(now = performance.now()): number {
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.lastFrameMs = dt * 1000;
    this.frameHistory.push(this.lastFrameMs);
    if (this.frameHistory.length > FRAME_HISTORY) this.frameHistory.shift();
    this.frames++;
    this.acc += dt;
    if (this.acc >= 0.5) {
      this.fps = this.frames / this.acc;
      this.frames = 0;
      this.acc = 0;
    }
    return dt;
  }

  measure<T>(stage: PerfStage, fn: () => T): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      this.record(stage, performance.now() - start);
    }
  }

  record(stage: PerfStage, durationMs: number): void {
    const existing = this.stages.get(stage);
    if (!existing) {
      this.stages.set(stage, { lastMs: durationMs, avgMs: durationMs, maxMs: durationMs });
      return;
    }
    existing.lastMs = durationMs;
    existing.avgMs += (durationMs - existing.avgMs) * STAGE_SMOOTHING;
    existing.maxMs = Math.max(existing.maxMs * 0.985, durationMs);
  }

  snapshot(renderer?: RendererPerfStats): PerfSnapshot {
    const frames = this.frameHistory;
    const avg = frames.length ? frames.reduce((sum, frame) => sum + frame, 0) / frames.length : this.lastFrameMs;
    const max = frames.length ? Math.max(...frames) : this.lastFrameMs;
    const sorted = [...frames].sort((a, b) => a - b);
    const p99 = sorted.length ? sorted[Math.max(0, Math.floor(sorted.length * 0.99) - 1)] : this.lastFrameMs;
    const stages: PerfSnapshot["stages"] = {};
    for (const [key, value] of this.stages) {
      stages[key] = {
        lastMs: round(value.lastMs),
        avgMs: round(value.avgMs),
        maxMs: round(value.maxMs)
      };
    }
    return {
      fps: round(this.fps),
      frameMs: {
        last: round(this.lastFrameMs),
        avg: round(avg),
        max: round(max),
        p99: round(p99),
        onePercentLowFps: p99 > 0 ? round(1000 / p99) : 0
      },
      stages,
      renderer
    };
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
