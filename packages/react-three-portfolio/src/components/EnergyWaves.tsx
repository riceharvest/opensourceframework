"use client";

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useFrame, extend, ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Energy wave material with pulsating effect
const EnergyWaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#9d4edd'), // Vibrant purple
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float uTime;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);

      vec3 pos = position;

      // Multiple pulsating waves
      float wave1 = sin(length(pos) * 3.0 - uTime * 2.0) * 0.03;
      float wave2 = cos(length(pos) * 5.0 - uTime * 1.5) * 0.02;
      float pulse = sin(uTime * 2.5) * 0.5 + 0.5;

      // Expand and contract
      float expansion = 0.05 * pulse;
      pos += normal * (wave1 + wave2 + expansion);

      vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform vec3 uColor;
    uniform float uTime;

    void main() {
      vec3 normal = normalize(vNormal);

      // Animated wave patterns
      float wave = sin(vUv.x * 10.0 - uTime * 3.0) * cos(vUv.y * 10.0 - uTime * 2.0);
      float pulse = sin(uTime * 2.5) * 0.5 + 0.5;

      // Flowing pattern
      float pattern = sin((vUv.x + vUv.y) * 15.0 - uTime * 4.0) * 0.5 + 0.5;

      // Combine effects
      float intensity = wave * pattern * pulse;

      // Alpha based on pattern
      float alpha = (intensity * 0.6 + 0.4) * pulse * 0.7;

      gl_FragColor = vec4(uColor, alpha);
    }
  `
);

extend({ EnergyWaveMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        energyWaveMaterial: ThreeElement<typeof EnergyWaveMaterial>;
      }
    }
  }
}

export const EnergyWaves = () => {
  const meshRef = useRef<THREE.Mesh>(null);
   
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }

    if (meshRef.current) {
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.15, 64, 64]} />
      <energyWaveMaterial ref={materialRef} transparent depthWrite={false} />
    </mesh>
  );
};
