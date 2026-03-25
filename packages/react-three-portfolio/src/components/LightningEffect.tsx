"use client";

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface Lightning {
  startTime: number;
  duration: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  intensity: number;
  color: THREE.Color;
}

export const LightningEffect = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightningsRef = useRef<Lightning[]>([]);
  const nextLightningTimeRef = useRef(0);
  const linesRef = useRef<THREE.LineSegments[]>([]);

  // Initialize some lightning strikes
  const generateLightning = (
    startPos: THREE.Vector3,
    endPos: THREE.Vector3,
    segments: number = 20
  ): THREE.Vector3[] => {
    const points: THREE.Vector3[] = [startPos.clone()];
    const direction = endPos.clone().sub(startPos);
    const length = direction.length();

    // Recursive midpoint displacement could be better, but iterative works for now
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const newPoint = startPos.clone().add(direction.clone().multiplyScalar(t));

      // Add jagged randomness that scales with distance from start/end
      // More jagged in the middle
      const displacement = Math.sin(t * Math.PI) * length * 0.25; // Increased displacement

      newPoint.x += (Math.random() - 0.5) * displacement;
      newPoint.y += (Math.random() - 0.5) * displacement;
      newPoint.z += (Math.random() - 0.5) * displacement;

      points.push(newPoint);
    }
    points.push(endPos.clone());
    return points;
  };

  useFrame((state) => {
    if (!groupRef.current) return;

    const currentTime = state.clock.getElapsedTime();

    // Spawn new lightning bolts
    if (currentTime > nextLightningTimeRef.current) {
      // "Lightning coming from within"
      // Start near center (radius < 1)
      const startRadius = Math.random() * 0.5; // Closer to core
      const startAnglePhi = Math.acos(2 * Math.random() - 1);
      const startAngleTheta = Math.random() * Math.PI * 2;

      const startPos = new THREE.Vector3().setFromSphericalCoords(
        startRadius,
        startAnglePhi,
        startAngleTheta
      );

      // End at or near surface (radius ~2)
      // Sometimes strike slightly outside
      const endRadius = 1.9 + Math.random() * 0.4;
      const endAnglePhi = Math.acos(2 * Math.random() - 1);
      const endAngleTheta = Math.random() * Math.PI * 2;

      const endPos = new THREE.Vector3().setFromSphericalCoords(
        endRadius,
        endAnglePhi,
        endAngleTheta
      );

      lightningsRef.current.push({
        startTime: currentTime,
        duration: 0.1 + Math.random() * 0.15, // Faster
        startPos,
        endPos,
        intensity: 2.0 + Math.random() * 2.0, // MUCH Brighter (up to 4.0)
        color: new THREE.Color().setHSL(0.75 + Math.random() * 0.1, 1.0, 0.9), // Very bright electric purple
      });

      // Spawn frequency - faster
      nextLightningTimeRef.current = currentTime + 0.05 + Math.random() * 0.15;
    }

    // Update existing lightning bolts
    lightningsRef.current = lightningsRef.current.filter((lightning) => {
      const elapsed = currentTime - lightning.startTime;

      // Find existing line for this lightning
      const existingLineIndex = linesRef.current.findIndex(
        (line) => line.userData.lightningId === lightning.startTime
      );

      // Clean up previous frame's line
      if (existingLineIndex >= 0) {
        const existingLine = linesRef.current[existingLineIndex];
        if (existingLine) {
          groupRef.current?.remove(existingLine);

          // Dispose resources
          existingLine.geometry.dispose();
          if (existingLine.material instanceof THREE.Material) {
            existingLine.material.dispose();
          } else if (Array.isArray(existingLine.material)) {
            existingLine.material.forEach(m => m.dispose());
          }

          linesRef.current.splice(existingLineIndex, 1);
        }
      }

      // If lightning is finished, don't create a new one
      if (elapsed > lightning.duration) {
        return false;
      }

      // Create new line geometry for current frame to animate the jitter
      // Increased segments for more jagged look
      const points = generateLightning(
        lightning.startPos,
        lightning.endPos,
        40 + Math.floor(Math.random() * 20)
      );

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const alpha = (1 - elapsed / lightning.duration) * lightning.intensity;

      // Flicker effect
      const flicker = Math.random() > 0.3 ? 1.0 : 0.2;

      const lineMaterial = new THREE.LineBasicMaterial({
        color: lightning.color,
        linewidth: 5, // Attempt thicker lines
        transparent: true,
        opacity: alpha * flicker,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const line = new THREE.LineSegments(geometry, lineMaterial);
      line.userData.lightningId = lightning.startTime;
      groupRef.current?.add(line);
      linesRef.current.push(line);

      return true;
    });
  });

  return <group ref={groupRef} />;
};
