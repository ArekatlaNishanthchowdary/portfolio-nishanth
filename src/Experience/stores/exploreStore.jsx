import { create } from "zustand";

export const useExploreStore = create((set) => ({
  isExploring: false,
  isLocked: false,
  setIsExploring: (isExploring) => set({ isExploring }),
  setIsLocked: (isLocked) => set({ isLocked }),
}));

// Browsers only grant pointer lock from inside a click handler.
// #root is the R3F event source, so locked mouse events still reach the scene.
export const lockPointer = () => {
  const request = document.getElementById("root").requestPointerLock();
  request?.catch?.(() => {}); // refused (e.g. right after Esc): the pause menu stays up
};

export const unlockPointer = () => {
  if (document.pointerLockElement) document.exitPointerLock();
};
