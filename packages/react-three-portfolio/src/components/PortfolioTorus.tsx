import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export interface PortfolioTorusProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  animate?: boolean;
  animationType?: 'rotate' | 'none';
  animationSpeed?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  castShadow?: boolean;
  receiveShadow?: boolean;
  radius?: number;
  tube?: number;
  radialSegments?: number;
  tubularSegments?: number;
  arc?: number;
  children?: React.ReactNode;
}

export function PortfolioTorus({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#f59e0b',
  metalness = 0.7,
  roughness = 0.2,
  animate = true,
  animationType = 'rotate',
  animationSpeed = 1,
  onClick,
  onPointerOver,
  onPointerOut,
  castShadow = true,
  receiveShadow = false,
  radius = 0.5,
  tube = 0.2,
  radialSegments = 16,
  tubularSegments = 100,
  arc = Math.PI * 2,
  children,
}: PortfolioTorusProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (animate && meshRef.current && animationType === 'rotate') {
      meshRef.current.rotation.x += delta * animationSpeed * 0.5;
      meshRef.current.rotation.y += delta * animationSpeed;
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
      <torusGeometry
        args={[radius, tube, radialSegments, tubularSegments, arc]}
      />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
      {children}
    </mesh>
  );
}
