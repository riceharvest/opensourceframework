"use client";

import * as THREE from 'three';
import React, { useRef } from 'react';
import { useFrame, extend, ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Custom shader material for the Orb
const OrbMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uColor1: new THREE.Color('#2a0044'), // Deeper, Darker Purple for core transparency
    uColor2: new THREE.Color('#9d00ff'), // Electric Purple for rim
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;
    uniform vec2 uMouse;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);

      vec3 pos = position;

      // Dynamic noise parameters
      float noiseFreq = 0.9;
      float noiseAmp = 0.25;
      float noiseSpeed = 1.2;

      // Layered noise for more detail
      float n1 = snoise(pos * noiseFreq + uTime * noiseSpeed);
      float n2 = snoise(pos * noiseFreq * 2.0 - uTime * noiseSpeed * 1.5) * 0.5;

      float finalNoise = n1 + n2;

      // Pulsating expansion (heartbeat style)
      // Sharp attack, slow decay
      float pulse = exp(-mod(uTime * 1.5, 3.14159)) * 0.2;

      // Combine noise and pulse
      pos += normal * (finalNoise * noiseAmp + pulse);

      vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -modelViewPosition.xyz;
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uTime;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel effect for edge glow
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0); // Slightly softer fresnel power

      // Pulsing internal energy
      float energyPulse = sin(uTime * 3.0) * 0.5 + 0.5;

      // Wave effect moving up the orb
      float wave = sin(vViewPosition.y * 2.0 - uTime * 4.0);
      float waveIntensity = smoothstep(0.8, 1.0, wave) * 0.5;

      // Base color mix
      // uColor1 is core, uColor2 is rim
      vec3 color = mix(uColor1, uColor2, fresnel + energyPulse * 0.1);

      // Add wave highlight
      color += uColor2 * waveIntensity;

      // Add a modest glow to the rim
      color += uColor2 * fresnel * 0.8;

      // Transparency logic
      // Pulse affects alpha slightly for "breathing" effect
      float alpha = 0.02 + fresnel * 0.5 + waveIntensity * 0.2;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

// Register the shader material
extend({ OrbMaterial });

// Type definition for JSX
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        orbMaterial: ThreeElement<typeof OrbMaterial>;
      }
    }
  }
}

export const HeroOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
   
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 128, 128]} />
      {/*
        Using NormalBlending for proper transparency.
        side={FrontSide} ensures we look through the front face into the inside.
        depthWrite={false} avoids z-buffer sorting issues with the lightning inside.
      */}
      <orbMaterial
        ref={materialRef}
        transparent
        side={THREE.FrontSide}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </mesh>
  );
};
