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

// Procedural noise texture generator for realistic planet surfaces
const useProceduralTexture = (
  baseColor: string,
  variationColor: string,
  noiseScale: number = 4,
  resolution: number = 256
) => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d')!;
    
    // Base color fill
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, resolution, resolution);
    
    // Add procedural noise pattern
    const imageData = ctx.getImageData(0, 0, resolution, resolution);
    const data = imageData.data;
    
    const baseRgb = hexToRgb(baseColor);
    const varRgb = hexToRgb(variationColor);
    
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const i = (y * resolution + x) * 4;
        
        // Multiple octaves of noise for realistic look
        const noise1 = Math.sin(x * noiseScale * 0.02) * Math.cos(y * noiseScale * 0.02);
        const noise2 = Math.sin(x * noiseScale * 0.05 + 1.5) * Math.cos(y * noiseScale * 0.03);
        const noise3 = Math.sin(x * noiseScale * 0.01) * Math.sin(y * noiseScale * 0.04 + 2.3);
        const combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) / 1.75;
        
        const blend = (combinedNoise + 1) * 0.5;
        
        data[i] = Math.floor(baseRgb.r + (varRgb.r - baseRgb.r) * blend);
        data[i + 1] = Math.floor(baseRgb.g + (varRgb.g - baseRgb.g) * blend);
        data[i + 2] = Math.floor(baseRgb.b + (varRgb.b - baseRgb.b) * blend);
        data[i + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, [baseColor, variationColor, noiseScale, resolution]);
};

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 128, g: 128, b: 128 };
};

// Realistic planet component with procedural surface
interface PlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  baseColor: string;
  variationColor: string;
  emissive?: string;
  initialAngle?: number;
  hasRing?: boolean;
  ringColor?: string;
  ringVariation?: string;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
  rotationSpeed?: number;
  tilt?: number;
  noiseScale?: number;
}

const Planet = ({ 
  radius, 
  orbitRadius, 
  speed, 
  baseColor,
  variationColor,
  emissive,
  initialAngle = 0, 
  hasRing,
  ringColor = '#d4a574',
  ringVariation = '#8b7355',
  hasAtmosphere,
  atmosphereColor = '#88ccff',
  rotationSpeed = 0.01,
  tilt = 0,
  noiseScale = 4
}: PlanetProps) => {
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Generate procedural texture
  const texture = useProceduralTexture(baseColor, variationColor, noiseScale, 512);
  const ringTexture = useProceduralTexture(ringColor, ringVariation, 8, 256);
  
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
        {/* Planet body with procedural texture */}
        <Sphere ref={meshRef} args={[radius, 64, 64]}>
          <meshStandardMaterial 
            map={texture}
            emissive={emissive || baseColor}
            emissiveIntensity={0.05}
            roughness={0.85}
            metalness={0.1}
          />
        </Sphere>
        
        {/* Atmosphere layers */}
        {hasAtmosphere && (
          <>
            <Sphere args={[radius * 1.03, 48, 48]}>
              <meshBasicMaterial 
                color={atmosphereColor} 
                transparent 
                opacity={0.2} 
                side={THREE.BackSide}
              />
            </Sphere>
            <Sphere args={[radius * 1.08, 48, 48]}>
              <meshBasicMaterial 
                color={atmosphereColor} 
                transparent 
                opacity={0.1} 
                side={THREE.BackSide}
              />
            </Sphere>
            <Sphere args={[radius * 1.15, 32, 32]}>
              <meshBasicMaterial 
                color={atmosphereColor} 
                transparent 
                opacity={0.05} 
                side={THREE.BackSide}
              />
            </Sphere>
          </>
        )}
        
        {/* Enhanced ring system with texture */}
        {hasRing && (
          <group rotation={[Math.PI / 2.3, 0.1, 0]}>
            <mesh>
              <ringGeometry args={[radius * 1.3, radius * 1.6, 128]} />
              <meshBasicMaterial 
                map={ringTexture}
                transparent 
                opacity={0.7} 
                side={THREE.DoubleSide} 
              />
            </mesh>
            <mesh>
              <ringGeometry args={[radius * 1.65, radius * 1.9, 128]} />
              <meshBasicMaterial 
                color={ringColor}
                transparent 
                opacity={0.5} 
                side={THREE.DoubleSide} 
              />
            </mesh>
            <mesh>
              <ringGeometry args={[radius * 1.95, radius * 2.3, 128]} />
              <meshBasicMaterial 
                color={ringVariation}
                transparent 
                opacity={0.3} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// Enhanced orbit ring with glow effect
const OrbitRing = ({ radius }: { radius: number }) => {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Main visible orbit line */}
      <mesh>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 256]} />
        <meshBasicMaterial color="#f5c36a" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <ringGeometry args={[radius - 0.08, radius + 0.08, 256]} />
        <meshBasicMaterial color="#f5c36a" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <ringGeometry args={[radius - 0.15, radius + 0.15, 256]} />
        <meshBasicMaterial color="#d4a855" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
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
      
      {/* Orbit rings - now clearly visible */}
      <OrbitRing radius={5} />
      <OrbitRing radius={7.5} />
      <OrbitRing radius={11} />
      <OrbitRing radius={15} />
      <OrbitRing radius={20} />
      
      {/* Mercury - cratered gray/brown surface */}
      <Planet 
        radius={0.25} 
        orbitRadius={5} 
        speed={0.9} 
        baseColor="#8c7853"
        variationColor="#5a4a3a"
        emissive="#3a3025"
        initialAngle={0.5}
        rotationSpeed={0.002}
        noiseScale={8}
      />
      
      {/* Venus - yellowish with thick swirling atmosphere */}
      <Planet 
        radius={0.45} 
        orbitRadius={7.5} 
        speed={0.6} 
        baseColor="#e6c87a"
        variationColor="#c9a050"
        emissive="#8b7530"
        initialAngle={2.1}
        hasAtmosphere
        atmosphereColor="#ffe4a0"
        rotationSpeed={0.001}
        noiseScale={3}
      />
      
      {/* Earth - blue oceans with green/brown continents */}
      <Planet 
        radius={0.5} 
        orbitRadius={11} 
        speed={0.4} 
        baseColor="#4a7fb5"
        variationColor="#3d6545"
        emissive="#1a3550"
        initialAngle={4.2}
        hasAtmosphere
        atmosphereColor="#88ccff"
        rotationSpeed={0.008}
        tilt={0.41}
        noiseScale={5}
      />
      
      {/* Mars - red/orange with darker regions */}
      <Planet 
        radius={0.35} 
        orbitRadius={15} 
        speed={0.25} 
        baseColor="#c45c3a"
        variationColor="#8b3a20"
        emissive="#4a1a10"
        initialAngle={1.3}
        rotationSpeed={0.007}
        tilt={0.44}
        noiseScale={6}
      />
      
      {/* Saturn-like - banded gas giant with rings */}
      <Planet 
        radius={1.1} 
        orbitRadius={20} 
        speed={0.12} 
        baseColor="#e4c88c"
        variationColor="#c4a060"
        emissive="#6b5530"
        initialAngle={3.7}
        hasRing
        ringColor="#d4b896"
        ringVariation="#8b7355"
        rotationSpeed={0.012}
        tilt={0.47}
        noiseScale={2}
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