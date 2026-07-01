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

  public readonly touchControls = { steer: 0, accelerator: 0, brake: 0 };
  private touchOverlay: HTMLDivElement | null = null;

  constructor(private readonly target: HTMLElement | Window = window) {
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

  sample(): Controls {
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

  private isTouchDevice(): boolean {
    return ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
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
