import { afterEach, describe, expect, it, vi } from "vitest";
import { InputManager } from "./inputManager";

function keyEvent(type: "keydown" | "keyup", code: string): Event {
  const event = new Event(type);
  Object.defineProperty(event, "code", { value: code });
  Object.defineProperty(event, "repeat", { value: false });
  return event;
}

function createManager(): { clock: { now: number }; manager: InputManager; target: EventTarget } {
  const clock = { now: 0 };
  const target = new EventTarget();
  const manager = new InputManager(target, { now: () => clock.now });
  manager.sample();
  return { clock, manager, target };
}

function sampleFor(manager: InputManager, clock: { now: number }, ms: number): ReturnType<InputManager["sample"]> {
  let controls = manager.sample();
  for (let elapsed = 0; elapsed < ms; elapsed += 16) {
    clock.now += Math.min(16, ms - elapsed);
    controls = manager.sample();
  }
  return controls;
}

describe("InputManager", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ramps keyboard steering instead of snapping to full lock", () => {
    const { clock, manager, target } = createManager();

    target.dispatchEvent(keyEvent("keydown", "KeyD"));

    expect(sampleFor(manager, clock, 100).steer).toBeGreaterThan(0);
    expect(sampleFor(manager, clock, 0).steer).toBeLessThan(0.2);
    expect(sampleFor(manager, clock, 300).steer).toBeLessThan(0.65);
    expect(sampleFor(manager, clock, 700).steer).toBeCloseTo(1);

    manager.dispose();
  });

  it("returns keyboard steering toward center after release", () => {
    const { clock, manager, target } = createManager();

    target.dispatchEvent(keyEvent("keydown", "KeyA"));
    expect(sampleFor(manager, clock, 900).steer).toBeCloseTo(-1);

    target.dispatchEvent(keyEvent("keyup", "KeyA"));
    const midway = sampleFor(manager, clock, 400);
    const centered = sampleFor(manager, clock, 400);

    expect(midway.steer).toBeGreaterThan(-0.6);
    expect(midway.steer).toBeLessThan(-0.4);
    expect(centered.steer).toBeCloseTo(0);

    manager.dispose();
  });

  it("keeps gamepad steering direct and unsmoothed", () => {
    const axes = [0.6, 0, 0, 0, 0, -1];
    vi.stubGlobal("navigator", {
      maxTouchPoints: 0,
      getGamepads: () => [{
        id: "test-pad",
        axes,
        buttons: [{ pressed: false }, { pressed: false }]
      } as unknown as Gamepad]
    });
    const { clock, manager } = createManager();

    expect(sampleFor(manager, clock, 16).steer).toBeCloseTo(0.45);

    axes[0] = -0.6;
    expect(sampleFor(manager, clock, 16).steer).toBeCloseTo(-0.45);

    manager.dispose();
  });

  it("can sample gamepad controls without keyboard steering", () => {
    vi.stubGlobal("navigator", {
      maxTouchPoints: 0,
      getGamepads: () => [{
        id: "test-pad",
        axes: [0.4, 0, 0, 0, 0, -1],
        buttons: [{ pressed: false }, { pressed: false }]
      } as unknown as Gamepad]
    });
    const { clock, manager, target } = createManager();

    target.dispatchEvent(keyEvent("keydown", "KeyA"));
    sampleFor(manager, clock, 400);

    expect(manager.sample("gamepad").steer).toBeCloseTo(0.3);

    manager.dispose();
  });

  it("allows gamepad inputs to be reassigned", () => {
    vi.stubGlobal("navigator", {
      maxTouchPoints: 0,
      getGamepads: () => [{
        id: "test-pad",
        axes: [0, -0.8, -1, 0, 0, 1],
        buttons: [{ pressed: false }, { pressed: true }, { pressed: false }, { pressed: true }]
      } as unknown as Gamepad]
    });
    const { manager } = createManager();

    manager.setGamepadMapping({ steerAxis: 1, accButton: 3, lcaButton: 1 });
    const controls = manager.sample("gamepad");

    expect(controls.steer).toBeCloseTo(-0.6);
    expect(controls.accButton).toBe(true);
    expect(controls.lcaButton).toBe(true);

    manager.dispose();
  });
});
