import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 1800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#3b82f6'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#ffffff'),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock, mouse }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.getElapsedTime() * 0.03;
    mesh.current.rotation.x = mouse.y * 0.05;
    mesh.current.rotation.z = mouse.x * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function FloatingOrb({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed) * 0.5;
    mesh.current.position.x = position[0] + Math.cos(clock.getElapsedTime() * speed * 0.7) * 0.3;
  });
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.15} />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <Particles />
        <FloatingOrb position={[-4, 2, -2]} color="#3b82f6" speed={0.4} />
        <FloatingOrb position={[4, -2, -3]} color="#8b5cf6" speed={0.3} />
        <FloatingOrb position={[0, 3, -4]} color="#06b6d4" speed={0.5} />
        <FloatingOrb position={[-3, -3, -2]} color="#ec4899" speed={0.35} />
      </Canvas>
    </div>
  );
}
