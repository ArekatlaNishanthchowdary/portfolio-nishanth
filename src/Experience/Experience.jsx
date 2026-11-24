import { React, useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { Canvas, events } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Scene from "./Scene";
import ExploreControls from "./ExploreControls";
import { useModalStore } from "./stores/modalStore";
import { useExploreStore } from "./stores/exploreStore";
import normalizeWheel from "normalize-wheel";

const REACH = 4.5; // blocks, like Minecraft

// Pointer locked: aim from the crosshair (screen centre).
// Exploring but unlocked (pause menu / modal): clicks must not reach the 3D frames behind it.
const exploreAwareEvents = (store) => {
  const base = events(store);
  return {
    ...base,
    compute(event, state) {
      if (!document.pointerLockElement) return base.compute(event, state);
      state.pointer.set(0, 0);
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },
    filter: (hits, state) => {
      if (!useExploreStore.getState().isExploring) return hits;
      if (!document.pointerLockElement) return [];
      // R3F only raycasts clickable meshes, so walls don't hide them: stop at the nearest surface
      const nearest = state.raycaster.intersectObject(state.scene, true)[0];
      const limit = Math.min(REACH, nearest ? nearest.distance + 0.01 : REACH);
      return hits.filter((hit) => hit.distance <= limit);
    },
  };
};

const Experience = () => {
  const cameraGroup = useRef();
  const camera = useRef();
  const [scrollProgress, setscrollProgress] = useState(0);
  const targetScrollProgress = useRef(0);
  const scrollSpeed = 0.005;
  const lerpFactor = 0.1;
  const isSwiping = useRef(false);
  const mouseOffset = useRef(new THREE.Vector3());
  const { isModalOpen } = useModalStore();
  const isExploring = useExploreStore((s) => s.isExploring);
  const lastTouchY = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isModalOpen || isExploring) return;
      const normalized = normalizeWheel(e);

      targetScrollProgress.current +=
        Math.sign(normalized.pixelY) *
        scrollSpeed *
        Math.min(Math.abs(normalized.pixelY) / 100, 1);
    };

    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

      const sensitivityX = 0.25;
      const sensitivityY = 0.25;

      mouseOffset.current.x = mouseX * sensitivityX;
      mouseOffset.current.y = mouseY * sensitivityY;
    };

    const handleTouchStart = (e) => {
      if (isModalOpen || isExploring) return;
      isSwiping.current = true;
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping.current) return;

      if (lastTouchY.current !== null) {
        const deltaY = e.touches[0].clientY - lastTouchY.current;
        const touchMultiplier = 0.3;
        targetScrollProgress.current +=
          Math.sign(deltaY) * scrollSpeed * touchMultiplier;
      }
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      isSwiping.current = false;
      lastTouchY.current = null;
    };

    const handleMouseDown = (e) => {
      if (isModalOpen || isExploring || e.pointerType === "touch") return;
      isSwiping.current = true;
    };

    const handleMouseDrag = (e) => {
      if (!isSwiping.current || e.pointerType === "touch") return;
      const mouseMultiplier = 0.2;
      targetScrollProgress.current +=
        Math.sign(e.movementY) * scrollSpeed * mouseMultiplier;
    };

    const handleMouseUp = () => {
      isSwiping.current = false;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseDrag);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isModalOpen, isExploring]);

  return (
    <>
      <Canvas
        flat={true}
        eventSource={document.getElementById("root")}
        events={exploreAwareEvents}
      >
        <color attach="background" args={["#2c2727"]} />
        <Scene
          cameraGroup={cameraGroup}
          camera={camera}
          scrollProgress={scrollProgress}
          setscrollProgress={setscrollProgress}
          targetScrollProgress={targetScrollProgress}
          lerpFactor={lerpFactor}
          mouseOffset={mouseOffset}
        />
        <ExploreControls cameraGroup={cameraGroup} camera={camera} />
        <group ref={cameraGroup}>
          <PerspectiveCamera
            ref={camera}
            makeDefault
            fov={70}
            position={[0, 0, 0]} // Reset to center of group
          />
        </group>
      </Canvas>
    </>
  );
};

export default Experience;
