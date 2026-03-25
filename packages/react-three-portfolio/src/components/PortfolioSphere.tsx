import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export interface PortfolioSphereProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  animate?: boolean;
  animationType?: 'float' | 'pulse' | 'rotate' | 'none';
  animationSpeed?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  castShadow?: boolean;
  receiveShadow?: boolean;
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  children?: React.ReactNode;
}

export function PortfolioSphere({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#10b981',
  metalness = 0.6,
  roughness = 0.3,
  animate = true,
  animationType = 'float',
  animationSpeed = 1,
  onClick,
  onPointerOver,
  onPointerOut,
  castShadow = true,
  receiveShadow = false,
  radius = 0.5,
  widthSegments = 32,
  heightSegments = 32,
  children,
}: PortfolioSphereProps) {
  const meshRef = useRef<Mesh>(null);
  const initialY = position[1];
  const initialScale = typeof scale === 'number' ? scale : 1;

  useFrame((state, delta) => {
    if (animate && meshRef.current) {
      const time = state.clock.elapsedTime * animationSpeed;
      switch (animationType) {
        case 'float':
          meshRef.current.position.y = initialY + Math.sin(time) * 0.15;
          break;
        case 'pulse': {
          const pulse = 1 + Math.sin(time * 2) * 0.1;
          meshRef.current.scale.setScalar(initialScale * pulse);
          break;
        }
        case 'rotate':
          meshRef.current.rotation.y += delta * animationSpeed;
          break;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
      {children}
    </mesh>
  );
}
