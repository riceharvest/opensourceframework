"use client";

import * as THREE from "three";
import React from "react";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

export const PostProcessing = () => {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.6} // Only very bright things (lightning, extreme rim) should bloom
        luminanceSmoothing={0.9}
        height={300}
      />

      <Noise
        opacity={0.05}
        blendFunction={BlendFunction.OVERLAY}
      />

      <Vignette
        offset={0.1}
        darkness={1.1}
      />

      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.001, 0.001)}
      />
    </EffectComposer>
  )
}
