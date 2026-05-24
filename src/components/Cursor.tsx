import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const trailConfig = { damping: 40, stiffness: 200, mass: 1 };

  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  const smoothTrailX = useSpring(trailX, trailConfig);
  const smoothTrailY = useSpring(trailY, trailConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };
    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        !!(target.closest('a') || target.closest('button') || target.closest('[data-hover]'))
      );
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousemove', checkHover);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousemove', checkHover);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [cursorX, cursorY, trailX, trailY]);

  return (
    <>
      {/* Trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-white/20"
        style={{
          x: smoothTrailX,
          y: smoothTrailY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          transition: 'width 0.2s, height 0.2s',
          background: isHovering ? 'rgba(139,92,246,0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.2)',
        }}
      />
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-white"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: isClicking ? 6 : 8,
          height: isClicking ? 6 : 8,
          transition: 'width 0.1s, height 0.1s',
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
