import React, { useRef, useEffect, useCallback } from 'react';

// ============================
// Types
// ============================
interface Point { x: number; y: number }

interface Trace {
  points: Point[];
  width: number;
  brightness: number; // 0–1
}

interface Pulse {
  traceIdx: number;
  t: number;       // 0–1 progress along trace
  speed: number;   // per second
  size: number;
  brightness: number;
}

// ============================
// Utilities
// ============================
function vecDist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function pathLen(pts: Point[]): number {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += vecDist(pts[i - 1], pts[i]);
  return l;
}

function samplePath(pts: Point[], t: number): Point {
  const total = pathLen(pts);
  let target = t * total, acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const seg = vecDist(pts[i - 1], pts[i]);
    if (acc + seg >= target && seg > 0) {
      const s = (target - acc) / seg;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * s, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * s };
    }
    acc += seg;
  }
  return pts[pts.length - 1];
}

function rgba(r: number, g: number, b: number, a: number) { return `rgba(${r},${g},${b},${a})`; }

// ============================
// Generate All Circuit Traces
// ALL straight lines + 90° turns only
// ALL traces extend to screen edges
// ============================
function generateCircuit(w: number, h: number) {
  const hw = w / 2 + 50; // half-width + margin so lines go off screen
  const hh = h / 2 + 50; // half-height + margin
  const cw = 55; // chip half-width
  const traces: Trace[] = [];

  // Helper: mirror traces
  const mirror = (src: Trace[], mx: boolean, my: boolean) =>
    src.map(t => ({ ...t, points: t.points.map(p => ({ x: mx ? -p.x : p.x, y: my ? -p.y : p.y })) }));

  // ─── TOP traces (from chip top edge going UP to screen edge) ───
  const topTraces: Trace[] = [];

  // Center bus (3 parallel straight lines all the way up)
  [-5, 0, 5].forEach((x, i) => topTraces.push({
    points: [{ x, y: -cw }, { x, y: -hh }],
    width: i === 1 ? 3.5 : 2, brightness: i === 1 ? 0.7 : 0.55,
  }));

  // Secondary straight lines
  [-15, 15].forEach(x => topTraces.push({
    points: [{ x, y: -cw }, { x, y: -hh }], width: 1.8, brightness: 0.45,
  }));

  // L-shaped: go up, turn left, go to left edge
  topTraces.push({
    points: [{ x: -25, y: -cw }, { x: -25, y: -cw - 80 }, { x: -hw, y: -cw - 80 }],
    width: 2, brightness: 0.45,
  });
  topTraces.push({
    points: [{ x: -30, y: -cw }, { x: -30, y: -cw - 140 }, { x: -hw, y: -cw - 140 }],
    width: 1.5, brightness: 0.38,
  });
  topTraces.push({
    points: [{ x: -35, y: -cw }, { x: -35, y: -cw - 200 }, { x: -hw, y: -cw - 200 }],
    width: 1.2, brightness: 0.32,
  });
  // Up then turn left then continue up to top edge
  topTraces.push({
    points: [{ x: -20, y: -cw }, { x: -20, y: -cw - 110 }, { x: -80, y: -cw - 110 }, { x: -80, y: -hh }],
    width: 1.5, brightness: 0.35,
  });
  topTraces.push({
    points: [{ x: -40, y: -cw }, { x: -40, y: -cw - 60 }, { x: -150, y: -cw - 60 }, { x: -150, y: -hh }],
    width: 1.3, brightness: 0.3,
  });

  // L-shaped: go up, turn right, go to right edge
  topTraces.push({
    points: [{ x: 25, y: -cw }, { x: 25, y: -cw - 80 }, { x: hw, y: -cw - 80 }],
    width: 2, brightness: 0.45,
  });
  topTraces.push({
    points: [{ x: 30, y: -cw }, { x: 30, y: -cw - 140 }, { x: hw, y: -cw - 140 }],
    width: 1.5, brightness: 0.38,
  });
  topTraces.push({
    points: [{ x: 35, y: -cw }, { x: 35, y: -cw - 200 }, { x: hw, y: -cw - 200 }],
    width: 1.2, brightness: 0.32,
  });
  // Up then turn right then continue up
  topTraces.push({
    points: [{ x: 20, y: -cw }, { x: 20, y: -cw - 110 }, { x: 80, y: -cw - 110 }, { x: 80, y: -hh }],
    width: 1.5, brightness: 0.35,
  });
  topTraces.push({
    points: [{ x: 40, y: -cw }, { x: 40, y: -cw - 60 }, { x: 150, y: -cw - 60 }, { x: 150, y: -hh }],
    width: 1.3, brightness: 0.3,
  });

  // Extra thin lines straight up
  [-45, -10, 10, 45].forEach(x => topTraces.push({
    points: [{ x, y: -cw }, { x, y: -hh }], width: 0.8, brightness: 0.22,
  }));

  traces.push(...topTraces);
  // BOTTOM = mirror top
  traces.push(...mirror(topTraces, false, true));

  // ─── LEFT traces (from chip left edge going LEFT to screen edge) ───
  const leftTraces: Trace[] = [];

  // Center bus
  [-5, 0, 5].forEach((y, i) => leftTraces.push({
    points: [{ x: -cw, y }, { x: -hw, y }],
    width: i === 1 ? 3.5 : 2, brightness: i === 1 ? 0.7 : 0.55,
  }));

  // Secondary
  [-15, 15].forEach(y => leftTraces.push({
    points: [{ x: -cw, y }, { x: -hw, y }], width: 1.8, brightness: 0.45,
  }));

  // L-shaped: go left, turn up, go to top edge
  leftTraces.push({
    points: [{ x: -cw, y: -25 }, { x: -cw - 80, y: -25 }, { x: -cw - 80, y: -hh }],
    width: 2, brightness: 0.45,
  });
  leftTraces.push({
    points: [{ x: -cw, y: -30 }, { x: -cw - 140, y: -30 }, { x: -cw - 140, y: -hh }],
    width: 1.5, brightness: 0.38,
  });
  leftTraces.push({
    points: [{ x: -cw, y: -35 }, { x: -cw - 200, y: -35 }, { x: -cw - 200, y: -hh }],
    width: 1.2, brightness: 0.32,
  });
  // Left then turn up then continue left
  leftTraces.push({
    points: [{ x: -cw, y: -20 }, { x: -cw - 110, y: -20 }, { x: -cw - 110, y: -80 }, { x: -hw, y: -80 }],
    width: 1.5, brightness: 0.35,
  });

  // L-shaped: go left, turn down, go to bottom edge
  leftTraces.push({
    points: [{ x: -cw, y: 25 }, { x: -cw - 80, y: 25 }, { x: -cw - 80, y: hh }],
    width: 2, brightness: 0.45,
  });
  leftTraces.push({
    points: [{ x: -cw, y: 30 }, { x: -cw - 140, y: 30 }, { x: -cw - 140, y: hh }],
    width: 1.5, brightness: 0.38,
  });
  leftTraces.push({
    points: [{ x: -cw, y: 35 }, { x: -cw - 200, y: 35 }, { x: -cw - 200, y: hh }],
    width: 1.2, brightness: 0.32,
  });
  leftTraces.push({
    points: [{ x: -cw, y: 20 }, { x: -cw - 110, y: 20 }, { x: -cw - 110, y: 80 }, { x: -hw, y: 80 }],
    width: 1.5, brightness: 0.35,
  });

  // Extra thin lines straight left
  [-45, -10, 10, 45].forEach(y => leftTraces.push({
    points: [{ x: -cw, y }, { x: -hw, y }], width: 0.8, brightness: 0.22,
  }));

  traces.push(...leftTraces);
  // RIGHT = mirror left
  traces.push(...mirror(leftTraces, true, false));

  // ─── DIAGONAL traces (only straight segments + 90° turns) ───
  // NW corner: go from chip corner, straight 45°, then L-turn to edge
  const diagNW: Trace[] = [];

  // 45° line from chip corner toward NW corner of screen
  diagNW.push({
    points: [{ x: -cw, y: -cw }, { x: -hw, y: -hh }],
    width: 2, brightness: 0.4,
  });
  // Parallel 45° offset
  diagNW.push({
    points: [{ x: -cw - 5, y: -cw + 5 }, { x: -hw, y: -(hh - 10) }],
    width: 1.2, brightness: 0.3,
  });
  diagNW.push({
    points: [{ x: -cw + 5, y: -cw - 5 }, { x: -(hw - 10), y: -hh }],
    width: 1.2, brightness: 0.3,
  });

  // 45° then turn horizontal to left edge
  diagNW.push({
    points: [{ x: -cw, y: -cw }, { x: -cw - 100, y: -cw - 100 }, { x: -hw, y: -cw - 100 }],
    width: 1.5, brightness: 0.35,
  });
  // 45° then turn vertical to top edge
  diagNW.push({
    points: [{ x: -cw, y: -cw }, { x: -cw - 100, y: -cw - 100 }, { x: -cw - 100, y: -hh }],
    width: 1.5, brightness: 0.35,
  });
  // Shorter diag then double-turn
  diagNW.push({
    points: [{ x: -cw, y: -cw }, { x: -cw - 50, y: -cw - 50 }, { x: -cw - 50, y: -cw - 160 }, { x: -hw, y: -cw - 160 }],
    width: 1, brightness: 0.28,
  });
  diagNW.push({
    points: [{ x: -cw, y: -cw }, { x: -cw - 60, y: -cw - 60 }, { x: -cw - 160, y: -cw - 60 }, { x: -cw - 160, y: -hh }],
    width: 1, brightness: 0.28,
  });

  traces.push(...diagNW);
  traces.push(...mirror(diagNW, true, false));  // NE
  traces.push(...mirror(diagNW, false, true));  // SW
  traces.push(...mirror(diagNW, true, true));   // SE

  // ─── Cross-connections (horizontal/vertical links between traces) ───
  [-180, -120, 120, 180].forEach(y => traces.push({
    points: [{ x: -hw, y }, { x: hw, y }], width: 0.6, brightness: 0.15,
  }));
  [-180, -120, 120, 180].forEach(x => traces.push({
    points: [{ x, y: -hh }, { x, y: hh }], width: 0.6, brightness: 0.15,
  }));

  // ─── Pulses ───
  const pulses: Pulse[] = [];
  const mainIdx = traces.reduce<number[]>((a, t, i) => { if (t.brightness >= 0.35) a.push(i); return a; }, []);
  for (let i = 0; i < 24; i++) {
    pulses.push({
      traceIdx: mainIdx[i % mainIdx.length],
      t: Math.random(),
      speed: 0.1 + Math.random() * 0.15,
      size: 4 + Math.random() * 3,
      brightness: 0.8 + Math.random() * 0.2,
    });
  }
  for (let i = 0; i < 10; i++) {
    pulses.push({
      traceIdx: Math.floor(Math.random() * traces.length),
      t: Math.random(),
      speed: 0.06 + Math.random() * 0.1,
      size: 3 + Math.random() * 2,
      brightness: 0.5 + Math.random() * 0.3,
    });
  }

  return { traces, pulses };
}

// ============================
// Drawing Helpers
// ============================
function strokePath(ctx: CanvasRenderingContext2D, pts: Point[], cx: number, cy: number) {
  ctx.beginPath();
  ctx.moveTo(cx + pts[0].x, cy + pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(cx + pts[i].x, cy + pts[i].y);
  ctx.stroke();
}

function drawTraceGlow(ctx: CanvasRenderingContext2D, pts: Point[], cx: number, cy: number, width: number, brightness: number, color: [number, number, number]) {
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter'; // Sharp 90° corners like real PCB

  // Outer glow
  ctx.lineWidth = width + 14;
  ctx.strokeStyle = rgba(color[0], color[1], color[2], brightness * 0.06);
  strokePath(ctx, pts, cx, cy);

  // Mid glow
  ctx.lineWidth = width + 7;
  ctx.strokeStyle = rgba(color[0], color[1], color[2], brightness * 0.12);
  strokePath(ctx, pts, cx, cy);

  // Core
  ctx.lineWidth = width;
  ctx.strokeStyle = rgba(color[0], color[1], color[2], brightness * 0.7);
  strokePath(ctx, pts, cx, cy);

  // Bright centre line
  ctx.lineWidth = Math.max(width * 0.5, 0.5);
  ctx.strokeStyle = rgba(color[0], color[1], color[2], brightness * 0.9);
  strokePath(ctx, pts, cx, cy);
}

function drawChip(ctx: CanvasRenderingContext2D, cx: number, cy: number, cw: number, color: [number, number, number]) {
  const s = cw; // half-size

  // Outer glow
  ctx.shadowColor = rgba(color[0], color[1], color[2], 0.6);
  ctx.shadowBlur = 40;

  // Chip body (dark fill)
  ctx.fillStyle = '#050a10';
  ctx.strokeStyle = rgba(color[0], color[1], color[2], 0.8);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(cx - s, cy - s, s * 2, s * 2, 6);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Inner border
  ctx.strokeStyle = rgba(color[0], color[1], color[2], 0.3);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cx - s + 8, cy - s + 8, (s - 8) * 2, (s - 8) * 2, 3);
  ctx.stroke();

  // Internal grid pattern (die lines)
  ctx.strokeStyle = rgba(color[0], color[1], color[2], 0.12);
  ctx.lineWidth = 0.5;
  for (let i = -s + 14; i < s; i += 8) {
    ctx.beginPath(); ctx.moveTo(cx + i, cy - s + 14); ctx.lineTo(cx + i, cy + s - 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - s + 14, cy + i); ctx.lineTo(cx + s - 14, cy + i); ctx.stroke();
  }

  // Corner pins
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => {
    const px = cx + dx * (s - 2);
    const py = cy + dy * (s - 2);
    ctx.fillStyle = rgba(color[0], color[1], color[2], 0.9);
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
  });

  // Edge pins (like IC package)
  for (let i = -35; i <= 35; i += 10) {
    // Top & bottom pins
    ctx.fillStyle = rgba(color[0], color[1], color[2], 0.5);
    ctx.fillRect(cx + i - 3, cy - s - 6, 6, 8);
    ctx.fillRect(cx + i - 3, cy + s - 2, 6, 8);
    // Left & right pins
    ctx.fillRect(cx - s - 6, cy + i - 3, 8, 6);
    ctx.fillRect(cx + s - 2, cy + i - 3, 8, 6);
  }
}

function drawSmallComponents(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: [number, number, number]) {
  // Small rectangular components on traces (like capacitors/resistors)
  const comps = [
    // On vertical bus lines
    { x: 0, y: -180, w: 14, h: 6, r: 0 },
    { x: 0, y: -320, w: 12, h: 5, r: 0 },
    { x: 0, y: 180, w: 14, h: 6, r: 0 },
    { x: 0, y: 320, w: 12, h: 5, r: 0 },
    // On horizontal bus lines
    { x: -180, y: 0, w: 6, h: 14, r: 0 },
    { x: -320, y: 0, w: 5, h: 12, r: 0 },
    { x: 180, y: 0, w: 6, h: 14, r: 0 },
    { x: 320, y: 0, w: 5, h: 12, r: 0 },
    // On L-shaped traces
    { x: -25, y: -160, w: 10, h: 5, r: 0 },
    { x: 25, y: -160, w: 10, h: 5, r: 0 },
    { x: -25, y: 160, w: 10, h: 5, r: 0 },
    { x: 25, y: 160, w: 10, h: 5, r: 0 },
    { x: -160, y: -25, w: 5, h: 10, r: 0 },
    { x: -160, y: 25, w: 5, h: 10, r: 0 },
    { x: 160, y: -25, w: 5, h: 10, r: 0 },
    { x: 160, y: 25, w: 5, h: 10, r: 0 },
    // On diagonal traces
    { x: -150, y: -150, w: 8, h: 8, r: 45 },
    { x: 150, y: -150, w: 8, h: 8, r: -45 },
    { x: -150, y: 150, w: 8, h: 8, r: -45 },
    { x: 150, y: 150, w: 8, h: 8, r: 45 },
    { x: -280, y: -280, w: 6, h: 6, r: 45 },
    { x: 280, y: -280, w: 6, h: 6, r: -45 },
    { x: -280, y: 280, w: 6, h: 6, r: -45 },
    { x: 280, y: 280, w: 6, h: 6, r: 45 },
  ];
  comps.forEach(c => {
    ctx.save();
    ctx.translate(cx + c.x, cy + c.y);
    ctx.rotate((c.r * Math.PI) / 180);
    ctx.fillStyle = '#080e16';
    ctx.strokeStyle = rgba(color[0], color[1], color[2], 0.5);
    ctx.lineWidth = 1;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.strokeRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  });
}

function drawNodes(ctx: CanvasRenderingContext2D, cx: number, cy: number, traces: Trace[], color: [number, number, number]) {
  // Draw small circles at trace endpoints
  const drawn = new Set<string>();
  traces.forEach(t => {
    const end = t.points[t.points.length - 1];
    const key = `${Math.round(end.x / 5)},${Math.round(end.y / 5)}`;
    if (drawn.has(key)) return;
    drawn.add(key);

    const px = cx + end.x, py = cy + end.y;
    // Check if endpoint is near screen edge (skip if off screen)
    if (px < -20 || px > cx * 2 + 20 || py < -20 || py > cy * 2 + 20) return;

    ctx.fillStyle = rgba(color[0], color[1], color[2], 0.5);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ============================
// Main Component
// ============================
export const BackgroundCircuitBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const dataRef = useRef<{ traces: Trace[]; pulses: Pulse[] }>({ traces: [], pulses: [] });
  const lastRef = useRef(0);

  const COLOR_DARK: [number, number, number] = [0, 229, 255];
  const COLOR_LIGHT: [number, number, number] = [59, 130, 246];

  const getColor = useCallback((): [number, number, number] => {
    if (typeof document === 'undefined') return COLOR_DARK;
    return document.documentElement.classList.contains('dark') ? COLOR_DARK : COLOR_LIGHT;
  }, []);

  const buildStatic = useCallback((w: number, h: number) => {
    const color = getColor();
    const data = generateCircuit(w, h);
    dataRef.current = data;

    // Create or resize offscreen canvas
    if (!offRef.current) offRef.current = document.createElement('canvas');
    const off = offRef.current;
    off.width = w;
    off.height = h;
    const ctx = off.getContext('2d');
    if (!ctx) return;

    const cx = w / 2, cy = h / 2;

    // Background
    const isDark = getColor() === COLOR_DARK;
    ctx.fillStyle = isDark ? '#000000' : '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Subtle radial gradient overlay (brighter near center)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
    grad.addColorStop(0, rgba(color[0], color[1], color[2], 0.03));
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw all traces
    data.traces.forEach(t => drawTraceGlow(ctx, t.points, cx, cy, t.width, t.brightness, color));

    // Small components
    drawSmallComponents(ctx, cx, cy, color);

    // Connection nodes at endpoints
    drawNodes(ctx, cx, cy, data.traces, color);

    // Central chip (drawn LAST so it's on top)
    drawChip(ctx, cx, cy, 55, color);
  }, [getColor]);

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const off = offRef.current;
    if (!canvas || !off) { rafRef.current = requestAnimationFrame(animate); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { rafRef.current = requestAnimationFrame(animate); return; }

    const dt = lastRef.current ? (time - lastRef.current) / 1000 : 0.016;
    lastRef.current = time;

    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const color = getColor();

    // Copy static background
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(off, 0, 0);

    // Update & draw pulses
    const { traces, pulses } = dataRef.current;
    pulses.forEach(p => {
      p.t += dt * p.speed;
      if (p.t > 1.15) p.t = -0.15;

      const clamped = Math.max(0, Math.min(1, p.t));
      const trace = traces[p.traceIdx];
      if (!trace || trace.points.length < 2) return;

      const pt = samplePath(trace.points, clamped);
      const px = cx + pt.x, py = cy + pt.y;

      // Fade at edges
      const fade = Math.min(1, Math.min(p.t + 0.15, 1.15 - p.t) / 0.15);
      if (fade <= 0) return;

      const br = p.brightness * fade;

      // Outer glow
      ctx.fillStyle = rgba(color[0], color[1], color[2], br * 0.1);
      ctx.beginPath(); ctx.arc(px, py, p.size + 12, 0, Math.PI * 2); ctx.fill();

      // Mid glow
      ctx.fillStyle = rgba(color[0], color[1], color[2], br * 0.25);
      ctx.beginPath(); ctx.arc(px, py, p.size + 6, 0, Math.PI * 2); ctx.fill();

      // Core
      ctx.fillStyle = rgba(color[0], color[1], color[2], br * 0.9);
      ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2); ctx.fill();

      // White-hot center
      ctx.fillStyle = rgba(255, 255, 255, br * 0.5);
      ctx.beginPath(); ctx.arc(px, py, p.size * 0.4, 0, Math.PI * 2); ctx.fill();
    });

    // Chip breathing glow
    const breathe = 0.3 + Math.sin(time * 0.001) * 0.15;
    const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 100);
    glowGrad.addColorStop(0, rgba(color[0], color[1], color[2], breathe * 0.15));
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(cx - 100, cy - 100, 200, 200);

    rafRef.current = requestAnimationFrame(animate);
  }, [getColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);

      buildStatic(w, h);
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(animate);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      resize(); // Rebuild with new color
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [buildStatic, animate]);

  // Disable on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    />
  );
};
