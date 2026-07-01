export const bus = new EventTarget();

export function cloneForEvent<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export function publish<T>(name: string, detail: T, immediate = true): void {
  const frozen = cloneForEvent(detail);
  bus.dispatchEvent(new CustomEvent(name, { detail: frozen }));
  window.dispatchEvent(new CustomEvent(`slimulator:${name}`, { detail: frozen }));
  if (immediate && name !== "event") {
    const eventDetail = { type: name, data: frozen };
    bus.dispatchEvent(new CustomEvent("event", { detail: eventDetail }));
    window.dispatchEvent(new CustomEvent("slimulator:event", { detail: eventDetail }));
  }
}
