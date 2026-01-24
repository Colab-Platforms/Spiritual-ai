import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Sun component with glow effect
const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      {/* Core sun */}
      <Sphere ref={sunRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#f5c36a" />
      </Sphere>
      {/* Glow layers */}
      <Sphere args={[2.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#f5c36a" transparent opacity={0.3} />
      </Sphere>
      <Sphere args={[2.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#f5c36a" transparent opacity={0.15} />
      </Sphere>
      <Sphere args={[3, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#f5c36a" transparent opacity={0.05} />
      </Sphere>
      {/* Point light from sun */}
      <pointLight color="#f5c36a" intensity={2} distance={100} />
    </group>
  );
};

// Planet component
interface PlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  initialAngle?: number;
  hasRing?: boolean;
}

const Planet = ({ radius, orbitRadius, speed, color, initialAngle = 0, hasRing }: PlanetProps) => {
  const planetRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (planetRef.current) {
      const t = clock.getElapsedTime() * speed + initialAngle;
      planetRef.current.position.x = Math.cos(t) * orbitRadius;
      planetRef.current.position.z = Math.sin(t) * orbitRadius;
      planetRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={planetRef}>
      <Sphere args={[radius, 32, 32]}>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
      </Sphere>
      {hasRing && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// Orbit ring visualization
const OrbitRing = ({ radius }: { radius: number }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial color="#f5c36a" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Mouse parallax camera controller
const CameraController = ({ scrollProgress }: { scrollProgress: number }) => {
  const { camera } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });
  
  useMemo(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame(() => {
    // Base position with scroll zoom
    const baseZ = 25 - scrollProgress * 20;
    const targetX = mousePos.current.x * 3;
    const targetY = mousePos.current.y * 2 + 2;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (baseZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Particle field for extra stars
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#f5c36a" size={0.05} transparent opacity={0.6} />
    </points>
  );
};

interface SolarSystemProps {
  scrollProgress: number;
}

export const SolarSystemScene = ({ scrollProgress }: SolarSystemProps) => {
  return (
    <>
      <CameraController scrollProgress={scrollProgress} />
      <ambientLight intensity={0.1} />
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ParticleField />
      
      {/* Sun */}
      <Sun />
      
      {/* Orbit rings */}
      <OrbitRing radius={5} />
      <OrbitRing radius={7} />
      <OrbitRing radius={10} />
      <OrbitRing radius={14} />
      <OrbitRing radius={18} />
      
      {/* Planets */}
      <Planet radius={0.3} orbitRadius={5} speed={0.8} color="#a0522d" initialAngle={0} /> {/* Mercury */}
      <Planet radius={0.5} orbitRadius={7} speed={0.5} color="#daa520" initialAngle={2} /> {/* Venus */}
      <Planet radius={0.6} orbitRadius={10} speed={0.3} color="#4169e1" initialAngle={4} /> {/* Earth */}
      <Planet radius={0.4} orbitRadius={14} speed={0.2} color="#cd5c5c" initialAngle={1} /> {/* Mars */}
      <Planet radius={1.2} orbitRadius={18} speed={0.1} color="#deb887" initialAngle={3} hasRing /> {/* Saturn-like */}
    </>
  );
};

export const SolarSystem = ({ scrollProgress }: SolarSystemProps) => {
  return (
    <Canvas
      camera={{ position: [0, 2, 25], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <SolarSystemScene scrollProgress={scrollProgress} />
    </Canvas>
  );
};

export default SolarSystem;
