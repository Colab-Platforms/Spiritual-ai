import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Stars, Sphere, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader for realistic planet atmosphere glow
const AtmosphereShaderMaterial = shaderMaterial(
  {
    glowColor: new THREE.Color('#88ccff'),
    viewVector: new THREE.Vector3(0, 0, 1),
    c: 0.5,
    p: 4.0,
  },
  // Vertex shader
  `
    uniform vec3 viewVector;
    varying float intensity;
    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      vec3 vNormel = normalize(normalMatrix * viewVector);
      intensity = pow(c - dot(vNormal, vNormel), p);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 glowColor;
    varying float intensity;
    void main() {
      vec3 glow = glowColor * intensity;
      gl_FragColor = vec4(glow, intensity * 0.8);
    }
  `
);

extend({ AtmosphereShaderMaterial });

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

// Enhanced procedural texture generator for realistic planet surfaces
const useRealisticPlanetTexture = (config: {
  type: 'terrestrial' | 'gas' | 'rocky' | 'ice';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  cloudColor?: string;
  hasOceans?: boolean;
  oceanColor?: string;
  hasClouds?: boolean;
  hasCityLights?: boolean;
  resolution?: number;
}) => {
  return useMemo(() => {
    const resolution = config.resolution || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution / 2;
    const ctx = canvas.getContext('2d')!;
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 128, g: 128, b: 128 };
    };
    
    // Improved noise function with multiple octaves
    const noise = (x: number, y: number, octaves: number = 6, persistence: number = 0.5) => {
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;
      
      for (let i = 0; i < octaves; i++) {
        value += Math.sin(x * frequency * 0.02 + Math.cos(y * frequency * 0.015)) * 
                 Math.cos(y * frequency * 0.018 + Math.sin(x * frequency * 0.012)) * amplitude;
        value += Math.sin((x + y) * frequency * 0.01 + i * 1.5) * amplitude * 0.5;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }
      
      return (value / maxValue + 1) * 0.5;
    };
    
    // Turbulence for gas giants
    const turbulence = (x: number, y: number) => {
      let value = 0;
      let size = 32;
      while (size >= 1) {
        value += Math.abs(Math.sin(x / size) * Math.cos(y / size)) * size;
        size /= 2;
      }
      return value / 64;
    };
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const primary = hexToRgb(config.primaryColor);
    const secondary = hexToRgb(config.secondaryColor);
    const tertiary = config.tertiaryColor ? hexToRgb(config.tertiaryColor) : secondary;
    const ocean = config.oceanColor ? hexToRgb(config.oceanColor) : { r: 30, g: 80, b: 140 };
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        
        let r, g, b;
        
        if (config.type === 'terrestrial') {
          // Earth-like with continents and oceans
          const continentNoise = noise(x, y, 8, 0.6);
          const detailNoise = noise(x * 2, y * 2, 4, 0.4);
          const mountainNoise = noise(x * 4, y * 4, 3, 0.3);
          
          const isOcean = config.hasOceans && continentNoise < 0.45;
          const isCoast = config.hasOceans && continentNoise >= 0.45 && continentNoise < 0.5;
          const isDesert = continentNoise > 0.7 && Math.abs(y - canvas.height / 2) < canvas.height * 0.2;
          const isMountain = continentNoise > 0.65 && mountainNoise > 0.5;
          
          if (isOcean) {
            const depth = continentNoise / 0.45;
            r = Math.floor(ocean.r * (0.6 + depth * 0.4) + detailNoise * 15);
            g = Math.floor(ocean.g * (0.7 + depth * 0.3) + detailNoise * 20);
            b = Math.floor(ocean.b * (0.8 + depth * 0.2) + detailNoise * 25);
          } else if (isCoast) {
            r = Math.floor(180 + detailNoise * 30);
            g = Math.floor(170 + detailNoise * 25);
            b = Math.floor(130 + detailNoise * 20);
          } else if (isDesert) {
            r = Math.floor(tertiary.r * (0.9 + detailNoise * 0.2));
            g = Math.floor(tertiary.g * (0.85 + detailNoise * 0.15));
            b = Math.floor(tertiary.b * (0.8 + detailNoise * 0.1));
          } else if (isMountain) {
            const snow = mountainNoise > 0.7 ? 0.8 : 0;
            r = Math.floor(secondary.r * (0.6 + mountainNoise * 0.3) + snow * 150);
            g = Math.floor(secondary.g * (0.6 + mountainNoise * 0.3) + snow * 150);
            b = Math.floor(secondary.b * (0.6 + mountainNoise * 0.3) + snow * 150);
          } else {
            // Land with vegetation
            const vegBlend = detailNoise;
            r = Math.floor(primary.r * vegBlend + secondary.r * (1 - vegBlend));
            g = Math.floor(primary.g * vegBlend + secondary.g * (1 - vegBlend));
            b = Math.floor(primary.b * vegBlend + secondary.b * (1 - vegBlend));
          }
        } else if (config.type === 'gas') {
          // Gas giant with bands
          const bandNoise = noise(x * 0.5, y * 3, 4, 0.7);
          const stormNoise = turbulence(x, y);
          const latBand = Math.sin(y / canvas.height * Math.PI * 12 + bandNoise * 2);
          
          const blend = (latBand + 1) * 0.5;
          r = Math.floor(primary.r * blend + secondary.r * (1 - blend) + stormNoise * 20);
          g = Math.floor(primary.g * blend + secondary.g * (1 - blend) + stormNoise * 15);
          b = Math.floor(primary.b * blend + secondary.b * (1 - blend) + stormNoise * 10);
        } else if (config.type === 'rocky') {
          // Rocky planet with craters
          const baseNoise = noise(x, y, 6, 0.5);
          const craterNoise = noise(x * 3, y * 3, 3, 0.6);
          
          const blend = baseNoise;
          r = Math.floor(primary.r * blend + secondary.r * (1 - blend) - craterNoise * 30);
          g = Math.floor(primary.g * blend + secondary.g * (1 - blend) - craterNoise * 25);
          b = Math.floor(primary.b * blend + secondary.b * (1 - blend) - craterNoise * 20);
        } else {
          // Ice planet
          const iceNoise = noise(x, y, 5, 0.6);
          const crackNoise = noise(x * 5, y * 5, 2, 0.8);
          
          r = Math.floor(200 + iceNoise * 55 - crackNoise * 40);
          g = Math.floor(210 + iceNoise * 45 - crackNoise * 30);
          b = Math.floor(230 + iceNoise * 25 - crackNoise * 20);
        }
        
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
        data[i + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
    return texture;
  }, [config]);
};

// Cloud layer texture
const useCloudTexture = (resolution: number = 512) => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution / 2;
    const ctx = canvas.getContext('2d')!;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        
        // Multiple noise layers for realistic clouds
        let cloud = 0;
        cloud += Math.sin(x * 0.02 + Math.cos(y * 0.015)) * 0.3;
        cloud += Math.sin(x * 0.05 + y * 0.03) * Math.cos(y * 0.02) * 0.4;
        cloud += Math.sin((x + y) * 0.015) * 0.2;
        cloud += Math.sin(x * 0.08) * Math.cos(y * 0.06) * 0.15;
        
        cloud = (cloud + 1) * 0.5;
        const alpha = cloud > 0.4 ? (cloud - 0.4) * 2 : 0;
        
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = Math.floor(alpha * 180);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [resolution]);
};

// City lights texture for night side
const useCityLightsTexture = (resolution: number = 512) => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution / 2;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Random city clusters
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width;
      const y = canvas.height * 0.2 + Math.random() * canvas.height * 0.6; // Concentrate in mid-latitudes
      const size = Math.random() * 3 + 1;
      
      ctx.fillStyle = `rgba(255, ${200 + Math.random() * 55}, ${100 + Math.random() * 100}, ${0.5 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add smaller surrounding lights
      for (let j = 0; j < 5; j++) {
        const ox = x + (Math.random() - 0.5) * 15;
        const oy = y + (Math.random() - 0.5) * 10;
        ctx.fillStyle = `rgba(255, ${220 + Math.random() * 35}, ${150 + Math.random() * 50}, ${0.3 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(ox, oy, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [resolution]);
};

// Ring texture for Saturn-like planets
const useRingTexture = (config: { 
  innerColor: string; 
  outerColor: string;
  resolution?: number;
}) => {
  return useMemo(() => {
    const resolution = config.resolution || 512;
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 200, g: 180, b: 150 };
    };
    
    const inner = hexToRgb(config.innerColor);
    const outer = hexToRgb(config.outerColor);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let x = 0; x < canvas.width; x++) {
      const t = x / canvas.width;
      const ringNoise = Math.sin(x * 0.3) * 0.1 + Math.sin(x * 0.7) * 0.05;
      
      // Create ring gaps
      let alpha = 0.8;
      if (t > 0.3 && t < 0.35) alpha = 0.2;
      if (t > 0.5 && t < 0.52) alpha = 0.3;
      if (t > 0.7 && t < 0.73) alpha = 0.15;
      
      alpha += ringNoise;
      
      data[x * 4] = Math.floor(inner.r * (1 - t) + outer.r * t);
      data[x * 4 + 1] = Math.floor(inner.g * (1 - t) + outer.g * t);
      data[x * 4 + 2] = Math.floor(inner.b * (1 - t) + outer.b * t);
      data[x * 4 + 3] = Math.floor(alpha * 255);
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [config]);
};

// Realistic planet component with multiple texture layers
interface RealisticPlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  planetType: 'terrestrial' | 'gas' | 'rocky' | 'ice';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  initialAngle?: number;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  hasClouds?: boolean;
  hasOceans?: boolean;
  oceanColor?: string;
  hasCityLights?: boolean;
  hasRing?: boolean;
  ringInnerColor?: string;
  ringOuterColor?: string;
  rotationSpeed?: number;
  tilt?: number;
  specularIntensity?: number;
}

const RealisticPlanet = ({
  radius,
  orbitRadius,
  speed,
  planetType,
  primaryColor,
  secondaryColor,
  tertiaryColor,
  initialAngle = 0,
  hasAtmosphere,
  atmosphereColor = '#88ccff',
  atmosphereIntensity = 1,
  hasClouds,
  hasOceans,
  oceanColor,
  hasCityLights,
  hasRing,
  ringInnerColor = '#d4b896',
  ringOuterColor = '#8b7355',
  rotationSpeed = 0.005,
  tilt = 0,
  specularIntensity = 0.3,
}: RealisticPlanetProps) => {
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  // Generate textures
  const surfaceTexture = useRealisticPlanetTexture({
    type: planetType,
    primaryColor,
    secondaryColor,
    tertiaryColor,
    hasOceans,
    oceanColor,
    resolution: 1024,
  });
  
  const cloudTexture = useCloudTexture(512);
  const cityLightsTexture = useCityLightsTexture(512);
  const ringTexture = useRingTexture({ 
    innerColor: ringInnerColor, 
    outerColor: ringOuterColor 
  });
  
  useFrame(({ clock, camera }) => {
    if (planetRef.current) {
      const t = clock.getElapsedTime() * speed + initialAngle;
      planetRef.current.position.x = Math.cos(t) * orbitRadius;
      planetRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += rotationSpeed * 1.2;
    }
    // Update atmosphere shader with camera position
    if (atmosphereRef.current && atmosphereRef.current.material) {
      const material = atmosphereRef.current.material as any;
      if (material.uniforms && material.uniforms.viewVector) {
        material.uniforms.viewVector.value = camera.position;
      }
    }
  });

  return (
    <group ref={planetRef}>
      <group rotation={[tilt, 0, 0]}>
        {/* Main planet surface */}
        <Sphere ref={meshRef} args={[radius, 128, 64]}>
          <meshStandardMaterial
            map={surfaceTexture}
            roughness={0.8}
            metalness={0.1}
            bumpScale={0.02}
          />
        </Sphere>
        
        {/* Specular highlight layer for oceans */}
        {hasOceans && (
          <Sphere args={[radius * 1.001, 64, 32]}>
            <meshPhongMaterial
              transparent
              opacity={specularIntensity}
              shininess={100}
              specular={new THREE.Color('#ffffff')}
              color="#000000"
            />
          </Sphere>
        )}
        
        {/* City lights on night side */}
        {hasCityLights && (
          <Sphere args={[radius * 1.002, 64, 32]}>
            <meshBasicMaterial
              map={cityLightsTexture}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
        )}
        
        {/* Cloud layer */}
        {hasClouds && (
          <Sphere ref={cloudRef} args={[radius * 1.015, 64, 32]}>
            <meshStandardMaterial
              map={cloudTexture}
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </Sphere>
        )}
        
        {/* Atmospheric glow layers */}
        {hasAtmosphere && (
          <>
            <Sphere args={[radius * 1.04, 48, 24]}>
              <meshBasicMaterial
                color={atmosphereColor}
                transparent
                opacity={0.15 * atmosphereIntensity}
                side={THREE.BackSide}
              />
            </Sphere>
            <Sphere args={[radius * 1.08, 48, 24]}>
              <meshBasicMaterial
                color={atmosphereColor}
                transparent
                opacity={0.1 * atmosphereIntensity}
                side={THREE.BackSide}
              />
            </Sphere>
            <Sphere ref={atmosphereRef} args={[radius * 1.15, 32, 16]}>
              <meshBasicMaterial
                color={atmosphereColor}
                transparent
                opacity={0.05 * atmosphereIntensity}
                side={THREE.BackSide}
              />
            </Sphere>
            {/* Rim lighting effect */}
            <Sphere args={[radius * 1.02, 64, 32]}>
              <meshBasicMaterial
                color={atmosphereColor}
                transparent
                opacity={0.3 * atmosphereIntensity}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </Sphere>
          </>
        )}
        
        {/* Saturn-like ring system */}
        {hasRing && (
          <group rotation={[Math.PI / 2.2, 0.1, 0]}>
            <mesh>
              <ringGeometry args={[radius * 1.4, radius * 2.4, 128]} />
              <meshBasicMaterial
                map={ringTexture}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Ring shadow/glow */}
            <mesh>
              <ringGeometry args={[radius * 1.38, radius * 2.42, 64]} />
              <meshBasicMaterial
                color={ringInnerColor}
                transparent
                opacity={0.15}
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

// Mouse parallax camera controller with mobile-responsive zoom
const CameraController = ({ scrollProgress }: { scrollProgress: number }) => {
  const { camera, size } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0, z: 30 });
  const isMobile = size.width < 768;
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame(() => {
    // Adjust camera distance based on screen size - zoom out more on mobile
    const mobileZoomOffset = isMobile ? 20 : 0;
    const baseZ = 30 + mobileZoomOffset - scrollProgress * 25;
    targetPos.current.x = isMobile ? 0 : mousePos.current.x * 4;
    targetPos.current.y = (isMobile ? 0 : mousePos.current.y * 3) + 3;
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
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 5, 5]} intensity={0.5} color="#fff8e0" />
      
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
      
      {/* Mercury - small, heavily cratered rocky planet */}
      <RealisticPlanet
        radius={0.25}
        orbitRadius={5}
        speed={0.9}
        planetType="rocky"
        primaryColor="#9a8878"
        secondaryColor="#5a4a3a"
        initialAngle={0.5}
        rotationSpeed={0.002}
      />
      
      {/* Venus - thick atmosphere, yellowish clouds */}
      <RealisticPlanet
        radius={0.45}
        orbitRadius={7.5}
        speed={0.6}
        planetType="terrestrial"
        primaryColor="#e6c87a"
        secondaryColor="#c9a050"
        tertiaryColor="#d4a855"
        initialAngle={2.1}
        hasAtmosphere
        atmosphereColor="#ffe4a0"
        atmosphereIntensity={1.5}
        hasClouds
        rotationSpeed={0.001}
      />
      
      {/* Earth - blue oceans, green continents, white clouds, city lights */}
      <RealisticPlanet
        radius={0.5}
        orbitRadius={11}
        speed={0.4}
        planetType="terrestrial"
        primaryColor="#2d5a27"
        secondaryColor="#3d6545"
        tertiaryColor="#c9a050"
        oceanColor="#1a5080"
        initialAngle={4.2}
        hasAtmosphere
        atmosphereColor="#88ccff"
        atmosphereIntensity={1.2}
        hasClouds
        hasOceans
        hasCityLights
        rotationSpeed={0.008}
        tilt={0.41}
        specularIntensity={0.5}
      />
      
      {/* Mars - red/orange with darker regions */}
      <RealisticPlanet
        radius={0.35}
        orbitRadius={15}
        speed={0.25}
        planetType="rocky"
        primaryColor="#c45c3a"
        secondaryColor="#8b3a20"
        tertiaryColor="#d4704a"
        initialAngle={1.3}
        hasAtmosphere
        atmosphereColor="#ffccaa"
        atmosphereIntensity={0.3}
        rotationSpeed={0.007}
        tilt={0.44}
      />
      
      {/* Saturn-like - banded gas giant with spectacular rings */}
      <RealisticPlanet
        radius={1.1}
        orbitRadius={20}
        speed={0.12}
        planetType="gas"
        primaryColor="#e4c88c"
        secondaryColor="#c4a060"
        tertiaryColor="#d4b078"
        initialAngle={3.7}
        hasAtmosphere
        atmosphereColor="#f5e6c8"
        atmosphereIntensity={0.4}
        hasRing
        ringInnerColor="#d4b896"
        ringOuterColor="#8b7355"
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
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '100vw',
        height: '100%',
        overflow: 'hidden'
      }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <SolarSystemScene scrollProgress={scrollProgress} />
    </Canvas>
  );
};

export default SolarSystem;