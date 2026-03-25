import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export interface PortfolioBoxProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  children?: React.ReactNode;
  animate?: boolean;
  animationType?: 'float' | 'rotate' | 'none';
  animationSpeed?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  castShadow?: boolean;
  receiveShadow?: boolean;
  args?: [number, number, number];
}

export function PortfolioBox({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#6366f1',
  metalness = 0.5,
  roughness = 0.5,
  children,
  animate = true,
  animationType = 'float',
  animationSpeed = 1,
  onClick,
  onPointerOver,
  onPointerOut,
  castShadow = true,
  receiveShadow = false,
  args = [1, 1, 1],
}: PortfolioBoxProps) {
  const meshRef = useRef<Mesh>(null);
  const initialY = position[1];

  useFrame((state, delta) => {
    if (animate && meshRef.current) {
      const time = state.clock.elapsedTime * animationSpeed;
      switch (animationType) {
        case 'float':
          meshRef.current.position.y = initialY + Math.sin(time) * 0.1;
          break;
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
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
      {children}
    </mesh>
  );
}
