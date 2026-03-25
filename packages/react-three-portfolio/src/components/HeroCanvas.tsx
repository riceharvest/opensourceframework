"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroOrb } from './HeroOrb';
import { Eye } from './Eye';
import { LightningEffect } from './LightningEffect';
import { SparkleEffect } from './SparkleEffect';
import { PostProcessing } from './PostProcessing';

export function HeroCanvas() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: 0 // No tone mapping to keep colors vibrant
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          {/* Backlight for transparency */}
          <pointLight position={[0, 0, -5]} intensity={2.0} color="#b537f2" />

          {/* Rim lights */}
          <pointLight position={[10, 5, 5]} intensity={1.5} color="#7a00ff" />
          <pointLight position={[-10, -5, 5]} intensity={1.0} color="#440088" />

          <Eye />
          <HeroOrb />
          <LightningEffect />
          <SparkleEffect />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
