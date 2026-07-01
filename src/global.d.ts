import type { Controls, SceneKey, SimSnapshot } from "./game/types";

declare global {
  interface Window {
    SLimulator: {
      version: string;
      renderer: any;
      snapshot(): SimSnapshot;
      requestScene(scene: SceneKey, transitionMs?: number): void;
      newSession(options?: { subId?: string; seed?: number }): void;
      setDriverControls(controls: Partial<Controls>): void;
      setInputSource(source: "local" | "external"): void;
      toggleACC(): void;
      toggleLCA(): void;
      triggerAlert(options?: { type?: "earcon" | "haptic"; expectedAction?: string; id?: string }): string;
    };
  }
}

export {};
