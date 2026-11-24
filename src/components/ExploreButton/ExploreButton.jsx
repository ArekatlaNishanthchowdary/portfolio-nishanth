import "./ExploreButton.scss";

import Button from "../Button/Button";
import { playSound } from "../../utils/audioSystem";
import { useModalStore } from "../../Experience/stores/modalStore";
import {
  useExploreStore,
  lockPointer,
  unlockPointer,
} from "../../Experience/stores/exploreStore";

const CONTROLS = [
  ["WASD / Arrows", "Walk"],
  ["Double-tap W", "Sprint"],
  ["Shift", "Sneak"],
  ["Mouse", "Look around"],
  ["Space", "Jump / swim up"],
  ["Click", "Open a project or photo"],
  ["Esc", "Pause"],
];

const ExploreButton = () => {
  const { isExploring, isLocked, setIsExploring } = useExploreStore();
  const isModalOpen = useModalStore((s) => s.isModalOpen);

  const exit = () => {
    setIsExploring(false);
    unlockPointer();
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.currentTarget.blur(); // Space must not re-click this while walking
          playSound("buttonClick");
          if (isExploring) return exit();
          setIsExploring(true);
          lockPointer();
        }}
        className={`explore-toggle-button ${isExploring ? "active" : ""}`}
        aria-label={isExploring ? "Exit explore mode" : "Explore in first person"}
        title={isExploring ? "Exit explore mode" : "Explore in first person"}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="0" width="2" height="4" />
          <rect x="6" y="10" width="2" height="4" />
          <rect x="0" y="6" width="4" height="2" />
          <rect x="10" y="6" width="4" height="2" />
          <rect x="6" y="6" width="2" height="2" />
        </svg>
      </button>

      {isExploring && isLocked && <div className="explore-crosshair" />}

      {isExploring && !isLocked && !isModalOpen && (
        <div className="explore-menu">
          <div className="explore-menu-panel">
            <h2 className="explore-menu-title">Explore Mode</h2>
            <dl className="explore-menu-controls">
              {CONTROLS.map(([key, action]) => (
                <div key={key} className="explore-menu-row">
                  <dt>{key}</dt>
                  <dd>{action}</dd>
                </div>
              ))}
            </dl>
            <div className="explore-menu-actions">
              <Button onClick={lockPointer}>Back to Game</Button>
              <Button onClick={exit}>Exit Explore</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExploreButton;
