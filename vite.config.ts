import { defineConfig } from "vite";

export default defineConfig({
  base: "/SLimulator/",
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, "/");
          if (
            normalized.includes("/node_modules/three/examples/jsm/postprocessing/") ||
            normalized.includes("/node_modules/three/examples/jsm/shaders/")
          ) return "three-postprocessing";
          if (normalized.includes("/node_modules/three/examples/")) return "three-extras";
          if (normalized.includes("/node_modules/three/")) return "three-core";
        }
      }
    }
  }
});
