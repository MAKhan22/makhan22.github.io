import React from 'react';

export const EdgeVignette: React.FC = () => {
  return (
    <div 
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 9999,
        background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.03) 0%, transparent 40%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.4) 100%)',
      }}
    />
  );
};
