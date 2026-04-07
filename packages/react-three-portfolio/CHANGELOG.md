# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-03-25

### Added

- Initial release extracted from gabriel project
- `HeroCanvas` - Complete 3D scene with all effects combined
- `HeroOrb` - Pulsating orb with custom shader and noise-based animation
- `EnergyWaves` - Spherical wave effect with custom shader
- `Eye` - Realistic animated eye with blinking and mouse tracking
- `LightningEffect` - Procedural lightning bolts emanating from within
- `SparkleEffect` - Particle system with orbital motion
- `PostProcessing` - Bloom, noise, vignette, and chromatic aberration
- Full TypeScript support
- Build configuration with tsup
- Test suite with vitest

### Notes

- This is the initial extraction of Three.js/React Three Fiber components from the gabriel project
- Dependencies: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `postprocessing`
- All components are designed for portfolio and landing page use cases
- Uses custom GLSL shaders for visual effects

[Unreleased]: https://github.com/riceharvest/opensourceframework/compare/@opensourceframework/react-three-portfolio@0.1.0...main
[0.1.0]: https://github.com/riceharvest/opensourceframework/releases/tag/@opensourceframework/react-three-portfolio@0.1.0
