import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useExploreStore, unlockPointer } from "./stores/exploreStore";
import { useModalStore } from "./stores/modalStore";

// World units are Minecraft blocks (door is 2 tall, house floor at y = 66.85); speeds are Minecraft's.
const EYE_HEIGHT = 1.62;
const SNEAK_EYE = 1.27;
const RADIUS = 0.29; // player is 0.6 wide; a hair less so corner rays never start inside a wall
const BODY = [0.65, 1.0, 1.75]; // wall probe heights: just above step height, waist, head (1.8 tall)
const FOOT = [[0, 0], [RADIUS, RADIUS], [RADIUS, -RADIUS], [-RADIUS, RADIUS], [-RADIUS, -RADIUS]];
const STEP_HEIGHT = 0.6;
const WALK_SPEED = 4.3;
const SPRINT_SPEED = 5.6;
const SNEAK_SPEED = 1.3;
const SWIM_FACTOR = 0.45;
const JUMP_SPEED = 8.4; // ~1.25 block jump
const BANK_BOOST = 9.5; // swimming into a bank lifts you out (~1.6 blocks), like Minecraft
const GRAVITY = 28;
const LOOK_SPEED = 0.002;
const FOV = 70;
const SPRINT_FOV = 80;
const DOUBLE_TAP_MS = 300;
const REACH = 4.5;
const SPAWN = new THREE.Vector3(-2.6, 66.85, 4.8); // porch in front of the door
const FALL_LIMIT = 55; // lowest terrain is ~59.85
const GRID = new THREE.Vector3(0.97, 0.85, 0.81); // block boundaries sit at n + these offsets

const KEYS = {
  KeyW: "f", ArrowUp: "f",
  KeyS: "b", ArrowDown: "b",
  KeyA: "l", ArrowLeft: "l",
  KeyD: "r", ArrowRight: "r",
  Space: "jump",
  ShiftLeft: "sneak", ShiftRight: "sneak",
};

const UP = new THREE.Vector3(0, 1, 0);
const DOWN = new THREE.Vector3(0, -1, 0);
const CENTER = new THREE.Vector2(0, 0);
const UNDERWATER = new THREE.Fog("#123a7a", 0.3, 9);
const OUTLINE = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.004, 1.004, 1.004));
const ray = new THREE.Raycaster(); // meshes carry a BVH (drei <Bvh> in Scene), so rays are cheap
const origin = new THREE.Vector3();
const dir = new THREE.Vector3();
const move = new THREE.Vector3();
const normal = new THREE.Vector3();
const euler = new THREE.Euler();

const worldNormal = (hit) => normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);

// Blocks have axis-aligned faces; grass tufts and flowers are diagonal cross quads,
// and grass shares meshes with the terrain, so walk through anything diagonal.
const isBlockFace = (hit) => {
  const n = worldNormal(hit);
  return Math.max(Math.abs(n.x), Math.abs(n.y), Math.abs(n.z)) > 0.9;
};

const castRay = (objects, from, direction, far) => {
  ray.set(from, direction);
  ray.far = far;
  return ray.intersectObjects(objects, false).find(isBlockFace);
};

const ExploreControls = ({ cameraGroup, camera }) => {
  const feet = useRef(new THREE.Vector3());
  const look = useRef({ yaw: 0, pitch: 0 });
  const velocityY = useRef(0);
  const grounded = useRef(false);
  const keys = useRef(new Set());
  const solids = useRef([]);
  const waters = useRef([]);
  const wasExploring = useRef(false);
  const sprinting = useRef(false);
  const lastForward = useRef(0);
  const eye = useRef(EYE_HEIGHT);
  const bob = useRef({ phase: 0, amount: 0 });
  const underwater = useRef(null); // the scene background while the camera is underwater
  const outline = useRef();

  // Highest floor under any part of the player's footprint (Minecraft lets you stand on an edge)
  const floorAt = (x, y, z) => {
    let best = null;
    for (const [ox, oz] of FOOT) {
      origin.set(x + ox, y + STEP_HEIGHT, z + oz);
      const hit = castRay(solids.current, origin, DOWN, 100);
      if (hit && (best === null || hit.point.y > best)) best = hit.point.y;
    }
    return best;
  };

  // How far the player's box can move along one axis: rays from both front corners and the middle
  const sweep = (p, axis, d) => {
    const side = axis === "x" ? "z" : "x";
    dir.set(0, 0, 0);
    dir[axis] = Math.sign(d);
    let free = Math.abs(d);
    for (const h of BODY) {
      for (const off of [-RADIUS, 0, RADIUS]) {
        origin.set(p.x, p.y + h, p.z);
        origin[side] += off;
        const wall = castRay(solids.current, origin, dir, RADIUS + free);
        if (wall) free = Math.max(0, wall.distance - RADIUS);
      }
    }
    return Math.sign(d) * free;
  };

  const waterLevel = (p) => {
    origin.set(p.x, p.y + 3, p.z);
    const hit = castRay(waters.current, origin, DOWN, 4);
    return hit ? hit.point.y : -Infinity;
  };

  const setUnderwater = (scene, under) => {
    if (under === (underwater.current !== null)) return;
    if (under) {
      underwater.current = scene.background;
      scene.background = UNDERWATER.color;
    } else {
      scene.background = underwater.current;
      underwater.current = null;
    }
    scene.fog = under ? UNDERWATER : null;
  };

  // Entering: collect collidable meshes, drop the player under the camera (or on the porch)
  const spawn = (scene) => {
    solids.current = [];
    waters.current = [];
    scene.traverse((o) => {
      if (!o.isMesh) return;
      if (o.userData.water) return waters.current.push(o);
      for (let q = o; q; q = q.parent) if (q.userData.noCollide) return;
      solids.current.push(o);
    });

    const at = camera.current.getWorldPosition(new THREE.Vector3());
    const floor = castRay(solids.current, at, DOWN, 3);
    feet.current.copy(floor ? floor.point : SPAWN);
    euler.setFromQuaternion(cameraGroup.current.quaternion, "YXZ");
    look.current = { yaw: euler.y, pitch: euler.x };
    velocityY.current = 0;
    sprinting.current = false;
    eye.current = EYE_HEIGHT;
    bob.current.amount = 0;
  };

  // Leaving: hand the camera back to the scroll path as it was
  const leave = (scene) => {
    setUnderwater(scene, false);
    camera.current.fov = FOV;
    camera.current.updateProjectionMatrix();
    outline.current.visible = false;
  };

  useEffect(() => {
    const onLockChange = () => {
      const locked = !!document.pointerLockElement;
      useExploreStore.getState().setIsLocked(locked);
      if (!locked) keys.current.clear();
    };
    const onMouseMove = (e) => {
      if (!document.pointerLockElement) return;
      const l = look.current;
      l.yaw -= e.movementX * LOOK_SPEED;
      l.pitch = THREE.MathUtils.clamp(l.pitch - e.movementY * LOOK_SPEED, -1.55, 1.55);
    };
    const onKey = (e) => {
      const key = KEYS[e.code];
      if (!key || !document.pointerLockElement) return;
      e.preventDefault();
      if (e.type === "keyup") return keys.current.delete(key);
      // Double-tap W to sprint (Ctrl+W would close the tab)
      if (key === "f" && !e.repeat) {
        const now = performance.now();
        if (now - lastForward.current < DOUBLE_TAP_MS) sprinting.current = true;
        lastForward.current = now;
      }
      keys.current.add(key);
    };
    const onBlur = () => keys.current.clear();
    // Opening a project/about modal hands the mouse back; leaving explore mode does too
    const unsubModal = useModalStore.subscribe((s) => s.isModalOpen && unlockPointer());

    document.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("blur", onBlur);
      unsubModal();
    };
  }, []);

  useFrame((state, delta) => {
    const exploring = useExploreStore.getState().isExploring;
    if (exploring !== wasExploring.current) (exploring ? spawn : leave)(state.scene);
    wasExploring.current = exploring;
    if (!exploring) return;
    const dt = Math.min(delta, 0.05); // no tunnelling through walls after a frame hitch
    const k = keys.current;
    const p = feet.current;

    const water = waterLevel(p);
    const swimming = water > p.y + 0.2;
    const sneaking = k.has("sneak") && !swimming;
    if (!k.has("f") || sneaking) sprinting.current = false;
    const speed =
      (sneaking ? SNEAK_SPEED : sprinting.current ? SPRINT_SPEED : WALK_SPEED) *
      (swimming ? SWIM_FACTOR : 1);

    // Walk relative to where the player faces; x and z resolved separately so walls slide
    move.set(
      (k.has("r") ? 1 : 0) - (k.has("l") ? 1 : 0),
      0,
      (k.has("b") ? 1 : 0) - (k.has("f") ? 1 : 0)
    );
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * dt).applyAxisAngle(UP, look.current.yaw);
    }
    const startX = p.x;
    const startZ = p.z;
    let blocked = false;
    for (const axis of ["x", "z"]) {
      if (!move[axis]) continue;
      const d = sweep(p, axis, move[axis]);
      if (Math.abs(d) < Math.abs(move[axis]) - 1e-6) blocked = true;
      const before = p[axis];
      p[axis] += d;
      // World border (nothing underneath) and sneaking off a ledge: take the step back
      const floor = floorAt(p.x, p.y, p.z);
      if (floor === null || (sneaking && grounded.current && floor < p.y - STEP_HEIGHT)) p[axis] = before;
    }

    // Gravity and jumping; water slows the fall, Space swims up
    if (swimming) {
      if (k.has("jump")) {
        velocityY.current = blocked ? BANK_BOOST : Math.min(velocityY.current + 18 * dt, 2.5);
      } else {
        velocityY.current = Math.max(velocityY.current - 6 * dt, -1.5);
      }
    } else {
      if (k.has("jump") && grounded.current) velocityY.current = JUMP_SPEED;
      velocityY.current -= GRAVITY * dt;
    }
    const nextY = p.y + velocityY.current * dt;
    const floor = floorAt(p.x, p.y, p.z);
    if (floor !== null && velocityY.current <= 0 && nextY <= floor) {
      p.y = floor; // also steps up onto slabs and stairs
      velocityY.current = 0;
      grounded.current = true;
    } else {
      origin.set(p.x, p.y + EYE_HEIGHT, p.z);
      if (velocityY.current > 0 && castRay(solids.current, origin, UP, 0.2 + velocityY.current * dt)) {
        velocityY.current = 0; // bonk
      }
      p.y += velocityY.current * dt;
      grounded.current = false;
    }
    if (p.y < FALL_LIMIT) {
      p.copy(SPAWN);
      velocityY.current = 0;
    }

    // Camera: sneak crouch, view bob while walking, sprint FOV kick
    eye.current += ((sneaking ? SNEAK_EYE : EYE_HEIGHT) - eye.current) * Math.min(1, dt * 12);
    const walked = Math.hypot(p.x - startX, p.z - startZ);
    const b = bob.current;
    b.phase += walked * 1.9;
    b.amount += ((grounded.current && walked > 0 ? 1 : 0) - b.amount) * Math.min(1, dt * 8);
    cameraGroup.current.position.set(p.x, p.y + eye.current, p.z);
    cameraGroup.current.quaternion.setFromEuler(euler.set(look.current.pitch, look.current.yaw, 0, "YXZ"));
    camera.current.position.set(
      Math.sin(b.phase) * 0.03 * b.amount,
      -Math.abs(Math.cos(b.phase)) * 0.05 * b.amount,
      0
    );
    const cam = camera.current;
    const fov = sprinting.current && walked > 0 ? SPRINT_FOV : FOV;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov += (fov - cam.fov) * Math.min(1, dt * 10);
      cam.updateProjectionMatrix();
    }
    setUnderwater(state.scene, water > p.y + eye.current);

    // Minecraft's selection box around the block under the crosshair
    let target = null;
    if (document.pointerLockElement) {
      cameraGroup.current.updateMatrixWorld();
      ray.setFromCamera(CENTER, cam);
      ray.far = REACH;
      target = ray.intersectObjects(solids.current, false).find(isBlockFace);
    }
    outline.current.visible = !!target;
    if (target) {
      outline.current.position
        .copy(target.point)
        .addScaledVector(worldNormal(target), -0.01)
        .sub(GRID)
        .floor()
        .add(GRID)
        .addScalar(0.5);
    }

    // Re-aim the crosshair hover while walking without moving the mouse
    if (document.pointerLockElement) state.events.update?.();
  });

  return (
    <lineSegments ref={outline} geometry={OUTLINE} visible={false} raycast={() => null}>
      <lineBasicMaterial color="black" transparent opacity={0.5} />
    </lineSegments>
  );
};

export default ExploreControls;
