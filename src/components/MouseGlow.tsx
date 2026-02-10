import React, { useEffect, useState } from 'react';

export const MouseGlow: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        className="absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          background: 'radial-gradient(circle, rgba(200, 200, 220, 0.06) 0%, rgba(200, 200, 220, 0.05) 10%, rgba(200, 200, 220, 0.04) 20%, rgba(200, 200, 220, 0.035) 30%, rgba(200, 200, 220, 0.025) 40%, rgba(200, 200, 220, 0.018) 50%, rgba(200, 200, 220, 0.012) 60%, rgba(200, 200, 220, 0.008) 70%, rgba(200, 200, 220, 0.004) 80%, transparent 100%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
};
