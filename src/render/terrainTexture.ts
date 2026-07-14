import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";
import { hash01 } from "../shared/math";

let sharedTerrainTexture: CanvasTexture | null = null;

export function getTerrainTexture(): CanvasTexture {
  if (sharedTerrainTexture) return sharedTerrainTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create terrain texture");
  const image = context.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      const grain = hash01(x * 91.7 + y * 41.3) * 26;
      const value = 198 + grain;
      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = value * 0.96;
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  sharedTerrainTexture = new CanvasTexture(canvas);
  sharedTerrainTexture.wrapS = RepeatWrapping;
  sharedTerrainTexture.wrapT = RepeatWrapping;
  sharedTerrainTexture.colorSpace = SRGBColorSpace;
  sharedTerrainTexture.anisotropy = 4;
  return sharedTerrainTexture;
}
