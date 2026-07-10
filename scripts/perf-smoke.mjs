import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = Number(process.env.SLIMULATOR_PERF_PORT || 5175);
const secondsPerScene = Number(process.env.SLIMULATOR_PERF_SECONDS || 5);
const externalUrl = process.env.SLIMULATOR_PERF_URL;
const url = externalUrl || `http://127.0.0.1:${port}/SLimulator/`;
const scenes = ["unmapped", "l2", "l3"];

let server = null;
let browser = null;

async function main() {
  if (!externalUrl) {
    const npmCmd = process.platform === "win32"
      ? `npm run dev -- --host 127.0.0.1 --port ${port}`
      : "npm";
    const npmArgs = process.platform === "win32"
      ? []
      : ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)];
    server = spawn(npmCmd, npmArgs, {
      stdio: "ignore",
      shell: process.platform === "win32"
    });
  }

  await waitForUrl(url);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.addInitScript(() => localStorage.setItem("slimulator-render-quality", "perf"));
  const consoleMessages = [];
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) consoleMessages.push({ type: message.type(), text: message.text() });
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForFunction(() => Boolean(window.SLimulator?.perfSnapshot), null, { timeout: 15000 });
  await page.evaluate(() => window.SLimulator.renderer.setQualityMode("perf"));
  await page.locator("#world").click();
  await page.keyboard.down("w");

  const results = [];
  for (const scene of scenes) {
    await page.evaluate(({ sceneKey }) => window.SLimulator.requestScene(sceneKey, 700), { sceneKey: scene });
    await page.waitForTimeout(secondsPerScene * 1000);
    results.push({
      scene,
      snapshot: await page.evaluate(() => window.SLimulator.snapshot()),
      perf: await page.evaluate(() => window.SLimulator.perfSnapshot())
    });
  }

  await page.keyboard.up("w");
  const postProcessingLoaded = await page.evaluate(() => performance.getEntriesByType("resource")
    .some((entry) => /postProcessing|EffectComposer|UnrealBloomPass|FXAAShader/.test(entry.name)));
  console.log(JSON.stringify({ url, secondsPerScene, results, postProcessingLoaded, consoleMessages }, null, 2));
}

async function waitForUrl(target) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(target);
      if (response.ok) return;
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${target}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close().catch(() => {});
    await stopServer();
  });

function stopServer() {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    const timer = setTimeout(done, 2000);
    if (process.platform === "win32" && server?.pid) {
      const killer = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
      killer.once("close", () => {
        clearTimeout(timer);
        done();
      });
      return;
    }
    server.once("exit", () => {
      clearTimeout(timer);
      done();
    });
    server.kill();
  });
}
