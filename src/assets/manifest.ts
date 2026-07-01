export interface AssetCredit {
  id: string;
  name: string;
  source: string;
  license: "CC0" | "CC-BY" | "MIT" | "Custom";
  runtimeStatus: "procedural" | "candidate" | "shipped";
  notes: string;
}

export const assetManifest: AssetCredit[] = [
  {
    id: "procedural-road-kit",
    name: "SLimulator procedural low-poly road kit",
    source: "src/render/WorldRenderer.ts",
    license: "Custom",
    runtimeStatus: "procedural",
    notes: "Runtime-generated road ribbons, walls, signs, crosswalks, trees, city blocks, and traffic lights."
  },
  {
    id: "kenney-city-kit-roads",
    name: "Kenney City Kit Roads",
    source: "https://kenney.nl/assets/city-kit-roads",
    license: "CC0",
    runtimeStatus: "candidate",
    notes: "Preferred first GLB source for future authored road pieces."
  },
  {
    id: "quaternius-cars",
    name: "Quaternius Cars Pack",
    source: "https://quaternius.com/packs/cars.html",
    license: "CC0",
    runtimeStatus: "candidate",
    notes: "Preferred first GLB source for alternate vehicle bodies."
  },
  {
    id: "quaternius-modular-streets",
    name: "Quaternius Modular Streets",
    source: "https://quaternius.com/packs/modularstreets.html",
    license: "CC0",
    runtimeStatus: "candidate",
    notes: "Preferred first GLB source for props once authored-asset import begins."
  }
];
