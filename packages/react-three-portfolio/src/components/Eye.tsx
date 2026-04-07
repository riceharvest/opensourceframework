'use client'

import * as THREE from 'three';
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, extend, ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// --- SHADERS ---

// Realistic Eye Shader
const EyeMaterial = shaderMaterial(
  {
    uTime: 0,
    uIrisColor: new THREE.Color("#ffffff"),
    uPupilSize: 0.25,
    uIrisSize: 0.45,
  },
  // Vertex
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment
  `
    uniform float uTime;
    uniform vec3 uIrisColor;
    uniform float uPupilSize;
    uniform float uIrisSize;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec3 pos = normalize(vPosition);
      // Direction vector (0,0,1) for where the eye texture looks
      float dotZ = dot(pos, vec3(0.0, 0.0, 1.0));
      float angle = acos(dotZ);

      vec3 scleraColor = vec3(0.85, 0.85, 0.88);
      vec3 pupilColor = vec3(0.0);
      vec3 color = scleraColor;

      // Veins
      float veinNoise = snoise(pos.xy * 6.0);
      if (angle > uIrisSize) {
         float vein = smoothstep(0.45, 0.55, veinNoise);
         color = mix(color, vec3(0.8, 0.7, 0.7), vein * 0.05);
         // Vignette/Shadow at edges of sphere
         float edge = smoothstep(1.2, 2.5, angle);
         color *= (1.0 - edge * 0.8);
      }

      // Iris
      if (angle < uIrisSize) {
        vec2 irisUV = pos.xy;
        float r = length(irisUV);
        float theta = atan(irisUV.y, irisUV.x);

        float f1 = snoise(vec2(theta * 10.0, r * 3.0));
        float f2 = snoise(vec2(theta * 20.0, r * 8.0 - uTime * 0.2));
        float fibers = mix(f1, f2, 0.5);

        vec3 irisBase = uIrisColor;
        vec3 irisDetail = uIrisColor * 0.6; // Darker/greyer for contrast

        float outerRing = smoothstep(uIrisSize - 0.05, uIrisSize, angle);
        vec3 irisFill = mix(irisBase, irisDetail, fibers * 0.5 + 0.5);
        irisFill *= (1.0 - outerRing * 0.8); // Dark limbus

        color = irisFill;

        // Pupil
        if (angle < uIrisSize * uPupilSize) {
           color = pupilColor;
        } else {
           float pupilEdge = smoothstep(uIrisSize * uPupilSize, uIrisSize * uPupilSize + 0.03, angle);
           color = mix(pupilColor, color, pupilEdge);
        }
      }

      // Soft transition iris/sclera
      // (Simple override for now, can be improved)

      // Specular
      vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
      float spec = pow(max(dot(vNormal, lightDir), 0.0), 30.0);
      color += vec3(1.0) * spec * 0.6;

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ EyeMaterial });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        eyeMaterial: ThreeElement<typeof EyeMaterial>;
      }
    }
  }
}

const Eyelashes = ({ radius }: { radius: number }) => {
  const count = 40;
  const lashes = React.useMemo(() => {
    const temp = [];
    // Only cover top ~120 degrees
    const spreadAngle = Math.PI * 0.8;
    // Center around PI/2 (Front, Z+)
    const startAngle = Math.PI/2 - spreadAngle / 2;

    for (let i = 0; i < count; i++) {
        const ratio = i / (count - 1);
        const angle = startAngle + ratio * spreadAngle;

        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        // Lash geometry
        // Point outwards (radial) and curl up
        const rotY = -angle;

        temp.push({ x, z, rotY });
    }
    return temp;
  }, [radius]);

  return (
    <group position={[0, 0, 0]}> {/* Rim is at Y=0 */}
      {lashes.map((lash, i) => (
        <group key={i} position={[lash.x, 0, lash.z]} rotation={[0, lash.rotY, 0]}>
             {/* Curl up */}
             <mesh rotation={[-0.5, 0, 0]} position={[0, 0.1, 0]}>
                <coneGeometry args={[0.005, 0.25, 4]} />
                <meshBasicMaterial color="#000000" />
             </mesh>
        </group>
      ))}
    </group>
  );
};

export const Eye = () => {
  const eyeBallRef = useRef<THREE.Mesh>(null);
   
  const materialRef = useRef<any>(null);
  const topEyelidRef = useRef<THREE.Mesh>(null);
  const bottomEyelidRef = useRef<THREE.Mesh>(null);

  const [targetLook, setTargetLook] = useState(new THREE.Vector3(0, 0, 10));
  const lastMouseMove = useRef(0);

  const blinkState = useRef({
    isBlinking: false,
    startTime: 0,
    duration: 0.15,
  });

  const randomLookTimer = useRef(0);
  const EYE_RADIUS = 0.8;

  useEffect(() => {
    const handleMove = () => {
        lastMouseMove.current = Date.now();
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (materialRef.current) materialRef.current.uTime = time;

    // --- BLINKING ---
    // Smooth blink animation
    if (!blinkState.current.isBlinking) {
        // Random blink trigger (approx every 3-4s)
        if (Math.random() < 0.005) {
            blinkState.current.isBlinking = true;
            blinkState.current.startTime = time;
            blinkState.current.duration = 0.18 + Math.random() * 0.05; // ~200ms
        }
    }

    let blinkValue = 0; // 0 = Open, 1 = Closed
    if (blinkState.current.isBlinking) {
        const elapsed = time - blinkState.current.startTime;
        const progress = elapsed / blinkState.current.duration;

        if (progress >= 1) {
            blinkState.current.isBlinking = false;
            blinkValue = 0;
        } else {
            // Smooth sine wave 0 -> 1 -> 0
            blinkValue = Math.sin(progress * Math.PI);
        }
    }

    // Eyelid Rotation Logic
    // With Bottom Lid flipped via Z-rotation (see JSX):
    // Both lids open by rotating "Back" (Negative X in local space).
    // Top Lid: Neg X -> Edge moves Up.
    // Bottom Lid (Z-flipped): Neg X -> Edge moves Down (Local Up is World Down).

    // Angles in Radians
    const openAngle = -0.55; // Wide open
    const closedAngle = 0.05; // Slightly overlapped

    const currentAngle = THREE.MathUtils.lerp(openAngle, closedAngle, blinkValue);

    if (topEyelidRef.current) topEyelidRef.current.rotation.x = currentAngle;
    if (bottomEyelidRef.current) bottomEyelidRef.current.rotation.x = currentAngle;

    // --- LOOKING ---

    // --- LOOKING ---
    const mouse = state.mouse;
    const now = Date.now();
    const isIdle = (now - lastMouseMove.current) > 2000;
    const finalTarget = new THREE.Vector3();

    if (!isIdle) {
       // Follow Mouse
       const lookScale = 6.0;
       finalTarget.set(mouse.x * lookScale, mouse.y * lookScale, 5);
    } else {
       // Random
       if (time > randomLookTimer.current) {
          const rX = (Math.random() - 0.5) * 12;
          const rY = (Math.random() - 0.5) * 8;
          const rZ = 5 + Math.random() * 5;
          setTargetLook(new THREE.Vector3(rX, rY, rZ));
          randomLookTimer.current = time + 0.5 + Math.random() * 2.0;
       }
       finalTarget.copy(targetLook);
    }

    if (eyeBallRef.current) {
        const dummy = new THREE.Object3D();
        dummy.position.copy(eyeBallRef.current.position);
        dummy.lookAt(finalTarget);
        eyeBallRef.current.quaternion.slerp(dummy.quaternion, 0.1);
    }
  });

  return (
    <group scale={[0.6, 0.6, 0.6]}>
        <mesh ref={eyeBallRef}>
            <sphereGeometry args={[EYE_RADIUS, 64, 64]} />
            <eyeMaterial
                ref={materialRef}
                uIrisColor={new THREE.Color("#ffffff")}
                uPupilSize={0.25}
                uIrisSize={0.45}
            />
        </mesh>

        <group>
             {/* Top Eyelid - Hemisphere */}
             <mesh ref={topEyelidRef}>
                 {/* Sphere segment: 0 to PI/2 theta = Top Hemisphere */}
                 <sphereGeometry args={[EYE_RADIUS + 0.02, 64, 32, 0, Math.PI * 2, 0, Math.PI/2]} />
                 <meshStandardMaterial color="#111" roughness={0.4} />
                 <Eyelashes radius={EYE_RADIUS + 0.02} />
             </mesh>

             {/* Bottom Eyelid - Flipped via Group Z-rotation */}
             <group rotation={[0, 0, Math.PI]}>
                 <mesh ref={bottomEyelidRef}>
                     <sphereGeometry args={[EYE_RADIUS + 0.02, 64, 32, 0, Math.PI * 2, 0, Math.PI/2]} />
                     <meshStandardMaterial color="#111" roughness={0.4} />
                 </mesh>
             </group>
        </group>
    </group>
  );
};
