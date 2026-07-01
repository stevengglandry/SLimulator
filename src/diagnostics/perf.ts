export class PerfTracker {
  private last = performance.now();
  private frames = 0;
  private acc = 0;
  fps = 0;

  mark(now = performance.now()): number {
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.frames++;
    this.acc += dt;
    if (this.acc >= 0.5) {
      this.fps = this.frames / this.acc;
      this.frames = 0;
      this.acc = 0;
    }
    return dt;
  }
}
