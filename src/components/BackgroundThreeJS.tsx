import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex Shader - simple pass-through
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader - curved flowing circuit traces
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  
  varying vec2 vUv;
  
  // Distance to a quadratic Bezier curve
  float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
    vec2 a = B - A;
    vec2 b = A - 2.0*B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;
    
    float kk = 1.0 / dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
    float kz = kk * dot(d,a);
    
    float res = 0.0;
    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
    float h = q*q + 4.0*p3;
    
    if(h >= 0.0) { 
      h = sqrt(h);
      vec2 x = (vec2(h, -h) - q) / 2.0;
      vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
      float t = clamp(uv.x + uv.y - kx, 0.0, 1.0);
      
      vec2 q = d + (c + b*t)*t;
      res = dot(q,q);
    } else {
      float z = sqrt(-p);
      float v = acos(q / (p*z*2.0)) / 3.0;
      float m = cos(v);
      float n = sin(v)*1.732050808;
      vec3 t = clamp(vec3(m + m, -n - m, n - m) * z - kx, 0.0, 1.0);
      
      vec2 qx = d + (c + b*t.x)*t.x;
      float dx = dot(qx, qx);
      
      vec2 qy = d + (c + b*t.y)*t.y;
      float dy = dot(qy, qy);
      
      res = min(dx, dy);
    }
    
    return sqrt(res);
  }
  
  // Draw a curved trace using Bezier
  float curvedTrace(vec2 uv, vec2 start, vec2 control, vec2 end, float thickness) {
    float dist = sdBezier(uv, start, control, end);
    return smoothstep(thickness, thickness * 0.5, dist);
  }
  
  // Circle for nodes and glow
  float circle(vec2 uv, vec2 center, float radius) {
    float dist = length(uv - center);
    return smoothstep(radius, radius * 0.6, dist);
  }
  
  // Traveling pulse along Bezier curve
  float curvePulse(vec2 uv, vec2 start, vec2 control, vec2 end, float time, float speed) {
    float t = mod(time * speed, 1.3) - 0.15;
    t = clamp(t, 0.0, 1.0);
    
    // Point on Bezier curve
    vec2 point = start * (1.0-t) * (1.0-t) + control * 2.0 * (1.0-t) * t + end * t * t;
    
    float dist = length(uv - point);
    float pulse = smoothstep(0.03, 0.0, dist);
    
    // Fade in/out at edges
    float fade = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
    
    return pulse * fade;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    
    vec3 color = vec3(0.0);
    
    // === CURVED CIRCUIT TRACES ===
    float traces = 0.0;
    
    // TOP traces - flowing upward with curves
    traces += curvedTrace(uv, center, vec2(0.5, 0.35), vec2(0.5, 0.15), 0.002);
    traces += curvedTrace(uv, center, vec2(0.45, 0.35), vec2(0.35, 0.1), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.55, 0.35), vec2(0.65, 0.1), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.42, 0.4), vec2(0.25, 0.2), 0.0015);
    traces += curvedTrace(uv, center, vec2(0.58, 0.4), vec2(0.75, 0.2), 0.0015);
    
    // BOTTOM traces - flowing downward with curves
    traces += curvedTrace(uv, center, vec2(0.5, 0.65), vec2(0.5, 0.85), 0.002);
    traces += curvedTrace(uv, center, vec2(0.45, 0.65), vec2(0.35, 0.9), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.55, 0.65), vec2(0.65, 0.9), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.42, 0.6), vec2(0.25, 0.8), 0.0015);
    traces += curvedTrace(uv, center, vec2(0.58, 0.6), vec2(0.75, 0.8), 0.0015);
    
    // LEFT traces - flowing left with curves
    traces += curvedTrace(uv, center, vec2(0.35, 0.5), vec2(0.15, 0.5), 0.002);
    traces += curvedTrace(uv, center, vec2(0.35, 0.45), vec2(0.1, 0.35), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.35, 0.55), vec2(0.1, 0.65), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.4, 0.42), vec2(0.2, 0.25), 0.0015);
    traces += curvedTrace(uv, center, vec2(0.4, 0.58), vec2(0.2, 0.75), 0.0015);
    
    // RIGHT traces - flowing right with curves
    traces += curvedTrace(uv, center, vec2(0.65, 0.5), vec2(0.85, 0.5), 0.002);
    traces += curvedTrace(uv, center, vec2(0.65, 0.45), vec2(0.9, 0.35), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.65, 0.55), vec2(0.9, 0.65), 0.0018);
    traces += curvedTrace(uv, center, vec2(0.6, 0.42), vec2(0.8, 0.25), 0.0015);
    traces += curvedTrace(uv, center, vec2(0.6, 0.58), vec2(0.8, 0.75), 0.0015);
    
    // Additional flowing traces for density
    traces += curvedTrace(uv, center, vec2(0.48, 0.38), vec2(0.4, 0.15), 0.0012);
    traces += curvedTrace(uv, center, vec2(0.52, 0.38), vec2(0.6, 0.15), 0.0012);
    traces += curvedTrace(uv, center, vec2(0.48, 0.62), vec2(0.4, 0.85), 0.0012);
    traces += curvedTrace(uv, center, vec2(0.52, 0.62), vec2(0.6, 0.85), 0.0012);
    
    traces += curvedTrace(uv, center, vec2(0.38, 0.48), vec2(0.15, 0.4), 0.0012);
    traces += curvedTrace(uv, center, vec2(0.38, 0.52), vec2(0.15, 0.6), 0.0012);
    traces += curvedTrace(uv, center, vec2(0.62, 0.48), vec2(0.85, 0.4), 0.0012);
    traces += curvedTrace(uv, center, vec2(0.62, 0.52), vec2(0.85, 0.6), 0.0012);
    
    color += traces * uColor * 0.5;
    
    // === ANIMATED PULSES ON CURVES ===
    float pulses = 0.0;
    
    // Main pulses
    pulses += curvePulse(uv, center, vec2(0.5, 0.35), vec2(0.5, 0.15), uTime, 0.4);
    pulses += curvePulse(uv, center, vec2(0.5, 0.65), vec2(0.5, 0.85), uTime + 1.0, 0.4);
    pulses += curvePulse(uv, center, vec2(0.35, 0.5), vec2(0.15, 0.5), uTime + 2.0, 0.4);
    pulses += curvePulse(uv, center, vec2(0.65, 0.5), vec2(0.85, 0.5), uTime + 3.0, 0.4);
    
    // Diagonal curved pulses
    pulses += curvePulse(uv, center, vec2(0.45, 0.35), vec2(0.35, 0.1), uTime + 0.5, 0.35);
    pulses += curvePulse(uv, center, vec2(0.55, 0.35), vec2(0.65, 0.1), uTime + 1.5, 0.35);
    pulses += curvePulse(uv, center, vec2(0.45, 0.65), vec2(0.35, 0.9), uTime + 2.5, 0.35);
    pulses += curvePulse(uv, center, vec2(0.55, 0.65), vec2(0.65, 0.9), uTime + 3.5, 0.35);
    
    pulses += curvePulse(uv, center, vec2(0.35, 0.45), vec2(0.1, 0.35), uTime + 0.8, 0.35);
    pulses += curvePulse(uv, center, vec2(0.35, 0.55), vec2(0.1, 0.65), uTime + 1.8, 0.35);
    pulses += curvePulse(uv, center, vec2(0.65, 0.45), vec2(0.9, 0.35), uTime + 2.8, 0.35);
    pulses += curvePulse(uv, center, vec2(0.65, 0.55), vec2(0.9, 0.65), uTime + 3.8, 0.35);
    
    color += pulses * uColor * 2.5;
    
    // === CONNECTION NODES ===
    float nodes = 0.0;
    
    // Major endpoints with pulsing
    nodes += circle(uv, vec2(0.5, 0.15), 0.008) * (0.6 + sin(uTime * 2.0) * 0.4);
    nodes += circle(uv, vec2(0.5, 0.85), 0.008) * (0.6 + sin(uTime * 2.0 + 1.57) * 0.4);
    nodes += circle(uv, vec2(0.15, 0.5), 0.008) * (0.6 + sin(uTime * 2.0 + 3.14) * 0.4);
    nodes += circle(uv, vec2(0.85, 0.5), 0.008) * (0.6 + sin(uTime * 2.0 + 4.71) * 0.4);
    
    // Secondary nodes
    nodes += circle(uv, vec2(0.35, 0.1), 0.006) * 0.7;
    nodes += circle(uv, vec2(0.65, 0.1), 0.006) * 0.7;
    nodes += circle(uv, vec2(0.35, 0.9), 0.006) * 0.7;
    nodes += circle(uv, vec2(0.65, 0.9), 0.006) * 0.7;
    
    nodes += circle(uv, vec2(0.1, 0.35), 0.006) * 0.7;
    nodes += circle(uv, vec2(0.1, 0.65), 0.006) * 0.7;
    nodes += circle(uv, vec2(0.9, 0.35), 0.006) * 0.7;
    nodes += circle(uv, vec2(0.9, 0.65), 0.006) * 0.7;
    
    color += nodes * uColor * 1.2;
    
    // === CENTRAL CHIP ===
    float chipX = abs(uv.x - center.x);
    float chipY = abs(uv.y - center.y);
    float chipShape = max(chipX, chipY);
    
    // Chip border with rounded corners
    float chipBorder = smoothstep(0.058, 0.055, chipShape) - smoothstep(0.053, 0.05, chipShape);
    color += chipBorder * uColor * 1.0;
    
    // Chip corner pins
    float pin1 = circle(uv, center + vec2(-0.053, -0.053), 0.005);
    float pin2 = circle(uv, center + vec2(0.053, -0.053), 0.005);
    float pin3 = circle(uv, center + vec2(-0.053, 0.053), 0.005);
    float pin4 = circle(uv, center + vec2(0.053, 0.053), 0.005);
    color += (pin1 + pin2 + pin3 + pin4) * uColor * 1.5;
    
    // Central chip glow (pulsing)
    float chipDist = distance(uv, center);
    float chipGlow = smoothstep(0.15, 0.055, chipDist) * (0.25 + sin(uTime * 0.7) * 0.15);
    color += chipGlow * uColor * 0.6;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Circuit Plane Component
function CircuitPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Detect dark mode
  const isDark = typeof document !== 'undefined' 
    ? document.documentElement.classList.contains('dark')
    : true;
  
  // Create material with ALL uniforms defined upfront
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uColor: { value: new THREE.Color(isDark ? '#00e5ff' : '#3B82F6') },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }, [isDark]);
  
  // Animate the time uniform - WITH SAFETY GUARDS
  useFrame((_, delta) => {
    // Guard 1: Check if ref exists
    if (!meshRef.current) return;
    
    // Guard 2: Check if material is ShaderMaterial
    const mat = meshRef.current.material;
    if (!(mat instanceof THREE.ShaderMaterial)) return;
    
    // Guard 3: Check if uniforms exist
    if (!mat.uniforms?.uTime) return;
    
    // Safe to update
    mat.uniforms.uTime.value += delta * 0.5;
  });
  
  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[20, 20]} />
    </mesh>
  );
}

// Main Background Component
export const BackgroundThreeJS: React.FC = () => {
  // Disable on mobile for performance
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }
  
  // Detect dark mode for background color
  const isDark = typeof document !== 'undefined' 
    ? document.documentElement.classList.contains('dark')
    : true;
  
  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: isDark ? '#000000' : '#FFFFFF',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        frameloop="always" // Keep animating
        gl={{ 
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Minimal lighting */}
        <ambientLight intensity={0.5} />
        
        {/* The circuit board plane */}
        <CircuitPlane />
      </Canvas>
    </div>
  );
};
