import type { Controls, DriverInputSource, SceneKey, SimSnapshot } from "./game/types";
import type { PerfSnapshot } from "./diagnostics/perf";

declare global {
  interface Window {
    SLimulator: {
      version: string;
      renderer: any;
      snapshot(): SimSnapshot;
      perfSnapshot(): PerfSnapshot;
      requestScene(scene: SceneKey, transitionMs?: number): void;
      newSession(options?: { subId?: string; seed?: number }): void;
      setDriverControls(controls: Partial<Controls>): void;
      setInputSource(source: DriverInputSource): void;
      toggleACC(): void;
      toggleLCA(): void;
      triggerAlert(options?: { type?: "earcon" | "haptic"; expectedAction?: string; id?: string }): string;
      setPhysicsParam(key: string, value: number): void;
    };
  }
}

export {};
