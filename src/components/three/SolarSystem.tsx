import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Sun component with realistic glow effect
const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z = clock.getElapsedTime() * 0.02;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      coronaRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Core sun with emissive material */}
      <Sphere ref={sunRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ffcc44"
          emissive="#ff8800"
          emissiveIntensity={2}
          roughness={1}
        />
      </Sphere>
      {/* Corona layers */}
      <Sphere ref={coronaRef} args={[2.3, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffaa33" transparent opacity={0.4} />
      </Sphere>
      <Sphere args={[2.6, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ff9922" transparent opacity={0.2} />
      </Sphere>
      <Sphere args={[3.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ff8811" transparent opacity={0.1} />
      </Sphere>
      <Sphere args={[4, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ff6600" transparent opacity={0.05} />
      </Sphere>
      {/* Point light from sun */}
      <pointLight color="#ffcc66" intensity={3} distance={150} decay={2} />
    </group>
  );
};

// Realistic planet component with procedural surface
interface PlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  emissive?: string;
  initialAngle?: number;
  hasRing?: boolean;
  ringColor?: string;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
  rotationSpeed?: number;
  tilt?: number;
}

const Planet = ({ 
  radius, 
  orbitRadius, 
  speed, 
  color,
  emissive,
  initialAngle = 0, 
  hasRing,
  ringColor = '#d4a574',
  hasAtmosphere,
  atmosphereColor = '#88ccff',
  rotationSpeed = 0.01,
  tilt = 0
}: PlanetProps) => {
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (planetRef.current) {
      const t = clock.getElapsedTime() * speed + initialAngle;
      planetRef.current.position.x = Math.cos(t) * orbitRadius;
      planetRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={planetRef}>
      <group rotation={[tilt, 0, 0]}>
        {/* Planet body */}
        <Sphere ref={meshRef} args={[radius, 48, 48]}>
          <meshStandardMaterial 
            color={color}
            emissive={emissive || color}
            emissiveIntensity={0.1}
            roughness={0.8}
            metalness={0.2}
          />
        </Sphere>
        
        {/* Atmosphere glow */}
        {hasAtmosphere && (
          <>
            <Sphere args={[radius * 1.05, 32, 32]}>
              <meshBasicMaterial 
                color={atmosphereColor} 
                transparent 
                opacity={0.15} 
                side={THREE.BackSide}
              />
            </Sphere>
            <Sphere args={[radius * 1.1, 32, 32]}>
              <meshBasicMaterial 
                color={atmosphereColor} 
                transparent 
                opacity={0.08} 
                side={THREE.BackSide}
              />
            </Sphere>
          </>
        )}
        
        {/* Ring system */}
        {hasRing && (
          <group rotation={[Math.PI / 2.2, 0, 0]}>
            <mesh>
              <ringGeometry args={[radius * 1.4, radius * 1.8, 64]} />
              <meshBasicMaterial 
                color={ringColor} 
                transparent 
                opacity={0.6} 
                side={THREE.DoubleSide} 
              />
            </mesh>
            <mesh>
              <ringGeometry args={[radius * 1.85, radius * 2.2, 64]} />
              <meshBasicMaterial 
                color={ringColor} 
                transparent 
                opacity={0.35} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// Orbit ring visualization
const OrbitRing = ({ radius, opacity = 0.15 }: { radius: number; opacity?: number }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.03, radius + 0.03, 128]} />
      <meshBasicMaterial color="#f5c36a" transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Mouse parallax camera controller
const CameraController = ({ scrollProgress }: { scrollProgress: number }) => {
  const { camera } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0, z: 30 });
  
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
    const baseZ = 30 - scrollProgress * 25;
    targetPos.current.x = mousePos.current.x * 4;
    targetPos.current.y = mousePos.current.y * 3 + 3;
    targetPos.current.z = baseZ;
    
    camera.position.x += (targetPos.current.x - camera.position.x) * 0.03;
    camera.position.y += (targetPos.current.y - camera.position.y) * 0.03;
    camera.position.z += (targetPos.current.z - camera.position.z) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Enhanced particle field for extra stars
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    const colors = new Float32Array(3000 * 3);
    
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
      
      // Vary star colors slightly (warm white to golden)
      const warmth = Math.random() * 0.3;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.9 + warmth * 0.1;
      colors[i * 3 + 2] = 0.7 + warmth * 0.2;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.005;
      particlesRef.current.rotation.x = clock.getElapsedTime() * 0.002;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3000}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={3000}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        transparent 
        opacity={0.8}
        vertexColors
        sizeAttenuation
      />
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
      <ambientLight intensity={0.15} />
      
      {/* Background stars */}
      <Stars radius={120} depth={60} count={6000} factor={5} saturation={0.3} fade speed={0.5} />
      <ParticleField />
      
      {/* Sun */}
      <Sun />
      
      {/* Orbit rings */}
      <OrbitRing radius={5} opacity={0.12} />
      <OrbitRing radius={7.5} opacity={0.1} />
      <OrbitRing radius={11} opacity={0.1} />
      <OrbitRing radius={15} opacity={0.08} />
      <OrbitRing radius={20} opacity={0.06} />
      
      {/* Mercury - small, gray/brown, close to sun */}
      <Planet 
        radius={0.25} 
        orbitRadius={5} 
        speed={0.9} 
        color="#8c7853"
        emissive="#5a4a3a"
        initialAngle={0.5}
        rotationSpeed={0.002}
      />
      
      {/* Venus - yellowish, thick atmosphere appearance */}
      <Planet 
        radius={0.45} 
        orbitRadius={7.5} 
        speed={0.6} 
        color="#e6c87a"
        emissive="#d4a855"
        initialAngle={2.1}
        hasAtmosphere
        atmosphereColor="#ffe4a0"
        rotationSpeed={0.001}
      />
      
      {/* Earth - blue with atmosphere */}
      <Planet 
        radius={0.5} 
        orbitRadius={11} 
        speed={0.4} 
        color="#4a7fb5"
        emissive="#2d5a87"
        initialAngle={4.2}
        hasAtmosphere
        atmosphereColor="#88ccff"
        rotationSpeed={0.008}
        tilt={0.41}
      />
      
      {/* Mars - red/orange, smaller */}
      <Planet 
        radius={0.35} 
        orbitRadius={15} 
        speed={0.25} 
        color="#c45c3a"
        emissive="#8b3a20"
        initialAngle={1.3}
        rotationSpeed={0.007}
        tilt={0.44}
      />
      
      {/* Saturn-like - with prominent rings */}
      <Planet 
        radius={1.1} 
        orbitRadius={20} 
        speed={0.12} 
        color="#e4c88c"
        emissive="#c4a060"
        initialAngle={3.7}
        hasRing
        ringColor="#d4b896"
        rotationSpeed={0.012}
        tilt={0.47}
      />
    </>
  );
};

export const SolarSystem = ({ scrollProgress }: SolarSystemProps) => {
  return (
    <Canvas
      camera={{ position: [0, 3, 30], fov: 55 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <SolarSystemScene scrollProgress={scrollProgress} />
    </Canvas>
  );
};

export default SolarSystem;