import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { circuitTraces } from '../data/circuitTraces';

// Animated trace component
function AnimatedTrace({ points, speed, delay }: { points: number[][], speed: number, delay: number }) {
  const lineRef = useRef<any>();
  const pulseRef = useRef<THREE.Mesh>(null);
  
  const positions = useMemo(() => {
    return points.map(p => new THREE.Vector3(...p as [number, number, number]));
  }, [points]);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(positions);
  }, [positions]);

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const time = clock.getElapsedTime();
      const t = ((time * speed + delay) % 1);
      const position = curve.getPointAt(t);
      pulseRef.current.position.copy(position);
      
      // Fade in/out at ends
      const opacity = Math.sin(t * Math.PI);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8;
    }
  });

  return (
    <group>
      {/* Static trace line */}
      <Line
        ref={lineRef}
        points={positions}
        color="#00e5ff"
        lineWidth={1}
        transparent
        opacity={0.15}
      />
      
      {/* Moving pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial 
          color="#00e5ff" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Pulse glow */}
      <mesh ref={pulseRef} position={[0, 0, -0.01]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color="#00e5ff" 
          transparent 
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Main scene
function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Circuit board base */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[20, 12]} />
        <meshBasicMaterial color="#0a0f14" transparent opacity={0.95} />
      </mesh>
      
      {/* Connection nodes at key points */}
      {[
        [-5, 3], [-5, -3], [5, 3], [5, -3],
        [-2, 0], [2, 0], [0, 2], [0, -2],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial 
            color="#00e5ff" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      ))}
      
      {/* Animated traces */}
      {circuitTraces.map((trace, i) => (
        <AnimatedTrace
          key={i}
          points={trace.points}
          speed={trace.speed}
          delay={trace.delay}
        />
      ))}
    </>
  );
}

// Main component
export const BackgroundScene: React.FC = () => {
  // Don't render on mobile for performance
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]} // Limit resolution for performance
        gl={{ antialias: false }} // Performance optimization
      >
        <Scene />
      </Canvas>
    </div>
  );
};
