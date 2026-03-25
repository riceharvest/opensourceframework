import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment as DreiEnvironment, ContactShadows } from '@react-three/drei';
import React from 'react';

export interface ReactThreePortfolioCanvasProps extends Omit<React.ComponentProps<typeof Canvas>, 'children'> {
  children?: React.ReactNode;
  enableOrbitControls?: boolean;
  orbitControlsProps?: object;
  enableEnvironment?: boolean;
  environmentPreset?: 'city' | 'dawn' | 'night' | 'studio' | 'sunset' | 'warehouse';
  enableContactShadows?: boolean;
  contactShadowsProps?: object;
  camera?: {
    position: [number, number, number];
    fov?: number;
  };
  lights?: boolean | object;
  gl?: object;
  onCreated?: (state: any) => void;
}

export function ReactThreePortfolioCanvas({
  children,
  enableOrbitControls = true,
  orbitControlsProps = {},
  enableEnvironment = true,
  environmentPreset = 'city',
  enableContactShadows = true,
  contactShadowsProps = {},
  camera = { position: [0, 0, 5], fov: 50 },
  lights = true,
  gl = {},
  onCreated,
  ...canvasProps
}: ReactThreePortfolioCanvasProps) {
  return (
    <Canvas
      camera={{ position: camera.position, fov: camera.fov }}
      gl={{ antialias: true, ...gl }}
      onCreated={onCreated}
      {...canvasProps}
    >
      {lights && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
        </>
      )}

      {enableEnvironment && <DreiEnvironment preset={environmentPreset} />}

      {children}

      {enableContactShadows && (
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.6}
          scale={20}
          blur={2}
          far={4}
          {...contactShadowsProps}
        />
      )}

      {enableOrbitControls && <OrbitControls {...orbitControlsProps} />}
    </Canvas>
  );
}
