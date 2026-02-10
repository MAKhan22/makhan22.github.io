import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export const useScrollFade = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1]);
  
  return { ref, opacity, scale };
};
