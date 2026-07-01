import {
  BufferGeometry,
  DodecahedronGeometry,
  Vector3
} from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export function createClumpyFoliageGeometry(): BufferGeometry {
  const geometries: BufferGeometry[] = [];
  const center = new DodecahedronGeometry(1.2, 1);
  geometries.push(center);

  const offsets = [
    new Vector3(0.6, 0.4, 0.5),
    new Vector3(-0.6, -0.2, 0.4),
    new Vector3(0.4, -0.3, -0.6),
    new Vector3(-0.5, 0.5, -0.4),
    new Vector3(0.0, 0.8, 0.1),
    new Vector3(0.2, -0.5, 0.5)
  ];

  for (let i = 0; i < offsets.length; i++) {
    const radius = 0.65 + Math.random() * 0.45;
    const geom = new DodecahedronGeometry(radius, 1);
    geom.translate(offsets[i].x, offsets[i].y, offsets[i].z);
    geometries.push(geom);
  }

  const merged = BufferGeometryUtils.mergeGeometries(geometries);
  merged.computeVertexNormals();
  return merged;
}
