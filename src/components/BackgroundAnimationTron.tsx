import React, { useEffect, useRef } from 'react';

interface GridNode {
  x: number;
  y: number;
  connections: { x: number; y: number }[];
  pulsePhase: number;
}

export const BackgroundAnimationTron: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GridNode[]>([]);
  const animationFrameId = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize grid nodes
    const initializeGrid = () => {
      const cols = Math.floor(canvas.width / 80); // Denser grid (was 100)
      const rows = Math.floor(canvas.height / 80); // Denser grid (was 100)
      nodesRef.current = [];

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * 80 + 40; // Match new grid size
          const y = j * 80 + 40; // Match new grid size
          const connections: { x: number; y: number }[] = [];

          // Connect to adjacent nodes (right and down)
          if (i < cols - 1) {
            connections.push({ x: (i + 1) * 80 + 40, y });
          }
          if (j < rows - 1) {
            connections.push({ x, y: (j + 1) * 80 + 40 });
          }

          nodesRef.current.push({
            x,
            y,
            connections,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeGrid();
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Get theme-aware colors
    const getColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        return {
          line: 'rgba(59, 130, 246, 0.25)', // Blue lines - MORE VISIBLE
          node: 'rgba(96, 165, 250, 0.5)', // Brighter blue nodes - MORE VISIBLE
          pulse: 'rgba(96, 165, 250, 0.8)', // Pulse effect - MORE VISIBLE
          glow: 'rgba(59, 130, 246, 1)', // Glow color - FULL BRIGHTNESS
        };
      } else {
        return {
          line: 'rgba(59, 130, 246, 0.2)', // MORE VISIBLE
          node: 'rgba(59, 130, 246, 0.4)', // MORE VISIBLE
          pulse: 'rgba(59, 130, 246, 0.7)', // MORE VISIBLE
          glow: 'rgba(59, 130, 246, 0.9)', // MORE VISIBLE
        };
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.02;

      const colors = getColors();

      // Draw grid lines
      nodesRef.current.forEach((node) => {
        node.connections.forEach((connection) => {
          // Calculate pulse intensity
          const pulseIntensity = Math.sin(timeRef.current + node.pulsePhase) * 0.5 + 0.5;
          
          // Draw line with pulse
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connection.x, connection.y);
          
          // Create gradient for tron effect
          const gradient = ctx.createLinearGradient(node.x, node.y, connection.x, connection.y);
          gradient.addColorStop(0, colors.line);
          gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.2 * pulseIntensity})`);
          gradient.addColorStop(1, colors.line);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1 + pulseIntensity * 0.5;
          ctx.stroke();
        });
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const pulseIntensity = Math.sin(timeRef.current + node.pulsePhase) * 0.5 + 0.5;
        
        // Glow effect
        if (pulseIntensity > 0.7) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6 * pulseIntensity, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 6 * pulseIntensity);
          gradient.addColorStop(0, colors.glow);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node (bigger)
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3 + pulseIntensity * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = pulseIntensity > 0.6 ? colors.pulse : colors.node;
        ctx.fill();

        // Inner glow (bigger)
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ opacity: 1 }} // Full opacity - MORE VISIBLE
    />
  );
};
