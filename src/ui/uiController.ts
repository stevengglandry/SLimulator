import { config, SCENES } from "../game/config";
import { createLogText } from "../game/logging";
import type { CameraMode, SceneKey, SimSnapshot } from "../game/types";
import { fixed, formatTime } from "../shared/math";

export interface UiActions {
  onScene(scene: SceneKey): void;
  onNewSession(subId: string): void;
  onToggleACC(): void;
  onToggleLCA(): void;
  onInputSource(source: "local" | "external"): void;
  onAlert(type: "earcon" | "haptic", expectedAction: string): void;
  onCamera(mode: CameraMode): void;
  onQuality(high: boolean): void;
  onPhysicsChange(key: string, value: number): void;
}

export interface UiController {
  canvas: HTMLCanvasElement;
  update(snapshot: SimSnapshot, fps: number, gamepadLabel: string): void;
  toast(message: string, tone?: "info" | "warn" | "danger", durationMs?: number): void;
}

export function createUi(root: HTMLElement, actions: UiActions): UiController {
  root.className = "sim-root";
  root.innerHTML = `
    <canvas id="world" class="world-canvas" tabindex="0" aria-label="SLimulator forward road view"></canvas>
    <div class="vignette"></div>
    <div class="topbar">
      <div class="top-cluster">
        <div class="brand glass micro"><i class="brand-mark"></i><strong>SLIMULATOR</strong></div>
        <button id="modToggle" class="btn micro" type="button">MOD</button>
        <button id="cockpitToggle" class="btn micro" type="button">COCKPIT</button>
      </div>
      <div class="top-cluster">
        <div id="sceneChip" class="chip glass micro">UNMAPPED</div>
        <div id="fpsChip" class="chip glass micro">-- FPS</div>
      </div>
    </div>
    <aside id="modPanel" class="mod-panel glass" aria-label="Moderator controls">
      <div class="panel-head"><h2>Moderator</h2><button id="closePanel" class="btn micro" type="button">CLOSE</button></div>
      <div class="panel-scroll">
        <section class="section">
          <p class="section-title">Scene</p>
          <div class="grid-3">
            <button class="btn micro scene-btn" data-scene="unmapped" type="button">Forest</button>
            <button class="btn micro scene-btn" data-scene="l2" type="button">L2 Hwy</button>
            <button class="btn micro scene-btn" data-scene="l3" type="button">L3 Hwy</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Session</p>
          <label class="field"><span class="label">SubID</span><input id="subId" autocomplete="off" /></label>
          <div class="grid-2">
            <button id="newSession" class="btn micro accent" type="button">NEW</button>
            <button id="downloadLog" class="btn micro" type="button">LOG</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Driver Source</p>
          <div class="grid-2">
            <button class="btn micro input-btn active" data-input="local" type="button">Local</button>
            <button class="btn micro input-btn" data-input="external" type="button">External</button>
          </div>
          <pre id="gamepadLive" class="label" style="white-space:pre-wrap;margin:10px 0 0;line-height:1.35">No gamepad</pre>
        </section>
        <section class="section">
          <p class="section-title">Alerts</p>
          <label class="field"><span class="label">Expected</span><select id="expectedAction">
            <option value="brake">Brake</option><option value="accelerate">Accelerate</option>
            <option value="steerLeft">Steer Left</option><option value="steerRight">Steer Right</option>
            <option value="acc">ACC Button</option><option value="lca">LCA Button</option>
          </select></label>
          <div class="grid-2">
            <button class="btn micro alert-btn" data-alert="earcon" type="button">Earcon</button>
            <button class="btn micro alert-btn" data-alert="haptic" type="button">Haptic</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Camera</p>
          <div class="grid-3">
            <button class="btn micro camera-btn active" data-camera="cockpit" type="button">Cockpit</button>
            <button class="btn micro camera-btn" data-camera="chase" type="button">Chase</button>
            <button class="btn micro camera-btn" data-camera="debug" type="button">Debug</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Physics Tuning</p>
          <div class="field">
            <span class="label" id="lblEngineAccel">Engine Accel: 7.0 m/s²</span>
            <input type="range" id="sliderEngineAccel" min="3.0" max="15.0" step="0.1" value="7.0" />
          </div>
          <div class="field">
            <span class="label" id="lblAeroDrag">Aero Drag: 0.0012</span>
            <input type="range" id="sliderAeroDrag" min="0.0002" max="0.0050" step="0.0001" value="0.0012" />
          </div>
          <div class="field">
            <span class="label" id="lblBrakeDecel">Brake Power: 12.5 m/s²</span>
            <input type="range" id="sliderBrakeDecel" min="5.0" max="20.0" step="0.1" value="12.5" />
          </div>
          <div class="field">
            <span class="label" id="lblSteerResponse">Steer Response: 0.42</span>
            <input type="range" id="sliderSteerResponse" min="0.10" max="1.00" step="0.01" value="0.42" />
          </div>
        </section>
        <section class="section">
          <p class="section-title">Render</p>
          <div class="grid-2">
            <button class="btn micro quality-btn active" data-quality="high" type="button">High</button>
            <button class="btn micro quality-btn" data-quality="perf" type="button">Perf</button>
          </div>
        </section>
        <section class="section">
          <p class="section-title">Status</p>
          <div class="metric-grid">
            <div class="metric"><span class="label">Mode</span><span id="statusMode" class="value">manual</span></div>
            <div class="metric"><span class="label">Lanes</span><span id="statusLanes" class="value">1</span></div>
            <div class="metric"><span class="label">Queue</span><span id="statusQueue" class="value">none</span></div>
            <div class="metric"><span class="label">Crashes</span><span id="statusCrashes" class="value">0</span></div>
          </div>
        </section>
      </div>
    </aside>
    <section id="cockpit" class="cockpit">
      <div class="dash"></div>
      <div class="score-card glass">
        <div class="score-total">
          <span class="label">Total Score</span>
          <strong id="scoreReadout" class="value">0.0</strong>
        </div>
        <div class="score-line"></div>
        <div class="score-row"><span>Steering</span><strong id="steeringScoreReadout">0.0</strong></div>
        <div class="score-row"><span>SDLP</span><strong id="sdlpReadout">0.000 M</strong></div>
        <div class="score-row"><span>Off-road</span><strong id="offRoadReadout">0.0</strong></div>
        <div class="score-row"><span>Crashes</span><strong id="crashReadout">0 x 200</strong></div>
        <div class="score-row"><span>Distance</span><strong id="distanceReadout">0 M</strong></div>
      </div>
      <div class="cluster glass">
        <div class="legacy-cluster">
          <div class="legacy-speed-row">
            <span id="speedReadout" class="legacy-speed">000</span>
            <span class="legacy-mph">mph</span>
          </div>
          <div class="legacy-pill-row">
            <div id="accGauge" class="legacy-pill"><span>ACC</span><strong id="accReadout">OFF</strong><i id="accGaugeFill"></i></div>
            <div id="llcaGauge" class="legacy-pill"><span>LLCA</span><strong id="lcaReadout">OFF</strong><i id="llcaGaugeFill"></i></div>
            <div id="modeGauge" class="legacy-pill"><span>MODE</span><strong id="modeReadout">MAN</strong><i></i></div>
          </div>
          <div id="dic" class="dic micro">READY - MANUAL</div>
        </div>
      </div>
      <div class="lane-card glass">
        <div id="laneViz" class="lane-viz"><canvas id="laneCanvas" aria-label="Road and lane position visualization"></canvas></div>
        <div class="lane-caption">
          <strong id="miniSceneReadout">UNMAPPED - 1 LANE</strong>
          <span id="miniModeReadout">MANUAL</span>
        </div>
      </div>
      <div class="pedals">
        <div class="pedal-wrap brake-wrap">
          <div class="pedal brake" aria-label="Brake pedal"><i id="brakeFill"></i></div>
          <span>Brake<br>(S)</span>
        </div>
        <div class="pedal-wrap acc-wrap">
          <div class="pedal acc" aria-label="Accelerator pedal"><i id="accelFill"></i></div>
          <span>Accel<br>(W)</span>
        </div>
      </div>
      <div id="steering" class="steering">
        <button id="wheelLca" class="wheel-btn lca btn micro" type="button">LLCA</button>
        <button id="wheelAcc" class="wheel-btn acc btn micro" type="button">ACC</button>
        <div class="wheel-hub"></div>
      </div>
    </section>
    <div id="toast" class="toast glass micro"></div>
  `;

  const canvas = must<HTMLCanvasElement>("world");
  const panel = must<HTMLElement>("modPanel");
  const cockpit = must<HTMLElement>("cockpit");
  const toastEl = must<HTMLElement>("toast");
  let lastSnapshot: SimSnapshot | null = null;
  let toastTimer = 0;
  let lastHudUpdateMs = -Infinity;
  let lastLaneUpdateMs = -Infinity;
  let lastFpsUpdateMs = -Infinity;
  let lastGamepadUpdateMs = -Infinity;

  must("modToggle").addEventListener("click", () => panel.classList.toggle("open"));
  must("closePanel").addEventListener("click", () => panel.classList.remove("open"));
  must("cockpitToggle").addEventListener("click", () => cockpit.classList.toggle("minimized"));
  must("wheelAcc").addEventListener("click", () => actions.onToggleACC());
  must("wheelLca").addEventListener("click", () => actions.onToggleLCA());
  must("newSession").addEventListener("click", () => actions.onNewSession((must<HTMLInputElement>("subId").value || "").trim()));
  must("downloadLog").addEventListener("click", () => {
    if (!lastSnapshot) return;
    const blob = new Blob([createLogText(lastSnapshot)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `slimulator-log-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  });

  document.querySelectorAll<HTMLButtonElement>(".scene-btn").forEach((button) => {
    button.addEventListener("click", () => actions.onScene(button.dataset.scene as SceneKey));
  });
  document.querySelectorAll<HTMLButtonElement>(".input-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setActive(".input-btn", button);
      actions.onInputSource(button.dataset.input as "local" | "external");
    });
  });
  document.querySelectorAll<HTMLButtonElement>(".alert-btn").forEach((button) => {
    button.addEventListener("click", () => actions.onAlert(button.dataset.alert as "earcon" | "haptic", must<HTMLSelectElement>("expectedAction").value));
  });
  document.querySelectorAll<HTMLButtonElement>(".camera-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setActive(".camera-btn", button);
      actions.onCamera(button.dataset.camera as CameraMode);
    });
  });
  document.querySelectorAll<HTMLButtonElement>(".quality-btn").forEach((button) => {
    button.addEventListener("click", () => {
      setActive(".quality-btn", button);
      actions.onQuality(button.dataset.quality === "high");
    });
  });

  const handlePhysicsSlider = (sliderId: string, labelId: string, paramName: string, suffix: string = "") => {
    const slider = must<HTMLInputElement>(sliderId);
    const label = must<HTMLElement>(labelId);
    
    const update = () => {
      const val = parseFloat(slider.value);
      label.textContent = `${paramName}: ${val.toFixed(sliderId === "sliderAeroDrag" ? 4 : (suffix === "" ? 2 : 1))}${suffix}`;
      actions.onPhysicsChange(sliderId.replace("slider", "").replace(/^\w/, (c) => c.toLowerCase()), val);
    };

    slider.addEventListener("input", update);
  };

  handlePhysicsSlider("sliderEngineAccel", "lblEngineAccel", "Engine Accel", " m/s²");
  handlePhysicsSlider("sliderAeroDrag", "lblAeroDrag", "Aero Drag");
  handlePhysicsSlider("sliderBrakeDecel", "lblBrakeDecel", "Brake Power", " m/s²");
  handlePhysicsSlider("sliderSteerResponse", "lblSteerResponse", "Steer Response");

  return {
    canvas,
    update(snapshot, fps, gamepadLabel) {
      lastSnapshot = snapshot;
      const now = performance.now();
      const sceneLabel = SCENES[snapshot.road.scene].label;
      if (now - lastFpsUpdateMs >= 500) {
        must("fpsChip").textContent = fps ? `${Math.round(fps)} FPS` : "-- FPS";
        lastFpsUpdateMs = now;
      }
      if (now - lastHudUpdateMs >= 1000 / 15) {
        must("sceneChip").textContent = `${sceneLabel}${snapshot.road.transition ? ` -> ${SCENES[snapshot.road.transition.to].label}` : ""}`;
        const speedMph = Math.round(snapshot.vehicle.speedMph);
        must("speedReadout").textContent = String(speedMph).padStart(3, "0");
        must("accReadout").textContent = snapshot.adas.accActive ? String(Math.round(snapshot.adas.setSpeedMph)) : "OFF";
        must("lcaReadout").textContent = snapshot.adas.lcaActive ? "ON" : snapshot.adas.autoArmed ? "ARM" : "OFF";
        must<HTMLElement>("accGauge").classList.toggle("active", snapshot.adas.accActive);
        must<HTMLElement>("llcaGauge").classList.toggle("active", snapshot.adas.lcaActive || snapshot.adas.autoArmed);
        must<HTMLElement>("modeGauge").classList.toggle("active", snapshot.adas.mode !== "manual");
        must("modeReadout").textContent = snapshot.adas.mode === "manual" ? "MAN" : snapshot.adas.mode.toUpperCase();
        must("accGauge").setAttribute("title", snapshot.adas.accActive ? `ACC set ${Math.round(snapshot.adas.setSpeedMph)} mph` : "ACC off");
        must("llcaGauge").setAttribute("title", snapshot.adas.lcaActive ? "LLCA active" : snapshot.adas.autoArmed ? "LLCA armed" : "LLCA off");
        must<HTMLElement>("accGaugeFill").style.width = snapshot.adas.accActive ? `${Math.max(12, Math.min(100, snapshot.adas.setSpeedMph))}%` : "8%";
        must<HTMLElement>("llcaGaugeFill").style.width = snapshot.adas.lcaActive ? "100%" : snapshot.adas.autoArmed ? "54%" : "8%";
        must("dic").textContent = snapshot.dicMessage;
        must("scoreReadout").textContent = fixed(snapshot.metrics.totalScore, 1);
        must("sdlpReadout").textContent = `${fixed(snapshot.metrics.sdlp, 3)} M`;
        must("steeringScoreReadout").textContent = fixed(snapshot.metrics.steeringPoints, 1);
        must("offRoadReadout").textContent = snapshot.metrics.offRoadPenalty > 0 ? `-${fixed(snapshot.metrics.offRoadPenalty, 1)}` : "0.0";
        must("crashReadout").textContent = `${snapshot.metrics.crashCount} x ${config.crashPenalty}`;
        must("distanceReadout").textContent = `${Math.round(snapshot.vehicle.distanceM)} M`;
        must("miniSceneReadout").textContent = `${sceneLabel} - ${snapshot.road.lanesPerDirection} LANE${snapshot.road.lanesPerDirection === 1 ? "" : "S"}`;
        must("miniModeReadout").textContent = snapshot.adas.mode.toUpperCase();
        must("statusMode").textContent = snapshot.adas.mode;
        must("statusLanes").textContent = String(snapshot.road.lanesPerDirection);
        must("statusQueue").textContent = snapshot.road.queue.map((item) => SCENES[item.target].label).join(" -> ") || "none";
        must("statusCrashes").textContent = String(snapshot.metrics.crashCount);
        must<HTMLElement>("accelFill").style.height = `${Math.round(snapshot.vehicle.controls.accelerator * 100)}%`;
        must<HTMLElement>("brakeFill").style.height = `${Math.round(snapshot.vehicle.controls.brake * 100)}%`;
        must<HTMLElement>("steering").style.transform = `translateX(-50%) rotate(${(snapshot.vehicle.controls.steer * 86).toFixed(1)}deg)`;
        must("wheelAcc").classList.toggle("active", snapshot.adas.accActive);
        must("wheelLca").classList.toggle("active", snapshot.adas.lcaActive || snapshot.adas.autoArmed);
        if (snapshot.vehicle.crashReset) {
          must("dic").textContent = `${snapshot.dicMessage} - ${snapshot.vehicle.crashReset.phase.toUpperCase()}`;
        }
        must("cockpitToggle").textContent = cockpit.classList.contains("minimized") ? "SHOW" : "COCKPIT";
        must("statusMode").setAttribute("title", `Elapsed ${formatTime(snapshot.session.elapsed)}`);
        lastHudUpdateMs = now;
      }
      if (now - lastGamepadUpdateMs >= 250) {
        must("gamepadLive").textContent = gamepadLabel;
        lastGamepadUpdateMs = now;
      }
      if (now - lastLaneUpdateMs >= 100) {
        drawLaneViz(must<HTMLCanvasElement>("laneCanvas"), snapshot);
        lastLaneUpdateMs = now;
      }
    },
    toast(message, tone = "info", durationMs = 2200) {
      toastEl.textContent = message;
      toastEl.className = `toast glass micro show ${tone}`;
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), durationMs);
    }
  };
}

function must<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing UI element #${id}`);
  return el as T;
}

function setActive(selector: string, active: HTMLElement): void {
  document.querySelectorAll(selector).forEach((node) => node.classList.toggle("active", node === active));
}

function drawLaneViz(canvas: HTMLCanvasElement, snapshot: SimSnapshot): void {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  const bounds = snapshot.road.bounds;
  const scale = width / Math.max(1, bounds.rightWall - bounds.leftWall);
  const roadCenterOffset = (bounds.rightWall + bounds.leftWall) / 2;
  const xFor = (lateral: number, xOffset: number) => {
    return width / 2 + (lateral + xOffset - roadCenterOffset) * scale;
  };

  // Grass Background
  ctx.fillStyle = "#2d4c3c";
  ctx.fillRect(0, 0, width, height);

  const curvePoints = snapshot.road.curvePoints || Array.from({ length: 9 }, (_, i) => ({ sOffset: -5 + i * 5, xOffset: 0 }));

  // Draw Paved Road
  ctx.fillStyle = "#1c2936";
  ctx.beginPath();
  for (let i = curvePoints.length - 1; i >= 0; i--) {
    const pt = curvePoints[i];
    const y = height * (1 - (pt.sOffset + 10) / 40);
    if (i === curvePoints.length - 1) {
      ctx.moveTo(xFor(bounds.leftEdge, pt.xOffset), y);
    } else {
      ctx.lineTo(xFor(bounds.leftEdge, pt.xOffset), y);
    }
  }
  for (let i = 0; i < curvePoints.length; i++) {
    const pt = curvePoints[i];
    const y = height * (1 - (pt.sOffset + 10) / 40);
    ctx.lineTo(xFor(bounds.rightEdge, pt.xOffset), y);
  }
  ctx.closePath();
  ctx.fill();

  // Draw Solid White Edges
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = Math.max(2, dpr * 1.5);
  ctx.setLineDash([]); // solid

  // Left solid edge
  ctx.beginPath();
  for (let i = 0; i < curvePoints.length; i++) {
    const pt = curvePoints[i];
    const y = height * (1 - (pt.sOffset + 10) / 40);
    if (i === 0) ctx.moveTo(xFor(bounds.leftEdge, pt.xOffset), y);
    else ctx.lineTo(xFor(bounds.leftEdge, pt.xOffset), y);
  }
  ctx.stroke();

  // Right solid edge
  ctx.beginPath();
  for (let i = 0; i < curvePoints.length; i++) {
    const pt = curvePoints[i];
    const y = height * (1 - (pt.sOffset + 10) / 40);
    if (i === 0) ctx.moveTo(xFor(bounds.rightEdge, pt.xOffset), y);
    else ctx.lineTo(xFor(bounds.rightEdge, pt.xOffset), y);
  }
  ctx.stroke();

  // Draw Double Solid Yellow Center Lines
  ctx.strokeStyle = "rgba(255, 215, 96, 0.9)"; // yellow
  ctx.lineWidth = Math.max(1, dpr);
  ctx.setLineDash([]); // solid

  for (const offset of [-0.16, 0.16]) {
    ctx.beginPath();
    for (let i = 0; i < curvePoints.length; i++) {
      const pt = curvePoints[i];
      const y = height * (1 - (pt.sOffset + 10) / 40);
      if (i === 0) ctx.moveTo(xFor(offset, pt.xOffset), y);
      else ctx.lineTo(xFor(offset, pt.xOffset), y);
    }
    ctx.stroke();
  }

  // Draw Dashed White Lane Dividers
  ctx.strokeStyle = "rgba(255, 255, 255, 0.82)"; // white
  ctx.lineWidth = Math.max(1, dpr);
  ctx.setLineDash([6 * dpr, 10 * dpr]); // dashed

  for (let i = 0; i < bounds.laneCount - 1; i++) {
    const offsetL = -config.laneWidth * (i + 1);
    const offsetR = config.laneWidth * (i + 1);

    // Left side divider
    ctx.beginPath();
    for (let j = 0; j < curvePoints.length; j++) {
      const pt = curvePoints[j];
      const y = height * (1 - (pt.sOffset + 10) / 40);
      if (j === 0) ctx.moveTo(xFor(offsetL, pt.xOffset), y);
      else ctx.lineTo(xFor(offsetL, pt.xOffset), y);
    }
    ctx.stroke();

    // Right side divider
    ctx.beginPath();
    for (let j = 0; j < curvePoints.length; j++) {
      const pt = curvePoints[j];
      const y = height * (1 - (pt.sOffset + 10) / 40);
      if (j === 0) ctx.moveTo(xFor(offsetR, pt.xOffset), y);
      else ctx.lineTo(xFor(offsetR, pt.xOffset), y);
    }
    ctx.stroke();
  }

  // Draw Car
  ctx.setLineDash([]); // Reset to solid
  const carX = xFor(snapshot.vehicle.lateralM, 0);
  const carY = height * (1 - (0 + 10) / 40); // Exactly at sOffset = 0

  ctx.save();
  ctx.translate(carX, carY);
  ctx.rotate(snapshot.vehicle.headingErrorRad); // Rotate by heading error relative to road centerline tangent
  ctx.fillStyle = "#ff6172";
  ctx.beginPath();
  ctx.roundRect(-9 * dpr, -15 * dpr, 18 * dpr, 30 * dpr, 4 * dpr);
  ctx.fill();
  ctx.restore();
}
