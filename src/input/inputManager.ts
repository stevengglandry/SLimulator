import type { Controls } from "../game/types";
import { clamp } from "../shared/math";

export type InputSampleMode = "local" | "gamepad";

export type GamepadAxisBinding = {
  kind: "axis";
  index: number;
  invert?: boolean;
};

export type GamepadButtonBinding = {
  kind: "button";
  index: number;
};

export type GamepadControlBinding = GamepadAxisBinding | GamepadButtonBinding;

export type GamepadMapping = {
  steer: GamepadAxisBinding;
  accelerator: GamepadControlBinding;
  brake: GamepadControlBinding;
  acc: GamepadButtonBinding;
  lca: GamepadButtonBinding;
  deadzone: number;
  steerGain: number;
};

type ButtonLatch = {
  acc: boolean;
  lca: boolean;
};

type InputManagerOptions = {
  now?: () => number;
};

const KEYBOARD_STEER_TURN_RATE = 1.35;
const KEYBOARD_STEER_CENTER_RATE = 1.3;
const MAX_KEYBOARD_STEER_DT = 0.08;
const GAMEPAD_MAPPING_STORAGE_KEY = "slimulator-gamepad-mapping";
const DEFAULT_GAMEPAD_MAPPING: GamepadMapping = {
  steer: { kind: "axis", index: 0 },
  accelerator: { kind: "axis", index: 5 },
  brake: { kind: "axis", index: 2 },
  acc: { kind: "button", index: 0 },
  lca: { kind: "button", index: 1 },
  deadzone: 0.08,
  steerGain: 0.75
};

export class InputManager {
  private readonly keys = new Set<string>();
  private readonly latches: ButtonLatch = { acc: false, lca: false };
  private readonly now: () => number;
  private gamepadMapping: GamepadMapping = cloneGamepadMapping(DEFAULT_GAMEPAD_MAPPING);

  public readonly touchControls = { steer: 0, accelerator: 0, brake: 0 };
  private touchOverlay: HTMLDivElement | null = null;
  private keyboardSteer = 0;
  private lastKeyboardSteerSampleMs: number | null = null;

  constructor(private readonly target: EventTarget = window, options: InputManagerOptions = {}) {
    this.now = options.now ?? (() => performance.now());
    this.gamepadMapping = this.loadGamepadMapping();
    target.addEventListener("keydown", this.onKeyDown as EventListener);
    target.addEventListener("keyup", this.onKeyUp as EventListener);
    if (this.isTouchDevice()) {
      this.createTouchOverlay();
    }
  }

  dispose(): void {
    this.target.removeEventListener("keydown", this.onKeyDown as EventListener);
    this.target.removeEventListener("keyup", this.onKeyUp as EventListener);
    if (this.touchOverlay) {
      this.touchOverlay.remove();
      this.touchOverlay = null;
    }
  }

  sample(mode: InputSampleMode = "local"): Controls {
    if (mode === "gamepad") return this.gamepadControls();

    const keyboard = this.keyboardControls();
    const gamepad = this.gamepadControls();
    const touch = this.touchControls;

    // Pick steer with largest magnitude
    let steer = keyboard.steer;
    if (Math.abs(gamepad.steer) > Math.abs(steer)) steer = gamepad.steer;
    if (Math.abs(touch.steer) > Math.abs(steer)) steer = touch.steer;

    const accelerator = Math.max(keyboard.accelerator, gamepad.accelerator, touch.accelerator);
    const brake = Math.max(keyboard.brake, gamepad.brake, touch.brake);
    const accButton = this.consumeLatch("acc") || gamepad.accButton;
    const lcaButton = this.consumeLatch("lca") || gamepad.lcaButton;
    return { steer, accelerator, brake, accButton, lcaButton };
  }

  getGamepadMapping(): GamepadMapping {
    return cloneGamepadMapping(this.gamepadMapping);
  }

  setGamepadMapping(mapping: Partial<GamepadMapping>): void {
    this.gamepadMapping = normalizeGamepadMapping({ ...cloneGamepadMapping(this.gamepadMapping), ...mapping });
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(GAMEPAD_MAPPING_STORAGE_KEY, JSON.stringify(this.gamepadMapping));
    }
  }

  resetGamepadMapping(): GamepadMapping {
    this.gamepadMapping = cloneGamepadMapping(DEFAULT_GAMEPAD_MAPPING);
    if (typeof localStorage !== "undefined") localStorage.removeItem(GAMEPAD_MAPPING_STORAGE_KEY);
    return this.getGamepadMapping();
  }

  private isTouchDevice(): boolean {
    return (typeof window !== "undefined" && "ontouchstart" in window) ||
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
  }

  private createTouchOverlay(): void {
    const overlay = document.createElement("div");
    overlay.className = "mobile-touch-overlay";
    overlay.innerHTML = `
      <div class="touch-group steer-group">
        <button id="touchLeft" class="touch-btn steer-btn" type="button" aria-label="Steer Left">◀</button>
        <button id="touchRight" class="touch-btn steer-btn" type="button" aria-label="Steer Right">▶</button>
      </div>
      <div class="touch-group aux-group">
        <button id="touchAcc" class="touch-btn aux-btn" type="button">ACC</button>
        <button id="touchLca" class="touch-btn aux-btn" type="button">LCA</button>
      </div>
      <div class="touch-group pedal-group">
        <button id="touchBrake" class="touch-btn pedal-btn brake" type="button" aria-label="Brake">BRAKE</button>
        <button id="touchGas" class="touch-btn pedal-btn gas" type="button" aria-label="Accelerate">GAS</button>
      </div>
    `;
    document.body.appendChild(overlay);
    this.touchOverlay = overlay;

    const leftBtn = overlay.querySelector("#touchLeft") as HTMLElement;
    const rightBtn = overlay.querySelector("#touchRight") as HTMLElement;
    const gasBtn = overlay.querySelector("#touchGas") as HTMLElement;
    const brakeBtn = overlay.querySelector("#touchBrake") as HTMLElement;
    const accBtn = overlay.querySelector("#touchAcc") as HTMLElement;
    const lcaBtn = overlay.querySelector("#touchLca") as HTMLElement;

    let leftPressed = false;
    let rightPressed = false;

    const updateSteer = () => {
      this.touchControls.steer = (rightPressed ? 1 : 0) - (leftPressed ? 1 : 0);
    };

    leftBtn.addEventListener("touchstart", (e) => { e.preventDefault(); leftPressed = true; updateSteer(); }, { passive: false });
    leftBtn.addEventListener("touchend", (e) => { e.preventDefault(); leftPressed = false; updateSteer(); }, { passive: false });
    leftBtn.addEventListener("touchcancel", (e) => { e.preventDefault(); leftPressed = false; updateSteer(); }, { passive: false });

    rightBtn.addEventListener("touchstart", (e) => { e.preventDefault(); rightPressed = true; updateSteer(); }, { passive: false });
    rightBtn.addEventListener("touchend", (e) => { e.preventDefault(); rightPressed = false; updateSteer(); }, { passive: false });
    rightBtn.addEventListener("touchcancel", (e) => { e.preventDefault(); rightPressed = false; updateSteer(); }, { passive: false });

    gasBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.touchControls.accelerator = 1; }, { passive: false });
    gasBtn.addEventListener("touchend", (e) => { e.preventDefault(); this.touchControls.accelerator = 0; }, { passive: false });
    gasBtn.addEventListener("touchcancel", (e) => { e.preventDefault(); this.touchControls.accelerator = 0; }, { passive: false });

    brakeBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.touchControls.brake = 1; }, { passive: false });
    brakeBtn.addEventListener("touchend", (e) => { e.preventDefault(); this.touchControls.brake = 0; }, { passive: false });
    brakeBtn.addEventListener("touchcancel", (e) => { e.preventDefault(); this.touchControls.brake = 0; }, { passive: false });

    accBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.latches.acc = true; }, { passive: false });
    lcaBtn.addEventListener("touchstart", (e) => { e.preventDefault(); this.latches.lca = true; }, { passive: false });
  }

  liveGamepadLabel(): string {
    if (typeof navigator === "undefined") return "No gamepad";
    const pad = navigator.getGamepads?.().find(Boolean);
    if (!pad) return "No gamepad";
    const controls = this.gamepadControls();
    const axes = pad.axes.map((axis, i) => `A${i}:${axis.toFixed(2)}`).join(" ");
    const buttons = pad.buttons
      .map((button, i) => (button.pressed || button.value > 0.02 ? `B${i}:${button.value.toFixed(2)}` : ""))
      .filter(Boolean)
      .join(" ");
    return [
      pad.id,
      `Mapped steer:${controls.steer.toFixed(2)} acc:${controls.accelerator.toFixed(2)} brake:${controls.brake.toFixed(2)} ACC:${controls.accButton ? "on" : "off"} LCA:${controls.lcaButton ? "on" : "off"}`,
      `Axes ${axes}`,
      buttons ? `Buttons ${buttons}` : "Buttons none"
    ].join("\n");
  }

  private loadGamepadMapping(): GamepadMapping {
    if (typeof localStorage === "undefined") return cloneGamepadMapping(DEFAULT_GAMEPAD_MAPPING);
    try {
      const saved = JSON.parse(localStorage.getItem(GAMEPAD_MAPPING_STORAGE_KEY) || "{}") as unknown;
      return migrateGamepadMapping(saved);
    } catch {
      return cloneGamepadMapping(DEFAULT_GAMEPAD_MAPPING);
    }
  }

  private keyboardControls(): Controls {
    const left = this.keys.has("KeyA") || this.keys.has("ArrowLeft");
    const right = this.keys.has("KeyD") || this.keys.has("ArrowRight");
    const targetSteer = (right ? 1 : 0) - (left ? 1 : 0);
    const now = this.now();
    const previous = this.lastKeyboardSteerSampleMs ?? now;
    const dt = clamp((now - previous) / 1000, 0, MAX_KEYBOARD_STEER_DT);
    const rate = targetSteer === 0 ? KEYBOARD_STEER_CENTER_RATE : KEYBOARD_STEER_TURN_RATE;
    this.lastKeyboardSteerSampleMs = now;
    this.keyboardSteer = moveToward(this.keyboardSteer, targetSteer, rate * dt);

    return {
      steer: this.keyboardSteer,
      accelerator: this.keys.has("KeyW") ? 1 : 0,
      brake: this.keys.has("KeyS") || this.keys.has("Space") ? 1 : 0
    };
  }

  private gamepadControls(): Controls {
    if (typeof navigator === "undefined") return { steer: 0, accelerator: 0, brake: 0 };
    const pad = navigator.getGamepads?.().find(Boolean);
    if (!pad) return { steer: 0, accelerator: 0, brake: 0 };
    const map = this.gamepadMapping;
    const rawSteer = readAxisBinding(pad, map.steer);
    const steer = Math.abs(rawSteer) < map.deadzone ? 0 : clamp(rawSteer * map.steerGain, -1, 1);
    const accelerator = readPedalBinding(pad, map.accelerator);
    const brake = readPedalBinding(pad, map.brake);
    return {
      steer,
      accelerator,
      brake,
      accButton: readButtonBinding(pad, map.acc),
      lcaButton: readButtonBinding(pad, map.lca)
    };
  }

  private consumeLatch(key: keyof ButtonLatch): boolean {
    const value = this.latches[key];
    this.latches[key] = false;
    return value;
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;
    if (event.code === "ArrowDown") this.latches.acc = true;
    if (event.code === "ArrowUp") this.latches.lca = true;
    this.keys.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };
}

function axisPedal(axis: number | undefined): number {
  if (!Number.isFinite(axis)) return 0;
  return clamp(((axis as number) + 1) / 2, 0, 1);
}

function readAxisBinding(pad: Gamepad, binding: GamepadAxisBinding): number {
  const value = Number.isFinite(pad.axes[binding.index]) ? pad.axes[binding.index] : 0;
  return binding.invert ? -value : value;
}

function readPedalBinding(pad: Gamepad, binding: GamepadControlBinding): number {
  if (binding.kind === "axis") return axisPedal(readAxisBinding(pad, binding));
  return readButtonBinding(pad, binding) ? 1 : 0;
}

function readButtonBinding(pad: Gamepad, binding: GamepadButtonBinding): boolean {
  const button = pad.buttons[binding.index];
  return Boolean(button?.pressed || (button?.value ?? 0) > 0.5);
}

function moveToward(current: number, target: number, maxDelta: number): number {
  const delta = target - current;
  if (Math.abs(delta) <= maxDelta) return target;
  return current + Math.sign(delta) * maxDelta;
}

function migrateGamepadMapping(saved: unknown): GamepadMapping {
  if (!isRecord(saved)) return cloneGamepadMapping(DEFAULT_GAMEPAD_MAPPING);
  if ("steerAxis" in saved || "acceleratorAxis" in saved || "brakeAxis" in saved || "accButton" in saved || "lcaButton" in saved) {
    return normalizeGamepadMapping({
      steer: { kind: "axis", index: legacyIndex(saved.steerAxis, DEFAULT_GAMEPAD_MAPPING.steer.index) },
      accelerator: { kind: "axis", index: legacyIndex(saved.acceleratorAxis, bindingIndex(DEFAULT_GAMEPAD_MAPPING.accelerator)) },
      brake: { kind: "axis", index: legacyIndex(saved.brakeAxis, bindingIndex(DEFAULT_GAMEPAD_MAPPING.brake)) },
      acc: { kind: "button", index: legacyIndex(saved.accButton, DEFAULT_GAMEPAD_MAPPING.acc.index) },
      lca: { kind: "button", index: legacyIndex(saved.lcaButton, DEFAULT_GAMEPAD_MAPPING.lca.index) },
      deadzone: numberOr(saved.deadzone, DEFAULT_GAMEPAD_MAPPING.deadzone),
      steerGain: numberOr(saved.steerGain, DEFAULT_GAMEPAD_MAPPING.steerGain)
    });
  }
  return normalizeGamepadMapping({ ...cloneGamepadMapping(DEFAULT_GAMEPAD_MAPPING), ...(saved as Partial<GamepadMapping>) });
}

function normalizeGamepadMapping(mapping: GamepadMapping): GamepadMapping {
  return {
    steer: normalizeAxisBinding(mapping.steer, DEFAULT_GAMEPAD_MAPPING.steer),
    accelerator: normalizeControlBinding(mapping.accelerator, DEFAULT_GAMEPAD_MAPPING.accelerator),
    brake: normalizeControlBinding(mapping.brake, DEFAULT_GAMEPAD_MAPPING.brake),
    acc: normalizeButtonBinding(mapping.acc, DEFAULT_GAMEPAD_MAPPING.acc),
    lca: normalizeButtonBinding(mapping.lca, DEFAULT_GAMEPAD_MAPPING.lca),
    deadzone: clamp(Number(mapping.deadzone) || DEFAULT_GAMEPAD_MAPPING.deadzone, 0, 0.5),
    steerGain: clamp(Number(mapping.steerGain) || DEFAULT_GAMEPAD_MAPPING.steerGain, 0.1, 1.5)
  };
}

function normalizeControlBinding(binding: unknown, fallback: GamepadControlBinding): GamepadControlBinding {
  if (isRecord(binding) && binding.kind === "button") return normalizeButtonBinding(binding, fallback.kind === "button" ? fallback : DEFAULT_GAMEPAD_MAPPING.acc);
  return normalizeAxisBinding(binding, fallback.kind === "axis" ? fallback : DEFAULT_GAMEPAD_MAPPING.steer);
}

function normalizeAxisBinding(binding: unknown, fallback: GamepadAxisBinding): GamepadAxisBinding {
  if (!isRecord(binding)) return { ...fallback };
  return {
    kind: "axis",
    index: clampIndex(binding.index),
    invert: binding.invert === true
  };
}

function normalizeButtonBinding(binding: unknown, fallback: GamepadButtonBinding): GamepadButtonBinding {
  if (!isRecord(binding)) return { ...fallback };
  return {
    kind: "button",
    index: clampIndex(binding.index)
  };
}

function cloneGamepadMapping(mapping: GamepadMapping): GamepadMapping {
  return {
    steer: { ...mapping.steer },
    accelerator: { ...mapping.accelerator },
    brake: { ...mapping.brake },
    acc: { ...mapping.acc },
    lca: { ...mapping.lca },
    deadzone: mapping.deadzone,
    steerGain: mapping.steerGain
  };
}

function bindingIndex(binding: GamepadControlBinding): number {
  return binding.index;
}

function legacyIndex(value: unknown, fallback: number): number {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function numberOr(value: unknown, fallback: number): number {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function clampIndex(value: unknown): number {
  return Math.max(0, Math.min(31, Math.round(Number(value) || 0)));
}
