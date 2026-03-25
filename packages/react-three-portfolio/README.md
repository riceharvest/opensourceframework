# @opensourceframework/react-three-portfolio

> Three.js/React Three Fiber visual components for portfolio and landing pages

[![npm version](https://img.shields.io/npm/v/@opensourceframework/react-three-portfolio.svg)](https://www.npmjs.com/package/@opensourceframework/react-three-portfolio)
[![npm downloads](https://img.shields.io/npm/dm/@opensourceframework/react-three-portfolio.svg)](https://www.npmjs.com/package/@opensourceframework/react-three-portfolio)
[![License](https://img.shields.io/npm/l/@opensourceframework/react-three-portfolio.svg)](./LICENSE)

## About

A collection of stunning 3D visual components built with React Three Fiber and Three.js, designed for creating impressive portfolio sites and landing pages. This package includes reusable components featuring custom shaders, animations, and post-processing effects.

### Components

- **HeroCanvas** - A complete 3D scene combining multiple visual effects
- **HeroOrb** - A pulsating, transparent orb with custom shader material and noise-based animation
- **EnergyWaves** - A spherical mesh with radiating wave patterns and pulsating effect
- **Eye** - A realistic animated eye with iris texture, pupil, blinking eyelids, and mouse tracking
- **LightningEffect** - Dynamic lightning bolts emanating from within a central form
- **SparkleEffect** - A particle system creating ambient sparkles that orbit and drift
- **PostProcessing** - Bloom, noise, vignette, and chromatic aberration effects

## Installation

```bash
npm install @opensourceframework/react-three-portfolio three
# or
yarn add @opensourceframework/react-three-portfolio three
# or
pnpm add @opensourceframework/react-three-portfolio three
```

> **Note**: This package has `three` as a peer dependency. You must install it separately.

## Usage

### Basic Example

```tsx
'use client';

import { HeroCanvas } from '@opensourceframework/react-three-portfolio';

export default function HomePage() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <HeroCanvas />
    </div>
  );
}
```

### Using Individual Components

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { HeroOrb, LightningEffect, SparkleEffect } from '@opensourceframework/react-three-portfolio';

export function MyCustomScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, -5]} intensity={2.0} color="#b537f2" />

      <HeroOrb />
      <LightningEffect />
      <SparkleEffect />
    </Canvas>
  );
}
```

### Requirements

- React 18.0 or higher
- React DOM 18.0 or higher
- @react-three/fiber 8.0 or higher
- Three.js 0.150.0 or higher

## API Reference

### `HeroCanvas`

A complete pre-configured 3D scene that combines all visual effects into a cohesive composition.

**Features:**
- Ambient and point lighting
- Eye component
- HeroOrb as the central element
- Lightning effects emanating from within
- Sparkle particles
- Post-processing effects (bloom, vignette, noise, chromatic aberration)

**No props required** - Ready to use out of the box.

---

### `HeroOrb`

A large, central orb with a custom shader material that creates a living, breathing energy ball.

**Features:**
- Custom GLSL shader with simplex noise
- Fresnel-based transparency and edge glow
- Pulsating expansion effect
- Optional mouse interaction (uMouse uniform)

**Optional uniforms (can be passed as props):**
- `uColor1` - Core color (default: `#2a0044`)
- `uColor2` - Rim color (default: `#9d00ff`)

---

### `Eye`

A realistic human eye that follows the mouse cursor and blinks naturally.

**Features:**
- Custom iris shader with noise-based texture
- Animated eyelashes
- Realistic blinking (automatic, random)
- Mouse tracking (follows cursor when active)
- Idle look behavior (random target looking)

**Size:** Rendered at 0.6x scale by default (adjustable via group scale)

---

### `LightningEffect`

Generates procedural lightning bolts that appear to emanate from within a central form.

**Features:**
- Procedural generation with midpoint displacement
- Jagged, animated lines with jitter
- Additive blending for glow effect
- Automatic spawning with adjustable frequency
- Bright electric purple colors

**Customization:**
- Spawn frequency: ~0.05-0.2 seconds
- Duration: 0.1-0.25 seconds per bolt
- Intensity: 2.0-4.0
- Bolt color: Electric purple (HSL 0.75-0.85)

---

### `SparkleEffect`

A particle system that creates floating sparkles with orbital motion.

**Features:**
- GPU-accelerated points with custom shader
- Particle lifecycle (spawn, drift, fade)
- Swirling motion toward center
- Additive blending for glow
- Automatic spawning

**Customization:**
- Spawn rate: 4-9 particles per spawn
- Spawn interval: 0.05 seconds
- Particle life: 1.5-3.0 seconds
- Bright HSL colors (0.7-0.85 hue)

---

### `PostProcessing`

Applies a chain of post-processing effects to the entire scene.

**Effects included:**
- **Bloom** - Glow for bright areas (intensity: 1.0)
- **Noise** - Subtle film grain overlay (opacity: 0.05)
- **Vignette** - Darkened edges (offset: 0.1, darkness: 1.1)
- **Chromatic Aberration** - RGB shift (offset: 0.001)

**Note**: Requires `@react-three/postprocessing` as a peer dependency, which is included in this package's dependencies.

---

### `EnergyWaves`

A spherical mesh with a custom shader that creates expanding energy wave patterns.

**Features:**
- Pulsating radial waves
- Transparent, additive blending
- Continuous rotation

**Note**: Not included in the default HeroCanvas to avoid visual clutter, but available as a standalone component.

---

## Advanced Customization

All components use custom shader materials with uniforms that can be adjusted via props. See source code for available uniforms and how to modify them.

### Passing Uniforms to HeroOrb

```tsx
<HeroOrb uColor1="#ff0000" uColor2="#00ff00" />
```

You may need to extend the component's prop types to accept custom uniforms, as they are currently typed as `any` for flexibility.

## Performance Considerations

- These components are GPU-intensive due to custom shaders and particle systems
- Use `dpr={[1, 2]}` to limit device pixel ratio (recommended)
- Consider disabling some effects on lower-end devices
- Post-processing particularly impacts performance

## Browser Support

Requires WebGL 2.0 and modern browser features. Tested on:
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## Development

This package is part of the [OpenSource Framework](https://github.com/riceharvest/opensourceframework) monorepo.

To develop locally:

```bash
# From monorepo root
pnpm install
pnpm --filter @opensourceframework/react-three-portfolio dev
```

## Testing

```bash
pnpm --filter @opensourceframework/react-three-portfolio test
```

## Building

```bash
pnpm --filter @opensourceframework/react-three-portfolio build
```

## Contributing

See the [root contributing guide](../../CONTRIBUTING.md) for general contribution information.

For this package specifically:
- Follow existing code style and shader structure
- Test on multiple browsers
- Consider performance implications of shader changes
- Document any new uniforms or props

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details about changes.

## License

MIT - See [LICENSE](./LICENSE) for full text.

## Acknowledgements

- Original source project: [gabriel](https://github.com/riceharvest/gabriel)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [Three.js](https://threejs.org/)
