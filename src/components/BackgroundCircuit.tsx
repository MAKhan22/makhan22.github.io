import React, { useEffect, useRef } from 'react';

interface Pulse {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  speed: number;
}

export const BackgroundCircuit: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulsesRef = useRef<Pulse[]>([]);
  const linesRef = useRef<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize circuit lines (define BEFORE updateCanvasSize)
    const initializeCircuit = () => {
      linesRef.current = [];
      const cols = Math.floor(canvas.width / 120);
      const rows = Math.floor(canvas.height / 120);

      // Create horizontal and vertical lines (circuit traces)
      for (let i = 0; i <= cols; i++) {
        const x = i * 120 + 60;
        for (let j = 0; j < rows; j++) {
          const y = j * 120 + 60;
          // Vertical line
          linesRef.current.push({
            x1: x,
            y1: y,
            x2: x,
            y2: y + 120,
          });
          // Horizontal line
          if (i < cols) {
            linesRef.current.push({
              x1: x,
              y1: y,
              x2: x + 120,
              y2: y,
            });
          }
        }
      }

      // Initialize pulses (traveling lights)
      pulsesRef.current = [];
      for (let i = 0; i < 8; i++) {
        const line = linesRef.current[Math.floor(Math.random() * linesRef.current.length)];
        pulsesRef.current.push({
          ...line,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.005,
        });
      }
    };

    // Set canvas size (define AFTER initializeCircuit)
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeCircuit();
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Get theme-aware colors
    const getColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        return {
          bg: '#0A0A0A',
          line: 'rgba(59, 130, 246, 0.15)',
          pulse: 'rgba(96, 165, 250, 0.8)',
          glow: 'rgba(96, 165, 250, 0.4)',
        };
      } else {
        return {
          bg: '#FFFFFF',
          line: 'rgba(59, 130, 246, 0.1)',
          pulse: 'rgba(59, 130, 246, 0.7)',
          glow: 'rgba(59, 130, 246, 0.3)',
        };
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      const colors = getColors();

      // Clear with background color
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw static circuit lines
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1.5;
      linesRef.current.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();

        // Draw connection points (nodes)
        ctx.fillStyle = colors.line;
        ctx.beginPath();
        ctx.arc(line.x1, line.y1, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw pulses (traveling lights)
      pulsesRef.current.forEach((pulse) => {
        // Update progress
        pulse.progress += pulse.speed;

        // Reset if completed
        if (pulse.progress >= 1) {
          const newLine = linesRef.current[Math.floor(Math.random() * linesRef.current.length)];
          pulse.x1 = newLine.x1;
          pulse.y1 = newLine.y1;
          pulse.x2 = newLine.x2;
          pulse.y2 = newLine.y2;
          pulse.progress = 0;
          pulse.speed = 0.003 + Math.random() * 0.005;
        }

        // Calculate current position
        const currentX = pulse.x1 + (pulse.x2 - pulse.x1) * pulse.progress;
        const currentY = pulse.y1 + (pulse.y2 - pulse.y1) * pulse.progress;

        // Draw glow
        const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 20);
        gradient.addColorStop(0, colors.pulse);
        gradient.addColorStop(0.3, colors.glow);
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright pulse point
        ctx.fillStyle = colors.pulse;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        for (let i = 1; i <= 5; i++) {
          const trailProgress = Math.max(0, pulse.progress - i * 0.02);
          const trailX = pulse.x1 + (pulse.x2 - pulse.x1) * trailProgress;
          const trailY = pulse.y1 + (pulse.y2 - pulse.y1) * trailProgress;
          const trailOpacity = 1 - i * 0.15;

          ctx.fillStyle = `rgba(96, 165, 250, ${trailOpacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(trailX, trailY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};
