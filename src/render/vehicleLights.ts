import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  Scene,
  ShaderMaterial,
  Vector3
} from "three";

const TrailShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      float alpha = 1.0 - vUv.y;
      float edgeFade = sin(vUv.x * 3.14159);
      gl_FragColor = vec4(uColor, alpha * edgeFade * 0.82);
    }
  `
};

export class LightTrail {
  readonly mesh: Mesh;
  private readonly positions: Float32Array;
  private readonly history: Vector3[];
  private readonly halfRight = new Vector3();
  private historyCount = 0;

  constructor(scene: Scene, colorHex: number, private readonly maxPoints = 96, private readonly width = 0.22) {
    const geom = new BufferGeometry();
    const vertexCount = this.maxPoints * 2;
    this.positions = new Float32Array(vertexCount * 3);
    this.history = Array.from({ length: this.maxPoints }, () => new Vector3());
    const uvs = new Float32Array(vertexCount * 2);
    const indices: number[] = [];

    for (let i = 0; i < this.maxPoints - 1; i++) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }

    for (let i = 0; i < this.maxPoints; i++) {
      const u = i / (this.maxPoints - 1);
      uvs[i * 4] = 0;
      uvs[i * 4 + 1] = u;
      uvs[i * 4 + 2] = 1;
      uvs[i * 4 + 3] = u;
    }

    geom.setAttribute("position", new BufferAttribute(this.positions, 3).setUsage(DynamicDrawUsage));
    geom.setAttribute("uv", new BufferAttribute(uvs, 2));
    geom.setIndex(indices);

    const mat = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color(colorHex).multiplyScalar(4.4) }
      },
      vertexShader: TrailShader.vertexShader,
      fragmentShader: TrailShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide
    });

    this.mesh = new Mesh(geom, mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 3;
    scene.add(this.mesh);
  }

  update(pos: Vector3, rightAxis: Vector3): void {
    const last = Math.min(this.historyCount, this.maxPoints - 1);
    for (let i = last; i > 0; i--) {
      this.history[i].copy(this.history[i - 1]);
    }
    this.history[0].copy(pos);
    this.historyCount = Math.min(this.historyCount + 1, this.maxPoints);

    this.halfRight.copy(rightAxis).normalize().multiplyScalar(this.width * 0.5);
    for (let i = 0; i < this.maxPoints; i++) {
      const currentPoint = this.history[Math.min(i, this.historyCount - 1)];
      const vIdx = i * 6;
      this.positions[vIdx] = currentPoint.x - this.halfRight.x;
      this.positions[vIdx + 1] = currentPoint.y - this.halfRight.y;
      this.positions[vIdx + 2] = currentPoint.z - this.halfRight.z;

      this.positions[vIdx + 3] = currentPoint.x + this.halfRight.x;
      this.positions[vIdx + 4] = currentPoint.y + this.halfRight.y;
      this.positions[vIdx + 5] = currentPoint.z + this.halfRight.z;
    }

    const position = this.mesh.geometry.getAttribute("position") as BufferAttribute;
    position.needsUpdate = true;
  }

  lastPoint(): Vector3 | null {
    return this.historyCount > 0 ? this.history[0] : null;
  }

  clear(): void {
    this.historyCount = 0;
  }
}

export function createStreetlightConeMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(0xffdf80).multiplyScalar(1.85) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 localPosition = instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * localPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float lengthFade = pow(vUv.y, 2.15);
        float edgeFade = sin(vUv.x * 3.14159);
        gl_FragColor = vec4(uColor, lengthFade * edgeFade * 0.085);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide
  });
}

export function createHeadlightBeamMesh(): Mesh {
  const positions = new Float32Array([
    -2.1, 0.38, -1.55,
    -2.1, 0.38, 1.55,
    -16.5, 0.42, -4.1,
    -16.5, 0.42, 4.1,
    -30, 0.46, -5.8,
    -30, 0.46, 5.8
  ]);
  const uvs = new Float32Array([
    0.34, 0,
    0.66, 0,
    0.16, 0.55,
    0.84, 0.55,
    0, 1,
    1, 1
  ]);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  geometry.setIndex([0, 2, 1, 1, 2, 3, 2, 4, 3, 3, 4, 5]);

  const material = new ShaderMaterial({
    uniforms: {
      uColor: { value: new Color(0xffefbd).multiplyScalar(1.55) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float center = pow(sin(vUv.x * 3.14159), 1.25);
        float falloff = pow(1.0 - vUv.y, 1.3);
        float fadeIn = smoothstep(0.0, 0.18, vUv.y);
        gl_FragColor = vec4(uColor, center * falloff * fadeIn * 0.062);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide
  });

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 2;
  return mesh;
}
