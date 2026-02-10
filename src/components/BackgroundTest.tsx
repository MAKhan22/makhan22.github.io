import React from 'react';

export const BackgroundTest: React.FC = () => {
  return (
    <>
      {/* SUPER OBVIOUS TEST - Bright green so you can't miss it */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          backgroundColor: '#0F172A', // Dark blue base
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(59, 130, 246, 0.5) 0px, transparent 2px, transparent 80px, rgba(59, 130, 246, 0.5) 82px),
            repeating-linear-gradient(90deg, rgba(59, 130, 246, 0.5) 0px, transparent 2px, transparent 80px, rgba(59, 130, 246, 0.5) 82px)
          `,
          pointerEvents: 'none',
        }}
      />
      
      {/* Floating badge that should be VERY visible */}
      <div 
        style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
          zIndex: 9999,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}
      >
        🎨 BACKGROUND TEST ACTIVE
      </div>
    </>
  );
};
