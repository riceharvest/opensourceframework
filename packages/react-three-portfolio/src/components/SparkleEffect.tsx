"use client";

import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { useFrame, extend, ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Custom shader for realistic glowing sparkles
const SparkleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(1, 1, 1),
  },
  // Vertex Shader
  `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uTime;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      // Size attenuation
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec3 vColor;

    void main() {
      // Create a soft circle/glow
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float r = length(xy);

      // Soft edge: Gaussian-ish falloff
      float alpha = 1.0 - smoothstep(0.3, 0.5, r);

      // Discard outer pixels for performance and round shape
      if (alpha < 0.01) discard;

      gl_FragColor = vec4(vColor, alpha);
    }
  `
);

extend({ SparkleMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        sparkleMaterial: ThreeElement<typeof SparkleMaterial>;
      }
    }
  }
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

export const SparkleEffect = () => {
  const particlesRef = useRef<Particle[]>([]);
  const pointsRef = useRef<THREE.Points>(null);
  const nextSpawnTimeRef = useRef(0);
   
  const materialRef = useRef<any>(null);

  const [geometry] = useState(() => new THREE.BufferGeometry());

  useFrame((state, delta) => {
    const currentTime = state.clock.getElapsedTime();
    if (materialRef.current) {
        materialRef.current.uTime = currentTime;
    }

    // Spawn new sparkles - MORE particles for "full reality"
    if (currentTime > nextSpawnTimeRef.current) {
      const spawnCount = 4 + Math.floor(Math.random() * 5); // Increased spawn rate
      for (let i = 0; i < spawnCount; i++) {
        // Spawn within the orb volume mostly
        const anglePhi = Math.acos(2 * Math.random() - 1);
        const angleTheta = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 1/3) * 2.2; // Cube root for uniform distribution in sphere

        const position = new THREE.Vector3().setFromSphericalCoords(
          radius,
          anglePhi,
          angleTheta
        );

        // Gentle drift velocity
        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.5, // Faster movement
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        );

        // Add orbital motion
        const tangent = new THREE.Vector3(-position.z, 0, position.x).normalize().multiplyScalar(0.8);
        velocity.add(tangent);

        particlesRef.current.push({
          position,
          velocity,
          life: 0,
          maxLife: 1.5 + Math.random() * 1.5,
          size: 0.1 + Math.random() * 0.15, // SMALLER size for "sparkle" effect
          color: new THREE.Color().setHSL(0.7 + Math.random() * 0.15, 1.0, 0.9), // Very Bright
        });
      }
      nextSpawnTimeRef.current = currentTime + 0.05; // Faster spawn interval
    }

    // Update particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.life += delta;

      if (particle.life > particle.maxLife) {
        return false;
      }

      // Move particle
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Slight drag
      particle.velocity.multiplyScalar(0.98);

      // Swirling force towards center or around Y axis
      const toCenter = particle.position.clone().negate().normalize().multiplyScalar(0.2 * delta);
      particle.velocity.add(toCenter);

      return true;
    });

    // Update geometry
    if (particlesRef.current.length > 0 && pointsRef.current) {
      const positions = new Float32Array(particlesRef.current.length * 3);
      const colors = new Float32Array(particlesRef.current.length * 3);
      const sizes = new Float32Array(particlesRef.current.length);

      particlesRef.current.forEach((particle, i) => {
        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;

        const lifeRatio = particle.life / particle.maxLife;
        // Fade in and out
        const alpha = Math.sin(Math.PI * lifeRatio);

        colors[i * 3] = particle.color.r * alpha; // Premultiplied-ish
        colors[i * 3 + 1] = particle.color.g * alpha;
        colors[i * 3 + 2] = particle.color.b * alpha;

        sizes[i] = particle.size * alpha;
      });

      const geo = pointsRef.current.geometry;
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Custom attribute

      geo.attributes.position!.needsUpdate = true;
      geo.attributes.color!.needsUpdate = true;
      geo.attributes.size!.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <sparkleMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
