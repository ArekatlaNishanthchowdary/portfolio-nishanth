import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function TextReveal({ children, className = '', delay = 0, once = true }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10% 0px' });

  const words = children.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function CharReveal({ children, className = '', delay = 0 }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const chars = children.split('');

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {chars.map((char, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={isInView ? { y: 0 } : { y: '110%' }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.025,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
