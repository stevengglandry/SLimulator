import "./styles.css";
import { AudioSystem } from "./audio/audioSystem";
import type { PerfSnapshot } from "./diagnostics/perf";
import { PerfTracker } from "./diagnostics/perf";
import { VERSION } from "./game/config";
import { Simulator } from "./game/simulator";
import type { CameraMode, Controls, DriverInputSource, ExpectedAction, RenderQuality, SceneKey } from "./game/types";
import { InputManager } from "./input/inputManager";
import { WorldRenderer } from "./render/WorldRenderer";
import { createUi } from "./ui/uiController";
import { bus } from "./engine/events";

async function boot(): Promise<void> {
  const root = document.getElementById("app");
  if (!root) throw new Error("Missing #app root");

  const simulator = await Simulator.create();
  const audio = new AudioSystem();
  const input = new InputManager(window);
  const perf = new PerfTracker();
  let cameraMode: CameraMode = "cockpit";
  let qualityMode: RenderQuality = "high";
  let previousAccButton = false;
  let previousLcaButton = false;
  let lastGamepadLabel = "No gamepad";
  let lastGamepadSampleMs = -Infinity;
  let lastAudioUpdateMs = -Infinity;
  let renderer: WorldRenderer;

  const ui = createUi(root, {
    onScene(scene) {
      simulator.requestScene(scene);
      audio.resume();
    },
    onNewSession() {
      simulator.newSession();
      audio.resume();
      ui.toast("Session reset");
    },
    onToggleACC() {
      simulator.toggleACC();
      audio.resume();
    },
    onToggleLCA() {
      simulator.toggleLCA();
      audio.resume();
    },
    onInputSource(source) {
      simulator.setInputSource(source);
      ui.toast(source === "local" ? "Local controls" : source === "gamepad" ? "Gamepad controls" : "External controls");
    },
    onAlert(type) {
      simulator.triggerAlert({ type });
      audio.alert(type);
    },
    onCamera(mode) {
      cameraMode = mode;
      renderer.setCameraMode(cameraMode);
    },
    onQuality(high) {
      qualityMode = high ? "high" : "perf";
      renderer.setQualityMode(qualityMode);
    },
    onPhysicsChange(key, value) {
      simulator.physics.setParam(key, value);
    },
    onGamepadMappingChange(mapping) {
      input.setGamepadMapping(mapping);
    },
    onGamepadMappingReset() {
      return input.resetGamepadMapping();
    },
    getGamepadMapping() {
      return input.getGamepadMapping();
    }
  });

  renderer = new WorldRenderer(ui.canvas, simulator.road, simulator.physics);
  renderer.setCameraMode(cameraMode);
  renderer.setQualityMode(qualityMode);

  window.addEventListener("resize", () => renderer.resize());
  window.addEventListener("pointerdown", () => audio.resume(), { once: true });
  bus.addEventListener("event", (event) => {
    const detail = (event as CustomEvent<{ type: string }>).detail;
    if (detail.type === "crash") {
      audio.burst("impact");
      ui.toast("Crash recorded", "danger", 2400);
    }
  });

  window.SLimulator = {
    version: VERSION,
    renderer,
    snapshot: () => simulator.snapshot(),
    perfSnapshot: (): PerfSnapshot => perf.snapshot(renderer.perfStats()),
    requestScene: (scene: SceneKey, transitionMs?: number) => simulator.requestScene(scene, transitionMs),
    newSession: (options = {}) => simulator.newSession(options),
    setDriverControls: (controls: Partial<Controls>) => simulator.setExternalControls(controls),
    setInputSource: (source: DriverInputSource) => simulator.setInputSource(source),
    toggleACC: () => simulator.toggleACC(),
    toggleLCA: () => simulator.toggleLCA(),
    triggerAlert: (options = {}) => simulator.triggerAlert({ ...options, expectedAction: options.expectedAction as ExpectedAction | undefined }),
    setPhysicsParam: (key: string, value: number) => simulator.physics.setParam(key, value)
  };

  let lastSnapshot = simulator.snapshot();
  function frame(now: number): void {
    const dt = perf.mark(now);
    const controls = perf.measure("input", () => input.sample(simulator.inputSource === "gamepad" ? "gamepad" : "local"));
    if (now - lastGamepadSampleMs >= 250) {
      lastGamepadLabel = perf.measure("input", () => input.liveGamepadLabel());
      lastGamepadSampleMs = now;
    }
    if (controls.accButton && !previousAccButton) simulator.toggleACC();
    if (controls.lcaButton && !previousLcaButton) simulator.toggleLCA();
    previousAccButton = Boolean(controls.accButton);
    previousLcaButton = Boolean(controls.lcaButton);
    lastSnapshot = perf.measure("sim", () => simulator.update(dt, controls, perf));
    perf.measure("render", () => renderer.render(lastSnapshot, now, perf));
    perf.measure("ui", () => ui.update(lastSnapshot, perf.fps, lastGamepadLabel));
    if (now - lastAudioUpdateMs >= 1000 / 30) {
      perf.measure("audio", () => audio.update(lastSnapshot));
      lastAudioUpdateMs = now;
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

void boot().catch((error) => {
  console.error(error);
  const root = document.getElementById("app");
  if (root) {
    root.innerHTML = `<pre style="padding:20px;color:#ffdce1;background:#18070b;white-space:pre-wrap">${String(error?.stack || error)}</pre>`;
  }
});
