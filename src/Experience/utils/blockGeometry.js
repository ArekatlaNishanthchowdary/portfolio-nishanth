import * as THREE from "three";

// Each face: outward normal, then the viewer's right and up on it (right × up = normal, so CCW)
const FACES = [
  [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
  [[0, 0, -1], [-1, 0, 0], [0, 1, 0]],
  [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
  [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
  [[0, 1, 0], [1, 0, 0], [0, 0, -1]],
  [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
];

// Boxes of blocks textured from a baked atlas: [[minX, minY, minZ], [maxX, maxY, maxZ], tileName].
// A tile is one block face in the atlas: [u, v, du per block right, dv per block right, du per block up, dv per block up].
// Atlas regions can't wrap, so every face is split into per-block quads that each repeat the tile.
export const blockGeometry = (boxes, tiles) => {
  const pos = [];
  const uv = [];
  for (const [min, max, name] of boxes) {
    const t = tiles[name];
    for (const [n, r, u] of FACES) {
      const ra = r.findIndex(Boolean);
      const ua = u.findIndex(Boolean);
      const o = [0, 1, 2].map((k) => (n[k] > 0 || r[k] < 0 || u[k] < 0 ? max[k] : min[k]));
      const w = max[ra] - min[ra];
      const h = max[ua] - min[ua];
      for (let s = 0; s < w - 1e-3; s++) {
        for (let v = 0; v < h - 1e-3; v++) {
          const s1 = Math.min(s + 1, w);
          const v1 = Math.min(v + 1, h);
          for (const [a, b] of [[s, v], [s1, v], [s1, v1], [s, v], [s1, v1], [s, v1]]) {
            pos.push(...o.map((c, k) => c + r[k] * a + u[k] * b));
            uv.push(t[0] + t[2] * (a - s) + t[4] * (b - v), t[1] + t[3] * (a - s) + t[5] * (b - v));
          }
        }
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  return geometry;
};
