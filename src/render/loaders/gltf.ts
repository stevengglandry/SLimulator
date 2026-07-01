import { LoadingManager } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function createGltfLoader(manager?: LoadingManager): GLTFLoader {
  const draco = new DRACOLoader(manager);
  draco.setDecoderPath("/draco/");
  const loader = new GLTFLoader(manager);
  loader.setDRACOLoader(draco);
  return loader;
}
