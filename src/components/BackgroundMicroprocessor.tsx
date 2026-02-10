import React, { useEffect, useRef } from 'react';

interface CircuitPath {
  points: { x: number; y: number }[];
  width: number;
  layer: number;
}

interface Pulse {
  path: CircuitPath;
  progress: number;
  speed: number;
}

export const BackgroundMicroprocessor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<CircuitPath[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePaths();
    };

    const initializePaths = () => {
      pathsRef.current = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Create radial circuit paths from center (like microprocessor)
      const numPaths = 24;
      for (let i = 0; i < numPaths; i++) {
        const angle = (i / numPaths) * Math.PI * 2;
        const length = Math.min(canvas.width, canvas.height) * 0.6;
        
        // Create curved path with multiple segments
        const points: { x: number; y: number }[] = [];
        const segments = 8 + Math.floor(Math.random() * 6);
        
        for (let s = 0; s <= segments; s++) {
          const t = s / segments;
          const distance = length * t;
          
          // Add curves and branches
          const angleOffset = Math.sin(t * Math.PI * 2) * 0.3;
          const currentAngle = angle + angleOffset;
          
          // Add some randomness to create organic look
          const jitter = (Math.random() - 0.5) * 20 * t;
          
          points.push({
            x: centerX + Math.cos(currentAngle) * distance + jitter,
            y: centerY + Math.sin(currentAngle) * distance + jitter,
          });
        }

        pathsRef.current.push({
          points,
          width: 1 + Math.random() * 2,
          layer: Math.floor(Math.random() * 3),
        });

        // Add secondary branches
        if (Math.random() > 0.5) {
          const branchStart = 3 + Math.floor(Math.random() * 3);
          const branchAngle = angle + (Math.random() - 0.5) * 0.8;
          const branchPoints: { x: number; y: number }[] = [];
          
          const startPoint = points[branchStart];
          const branchSegments = 4;
          
          for (let bs = 0; bs <= branchSegments; bs++) {
            const bt = bs / branchSegments;
            const branchDist = (length * 0.3) * bt;
            
            branchPoints.push({
              x: startPoint.x + Math.cos(branchAngle) * branchDist,
              y: startPoint.y + Math.sin(branchAngle) * branchDist,
            });
          }

          pathsRef.current.push({
            points: branchPoints,
            width: 0.8 + Math.random(),
            layer: Math.floor(Math.random() * 3),
          });
        }
      }

      // Add circular connection rings
      for (let ring = 1; ring <= 3; ring++) {
        const radius = (Math.min(canvas.width, canvas.height) * 0.15) * ring;
        const ringPoints: { x: number; y: number }[] = [];
        const steps = 60;
        
        for (let s = 0; s <= steps; s++) {
          const angle = (s / steps) * Math.PI * 2;
          ringPoints.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
          });
        }

        pathsRef.current.push({
          points: ringPoints,
          width: 1.5,
          layer: 1,
        });
      }

      // Initialize pulses
      pulsesRef.current = [];
      for (let i = 0; i < 15; i++) {
        const path = pathsRef.current[Math.floor(Math.random() * pathsRef.current.length)];
        pulsesRef.current.push({
          path,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.004,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const getColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        bg: isDark ? '#000000' : '#FFFFFF',
        line1: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.12)',
        line2: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
        line3: isDark ? 'rgba(96, 165, 250, 0.08)' : 'rgba(96, 165, 250, 0.06)',
        pulse: isDark ? '#38BDF8' : '#0EA5E9',
        glow: isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(14, 165, 233, 0.4)',
      };
    };

    const drawPath = (path: CircuitPath, colors: any) => {
      if (path.points.length < 2) return;

      const lineColors = [colors.line1, colors.line2, colors.line3];
      ctx.strokeStyle = lineColors[path.layer];
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      // Draw smooth curves
      for (let i = 1; i < path.points.length - 1; i++) {
        const xc = (path.points[i].x + path.points[i + 1].x) / 2;
        const yc = (path.points[i].y + path.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(path.points[i].x, path.points[i].y, xc, yc);
      }

      const last = path.points[path.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();

      // Draw connection nodes
      ctx.fillStyle = lineColors[path.layer];
      path.points.forEach((point, idx) => {
        if (idx % 3 === 0 || idx === 0 || idx === path.points.length - 1) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, path.width, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const getPointOnPath = (path: CircuitPath, progress: number) => {
      const totalPoints = path.points.length;
      const index = Math.min(Math.floor(progress * totalPoints), totalPoints - 1);
      const nextIndex = Math.min(index + 1, totalPoints - 1);
      const localProgress = (progress * totalPoints) - index;

      const current = path.points[index];
      const next = path.points[nextIndex];

      return {
        x: current.x + (next.x - current.x) * localProgress,
        y: current.y + (next.y - current.y) * localProgress,
      };
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      const colors = getColors();

      // Clear with background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw all circuit paths
      pathsRef.current.forEach(path => drawPath(path, colors));

      // Draw central processor hub
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const hubSize = 40;

      // Hub glow
      const isDark = document.documentElement.classList.contains('dark');
      const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, hubSize * 2);
      hubGradient.addColorStop(0, colors.glow);
      hubGradient.addColorStop(0.5, isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.15)');
      hubGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = hubGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Hub body (rounded rectangle)
      ctx.fillStyle = colors.bg;
      ctx.strokeStyle = colors.pulse;
      ctx.lineWidth = 2;
      const x = centerX - hubSize / 2;
      const y = centerY - hubSize / 2;
      const radius = 8;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + hubSize - radius, y);
      ctx.arcTo(x + hubSize, y, x + hubSize, y + radius, radius);
      ctx.lineTo(x + hubSize, y + hubSize - radius);
      ctx.arcTo(x + hubSize, y + hubSize, x + hubSize - radius, y + hubSize, radius);
      ctx.lineTo(x + radius, y + hubSize);
      ctx.arcTo(x, y + hubSize, x, y + hubSize - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hub inner details
      ctx.strokeStyle = colors.line1;
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const offset = (i - 1.5) * 8;
        ctx.beginPath();
        ctx.moveTo(centerX - hubSize / 2 + 8, centerY + offset);
        ctx.lineTo(centerX + hubSize / 2 - 8, centerY + offset);
        ctx.stroke();
      }

      // Update and draw pulses
      pulsesRef.current.forEach(pulse => {
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulse.path = pathsRef.current[Math.floor(Math.random() * pathsRef.current.length)];
          pulse.progress = 0;
          pulse.speed = 0.002 + Math.random() * 0.004;
        }

        const pos = getPointOnPath(pulse.path, pulse.progress);

        // Glow
        const glowGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 25);
        glowGradient.addColorStop(0, colors.pulse);
        glowGradient.addColorStop(0.3, colors.glow);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Pulse point
        ctx.fillStyle = colors.pulse;
        ctx.shadowColor = colors.pulse;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Trail
        for (let i = 1; i <= 5; i++) {
          const trailProgress = Math.max(0, pulse.progress - i * 0.03);
          const trailPos = getPointOnPath(pulse.path, trailProgress);
          const opacity = (1 - i * 0.15) * 0.6;

          // Convert hex to rgba
          const r = parseInt(colors.pulse.slice(1, 3), 16);
          const g = parseInt(colors.pulse.slice(3, 5), 16);
          const b = parseInt(colors.pulse.slice(5, 7), 16);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.beginPath();
          ctx.arc(trailPos.x, trailPos.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

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
