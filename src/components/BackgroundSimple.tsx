import React from 'react';
import './BackgroundSimple.css';

export const BackgroundSimple: React.FC = () => {
  return (
    <div className="circuit-background">
      {/* Subtle grid */}
      <div className="circuit-grid" />
      
      {/* Center processor chip */}
      <div className="circuit-hub">
        <div className="hub-inner" />
        <div className="hub-corner hub-corner-tl" />
        <div className="hub-corner hub-corner-tr" />
        <div className="hub-corner hub-corner-bl" />
        <div className="hub-corner hub-corner-br" />
      </div>
      
      {/* Straight circuit traces emanating from center chip */}
      <svg className="circuit-paths" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Main cardinal directions - straight lines */}
        
        {/* TOP */}
        <line x1="50" y1="50" x2="50" y2="5" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="0.4" className="trace" />
        <line x1="47" y1="50" x2="47" y2="8" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        <line x1="53" y1="50" x2="53" y2="8" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        
        {/* BOTTOM */}
        <line x1="50" y1="50" x2="50" y2="95" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="0.4" className="trace" />
        <line x1="47" y1="50" x2="47" y2="92" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        <line x1="53" y1="50" x2="53" y2="92" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        
        {/* LEFT */}
        <line x1="50" y1="50" x2="5" y2="50" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="0.4" className="trace" />
        <line x1="50" y1="47" x2="8" y2="47" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        <line x1="50" y1="53" x2="8" y2="53" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        
        {/* RIGHT */}
        <line x1="50" y1="50" x2="95" y2="50" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="0.4" className="trace" />
        <line x1="50" y1="47" x2="92" y2="47" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        <line x1="50" y1="53" x2="92" y2="53" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        
        {/* DIAGONALS - straight lines */}
        <line x1="50" y1="50" x2="15" y2="15" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        <line x1="50" y1="50" x2="85" y2="15" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        <line x1="50" y1="50" x2="15" y2="85" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        <line x1="50" y1="50" x2="85" y2="85" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="0.3" className="trace" />
        
        {/* L-shaped traces (realistic PCB routing) */}
        {/* Top-Left L-shapes */}
        <polyline points="50,50 50,30 20,30" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        <polyline points="50,50 35,50 35,20" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        
        {/* Top-Right L-shapes */}
        <polyline points="50,50 50,30 80,30" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        <polyline points="50,50 65,50 65,20" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        
        {/* Bottom-Left L-shapes */}
        <polyline points="50,50 50,70 20,70" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        <polyline points="50,50 35,50 35,80" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        
        {/* Bottom-Right L-shapes */}
        <polyline points="50,50 50,70 80,70" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        <polyline points="50,50 65,50 65,80" stroke="rgba(0, 229, 255, 0.22)" strokeWidth="0.25" fill="none" className="trace" />
        
        {/* Connection pads/nodes at endpoints */}
        <circle cx="50" cy="5" r="0.6" fill="#00e5ff" opacity="0.6" className="node-pulse" />
        <circle cx="50" cy="95" r="0.6" fill="#00e5ff" opacity="0.6" className="node-pulse" />
        <circle cx="5" cy="50" r="0.6" fill="#00e5ff" opacity="0.6" className="node-pulse" />
        <circle cx="95" cy="50" r="0.6" fill="#00e5ff" opacity="0.6" className="node-pulse" />
        
        <circle cx="15" cy="15" r="0.5" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="85" cy="15" r="0.5" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="15" cy="85" r="0.5" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="85" cy="85" r="0.5" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        
        <circle cx="20" cy="30" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="80" cy="30" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="20" cy="70" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="80" cy="70" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        
        <circle cx="35" cy="20" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="65" cy="20" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="35" cy="80" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
        <circle cx="65" cy="80" r="0.4" fill="#00e5ff" opacity="0.5" className="node-pulse" />
      </svg>
      
      {/* Animated light pulses traveling on straight paths */}
      <svg className="circuit-pulses" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Pulse 1 - Top straight */}
        <circle r="1" fill="#00e5ff" opacity="0.9" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 50 50 L 50 5" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
        </circle>
        
        {/* Pulse 2 - Bottom straight */}
        <circle r="1" fill="#00e5ff" opacity="0.9" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="0.5s" path="M 50 50 L 50 95" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        
        {/* Pulse 3 - Left straight */}
        <circle r="1" fill="#00e5ff" opacity="0.9" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M 50 50 L 5 50" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>
        
        {/* Pulse 4 - Right straight */}
        <circle r="1" fill="#00e5ff" opacity="0.9" filter="url(#glow)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s" path="M 50 50 L 95 50" />
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" begin="1.5s" />
        </circle>
        
        {/* Pulse 5 - Diagonal Top-Left */}
        <circle r="0.8" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4s" repeatCount="indefinite" begin="2s" path="M 50 50 L 15 15" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin="2s" />
        </circle>
        
        {/* Pulse 6 - Diagonal Top-Right */}
        <circle r="0.8" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4s" repeatCount="indefinite" begin="2.5s" path="M 50 50 L 85 15" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin="2.5s" />
        </circle>
        
        {/* Pulse 7 - Diagonal Bottom-Left */}
        <circle r="0.8" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4s" repeatCount="indefinite" begin="3s" path="M 50 50 L 15 85" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin="3s" />
        </circle>
        
        {/* Pulse 8 - Diagonal Bottom-Right */}
        <circle r="0.8" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4s" repeatCount="indefinite" begin="3.5s" path="M 50 50 L 85 85" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin="3.5s" />
        </circle>
        
        {/* Pulse 9 - L-shaped path (Top-Left) */}
        <circle r="0.7" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4.5s" repeatCount="indefinite" begin="0.8s" path="M 50 50 L 50 30 L 20 30" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
        </circle>
        
        {/* Pulse 10 - L-shaped path (Bottom-Right) */}
        <circle r="0.7" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4.5s" repeatCount="indefinite" begin="1.8s" path="M 50 50 L 50 70 L 80 70" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4.5s" repeatCount="indefinite" begin="1.8s" />
        </circle>
        
        {/* Pulse 11 - L-shaped path (Left-Top) */}
        <circle r="0.7" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4.5s" repeatCount="indefinite" begin="2.8s" path="M 50 50 L 35 50 L 35 20" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4.5s" repeatCount="indefinite" begin="2.8s" />
        </circle>
        
        {/* Pulse 12 - L-shaped path (Right-Bottom) */}
        <circle r="0.7" fill="#00e5ff" opacity="0.8" filter="url(#glow)">
          <animateMotion dur="4.5s" repeatCount="indefinite" begin="3.8s" path="M 50 50 L 65 50 L 65 80" />
          <animate attributeName="opacity" values="0;1;1;0" dur="4.5s" repeatCount="indefinite" begin="3.8s" />
        </circle>
      </svg>
    </div>
  );
};
