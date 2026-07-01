import type { SimSnapshot } from "../game/types";
import { clamp } from "../shared/math";

const EV_SPEED_REFERENCE_MPS = 38;

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private motorFundamental: OscillatorNode | null = null;
  private motorHarmonic: OscillatorNode | null = null;
  private inverterWhine: OscillatorNode | null = null;
  private cabinHum: OscillatorNode | null = null;
  private motorGain: GainNode | null = null;
  private inverterGain: GainNode | null = null;
  private cabinHumGain: GainNode | null = null;
  private motorTone: BiquadFilterNode | null = null;
  private tireNoise: AudioBufferSourceNode | null = null;
  private tireGain: GainNode | null = null;
  private tireFilter: BiquadFilterNode | null = null;
  private roadNoise: AudioBufferSourceNode | null = null;
  private roadGain: GainNode | null = null;
  private roadFilter: BiquadFilterNode | null = null;
  private started = false;
  private lastCrashCount = 0;
  private lastImpactBurstAt = -1;

  resume(): void {
    void this.ensure().then(() => this.ctx?.resume());
  }

  update(snapshot: SimSnapshot): void {
    if (!this.started) return;
    const ctx = this.ctx;
    if (
      !ctx ||
      !this.motorFundamental ||
      !this.motorHarmonic ||
      !this.inverterWhine ||
      !this.cabinHum ||
      !this.motorGain ||
      !this.inverterGain ||
      !this.cabinHumGain ||
      !this.motorTone ||
      !this.tireGain ||
      !this.tireFilter ||
      !this.roadGain ||
      !this.roadFilter
    ) {
      return;
    }

    const speedRatio = clamp(snapshot.vehicle.speedMps / EV_SPEED_REFERENCE_MPS, 0, 1);
    const speedShape = Math.pow(speedRatio, 1.18);
    const throttle = snapshot.vehicle.controls.accelerator;
    const brake = snapshot.vehicle.controls.brake;
    const steeringLoad = Math.abs(snapshot.vehicle.controls.steer);
    const headingSlip = clamp(Math.abs(snapshot.vehicle.headingErrorRad) * 1.4, 0, 1);
    const tireSlip = clamp(speedRatio * (steeringLoad * 0.7 + brake * 0.48 + headingSlip * 0.45), 0, 1);
    const torqueLoad = clamp(throttle + brake * 0.35, 0, 1);
    const now = ctx.currentTime;
    const motorHz = 64 + speedShape * 330 + torqueLoad * 52;
    const inverterHz = 540 + speedShape * 720 + torqueLoad * 160;

    this.motorFundamental.frequency.setTargetAtTime(motorHz, now, 0.08);
    this.motorHarmonic.frequency.setTargetAtTime(motorHz * 1.53, now, 0.08);
    this.inverterWhine.frequency.setTargetAtTime(inverterHz, now, 0.06);
    this.cabinHum.frequency.setTargetAtTime(48 + speedRatio * 22 + torqueLoad * 18, now, 0.16);
    this.motorTone.frequency.setTargetAtTime(420 + speedShape * 780 + torqueLoad * 260, now, 0.12);

    this.motorGain.gain.setTargetAtTime(0.012 + speedShape * 0.018 + torqueLoad * 0.04, now, 0.12);
    this.inverterGain.gain.setTargetAtTime(0.00012 + speedShape * 0.00032 + torqueLoad * 0.0007, now, 0.14);
    this.cabinHumGain.gain.setTargetAtTime(0.01 + speedRatio * 0.005 + torqueLoad * 0.009, now, 0.18);
    this.roadFilter.frequency.setTargetAtTime(150 + speedRatio * 430, now, 0.24);
    this.roadGain.gain.setTargetAtTime(speedShape * 0.042 + brake * speedRatio * 0.008, now, 0.2);
    this.tireFilter.frequency.setTargetAtTime(420 + speedRatio * 980 + tireSlip * 520, now, 0.16);
    this.tireGain.gain.setTargetAtTime(Math.pow(speedRatio, 1.45) * 0.014 + tireSlip * 0.024, now, 0.12);

    if (snapshot.metrics.crashCount > this.lastCrashCount) this.burst("impact");
    this.lastCrashCount = snapshot.metrics.crashCount;
  }

  alert(type: "earcon" | "haptic"): void {
    void this.ensure().then(() => {
      const ctx = this.ctx;
      const master = this.master;
      if (!ctx || !master) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type === "earcon" ? "sine" : "square";
      osc.frequency.value = type === "earcon" ? 880 : 82;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(type === "earcon" ? 0.16 : 0.08, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === "earcon" ? 0.45 : 0.7));
      osc.connect(gain).connect(master);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    });
  }

  burst(kind: "screech" | "impact"): void {
    void this.ensure().then(() => {
      const ctx = this.ctx;
      const master = this.master;
      if (!ctx || !master) return;
      if (kind === "impact") this.playImpactCrash(ctx, master);
      else this.playTireScreech(ctx, master);
    });
  }

  private async ensure(): Promise<void> {
    if (this.started) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.58;
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 16;
    compressor.ratio.value = 3.5;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;
    this.master.connect(compressor).connect(this.ctx.destination);

    this.motorGain = this.ctx.createGain();
    this.motorGain.gain.value = 0;
    this.motorTone = this.ctx.createBiquadFilter();
    this.motorTone.type = "lowpass";
    this.motorTone.frequency.value = 620;
    this.motorTone.Q.value = 0.72;
    this.motorFundamental = this.ctx.createOscillator();
    this.motorFundamental.type = "sine";
    this.motorHarmonic = this.ctx.createOscillator();
    this.motorHarmonic.type = "triangle";
    const fundamentalGain = this.ctx.createGain();
    fundamentalGain.gain.value = 0.9;
    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.value = 0.16;
    this.motorFundamental.connect(fundamentalGain).connect(this.motorTone);
    this.motorHarmonic.connect(harmonicGain).connect(this.motorTone);
    this.motorTone.connect(this.motorGain).connect(this.master);
    this.motorFundamental.start();
    this.motorHarmonic.start();

    this.inverterGain = this.ctx.createGain();
    this.inverterGain.gain.value = 0;
    this.inverterWhine = this.ctx.createOscillator();
    this.inverterWhine.type = "sine";
    const inverterFilter = this.ctx.createBiquadFilter();
    inverterFilter.type = "bandpass";
    inverterFilter.frequency.value = 720;
    inverterFilter.Q.value = 0.5;
    this.inverterWhine.connect(inverterFilter).connect(this.inverterGain).connect(this.master);
    this.inverterWhine.start();

    this.cabinHumGain = this.ctx.createGain();
    this.cabinHumGain.gain.value = 0;
    this.cabinHum = this.ctx.createOscillator();
    this.cabinHum.type = "sine";
    const humFilter = this.ctx.createBiquadFilter();
    humFilter.type = "lowpass";
    humFilter.frequency.value = 118;
    this.cabinHum.connect(humFilter).connect(this.cabinHumGain).connect(this.master);
    this.cabinHum.start();

    const roadBuffer = this.createNoiseBuffer("warm");
    this.roadNoise = this.ctx.createBufferSource();
    this.roadNoise.buffer = roadBuffer;
    this.roadNoise.loop = true;
    this.roadGain = this.ctx.createGain();
    this.roadGain.gain.value = 0;
    const roadHighpass = this.ctx.createBiquadFilter();
    roadHighpass.type = "highpass";
    roadHighpass.frequency.value = 34;
    this.roadFilter = this.ctx.createBiquadFilter();
    this.roadFilter.type = "lowpass";
    this.roadFilter.frequency.value = 220;
    this.roadFilter.Q.value = 0.56;
    this.roadNoise.connect(roadHighpass).connect(this.roadFilter).connect(this.roadGain).connect(this.master);
    this.roadNoise.start();

    const noise = this.createNoiseBuffer("bright");
    this.tireNoise = this.ctx.createBufferSource();
    this.tireNoise.buffer = noise;
    this.tireNoise.loop = true;
    this.tireGain = this.ctx.createGain();
    this.tireGain.gain.value = 0;
    const tireHighpass = this.ctx.createBiquadFilter();
    tireHighpass.type = "highpass";
    tireHighpass.frequency.value = 170;
    this.tireFilter = this.ctx.createBiquadFilter();
    this.tireFilter.type = "bandpass";
    this.tireFilter.frequency.value = 520;
    this.tireFilter.Q.value = 0.62;
    this.tireNoise.connect(tireHighpass).connect(this.tireFilter).connect(this.tireGain).connect(this.master);
    this.tireNoise.start();
    this.started = true;
  }

  private playTireScreech(ctx: AudioContext, master: GainNode): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.6);
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(980, now);
    filter.frequency.exponentialRampToValueAtTime(640, now + 0.55);
    filter.Q.value = 4.4;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
    osc.connect(filter).connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + 0.78);
  }

  private playImpactCrash(ctx: AudioContext, master: GainNode): void {
    const now = ctx.currentTime;
    if (now - this.lastImpactBurstAt < 0.22) return;
    this.lastImpactBurstAt = now;

    const squeal = ctx.createOscillator();
    const squealFilter = ctx.createBiquadFilter();
    const squealGain = ctx.createGain();
    squeal.type = "sawtooth";
    squeal.frequency.setValueAtTime(930, now);
    squeal.frequency.exponentialRampToValueAtTime(520, now + 0.36);
    squealFilter.type = "bandpass";
    squealFilter.frequency.setValueAtTime(1150, now);
    squealFilter.frequency.exponentialRampToValueAtTime(620, now + 0.38);
    squealFilter.Q.value = 5.2;
    squealGain.gain.setValueAtTime(0.0001, now);
    squealGain.gain.exponentialRampToValueAtTime(0.11, now + 0.016);
    squealGain.gain.exponentialRampToValueAtTime(0.018, now + 0.32);
    squealGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.54);
    squeal.connect(squealFilter).connect(squealGain).connect(master);
    squeal.start(now);
    squeal.stop(now + 0.58);

    const thud = ctx.createOscillator();
    const thudFilter = ctx.createBiquadFilter();
    const thudGain = ctx.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(62, now + 0.035);
    thud.frequency.exponentialRampToValueAtTime(34, now + 0.34);
    thudFilter.type = "lowpass";
    thudFilter.frequency.value = 160;
    thudGain.gain.setValueAtTime(0.0001, now);
    thudGain.gain.exponentialRampToValueAtTime(0.32, now + 0.045);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);
    thud.connect(thudFilter).connect(thudGain).connect(master);
    thud.start(now);
    thud.stop(now + 0.5);

    const crunch = ctx.createBufferSource();
    const crunchFilter = ctx.createBiquadFilter();
    const crunchGain = ctx.createGain();
    crunch.buffer = this.createNoiseBuffer("bright");
    crunchFilter.type = "bandpass";
    crunchFilter.frequency.value = 340;
    crunchFilter.Q.value = 1.1;
    crunchGain.gain.setValueAtTime(0.0001, now);
    crunchGain.gain.exponentialRampToValueAtTime(0.18, now + 0.045);
    crunchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    crunch.connect(crunchFilter).connect(crunchGain).connect(master);
    crunch.start(now + 0.025);
    crunch.stop(now + 0.28);
  }

  private createNoiseBuffer(character: "warm" | "bright"): AudioBuffer {
    const ctx = this.ctx;
    if (!ctx) throw new Error("Audio context is not ready");
    const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    let smoothed = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      if (character === "warm") {
        smoothed = smoothed * 0.985 + white * 0.015;
        data[i] = smoothed * 4.2;
      } else {
        smoothed = smoothed * 0.35 + white * 0.65;
        data[i] = smoothed;
      }
    }
    return noise;
  }
}
