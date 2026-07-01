import type { Controls } from "../game/types";
import { clamp } from "../shared/math";

type ButtonLatch = {
  acc: boolean;
  lca: boolean;
};

export class InputManager {
  private readonly keys = new Set<string>();
  private readonly latches: ButtonLatch = { acc: false, lca: false };
  private readonly gamepadMapping = {
    steerAxis: 0,
    acceleratorAxis: 5,
    brakeAxis: 2,
    accButton: 0,
    lcaButton: 1,
    deadzone: 0.08,
    steerGain: 0.75
  };

  constructor(private readonly target: HTMLElement | Window = window) {
    target.addEventListener("keydown", this.onKeyDown as EventListener);
    target.addEventListener("keyup", this.onKeyUp as EventListener);
  }

  dispose(): void {
    this.target.removeEventListener("keydown", this.onKeyDown as EventListener);
    this.target.removeEventListener("keyup", this.onKeyUp as EventListener);
  }

  sample(): Controls {
    const keyboard = this.keyboardControls();
    const gamepad = this.gamepadControls();
    const steer = Math.abs(gamepad.steer) > Math.abs(keyboard.steer) ? gamepad.steer : keyboard.steer;
    const accelerator = Math.max(keyboard.accelerator, gamepad.accelerator);
    const brake = Math.max(keyboard.brake, gamepad.brake);
    const accButton = this.consumeLatch("acc") || gamepad.accButton;
    const lcaButton = this.consumeLatch("lca") || gamepad.lcaButton;
    return { steer, accelerator, brake, accButton, lcaButton };
  }

  liveGamepadLabel(): string {
    const pad = navigator.getGamepads?.().find(Boolean);
    if (!pad) return "No gamepad";
    const axes = pad.axes.map((axis, i) => `A${i}:${axis.toFixed(2)}`).join(" ");
    const buttons = pad.buttons.map((button, i) => (button.pressed ? `B${i}` : "")).filter(Boolean).join(" ");
    return `${pad.id}\n${axes}${buttons ? `\n${buttons}` : ""}`;
  }

  private keyboardControls(): Controls {
    const left = this.keys.has("KeyA") || this.keys.has("ArrowLeft");
    const right = this.keys.has("KeyD") || this.keys.has("ArrowRight");
    return {
      steer: (right ? 1 : 0) - (left ? 1 : 0),
      accelerator: this.keys.has("KeyW") ? 1 : 0,
      brake: this.keys.has("KeyS") || this.keys.has("Space") ? 1 : 0
    };
  }

  private gamepadControls(): Controls {
    const pad = navigator.getGamepads?.().find(Boolean);
    if (!pad) return { steer: 0, accelerator: 0, brake: 0 };
    const map = this.gamepadMapping;
    const rawSteer = Number.isFinite(pad.axes[map.steerAxis]) ? pad.axes[map.steerAxis] : 0;
    const steer = Math.abs(rawSteer) < map.deadzone ? 0 : clamp(rawSteer * map.steerGain, -1, 1);
    const accelerator = axisPedal(pad.axes[map.acceleratorAxis]);
    const brake = axisPedal(pad.axes[map.brakeAxis]);
    return {
      steer,
      accelerator,
      brake,
      accButton: Boolean(pad.buttons[map.accButton]?.pressed),
      lcaButton: Boolean(pad.buttons[map.lcaButton]?.pressed)
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
