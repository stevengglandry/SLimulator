import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

export type PostProcessingPipeline = {
  readonly bloom: UnrealBloomPass;
  readonly fxaa: ShaderPass;
  render(): void;
  resize(width: number, height: number, pixelRatio: number): void;
};

export function createPostProcessing(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera): PostProcessingPipeline {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.14, 0.28, 0.75);
  composer.addPass(bloom);
  const fxaa = new ShaderPass(FXAAShader);
  composer.addPass(fxaa);
  composer.addPass(new OutputPass());

  return {
    bloom,
    fxaa,
    render: () => composer.render(),
    resize(width, height, pixelRatio) {
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      fxaa.uniforms.resolution.value.set(
        1 / Math.max(1, width * pixelRatio),
        1 / Math.max(1, height * pixelRatio)
      );
    }
  };
}
