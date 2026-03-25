# @opensourceframework/react-three-portfolio

Three.js/React Three Fiber visual components for building stunning 3D portfolios. Extracted from the gabriel project.

## Installation

```bash
pnpm add @opensourceframework/react-three-portfolio
```

## Usage

```tsx
import { ReactThreePortfolioCanvas, PortfolioBox, PortfolioSphere } from '@opensourceframework/react-three-portfolio';

function Portfolio() {
  return (
    <ReactThreePortfolioCanvas camera={{ position: [0, 0, 8] }}>
      <PortfolioBox
        position={[-2, 0, 0]}
        color="#6366f1"
        animate
        animationType="float"
      />
      <PortfolioSphere
        position={[2, 0, 0]}
        color="#10b981"
        animate
        animationType="pulse"
      />
    </ReactThreePortfolioCanvas>
  );
}
```

## Components

- **ReactThreePortfolioCanvas** - A pre-configured Canvas wrapper with lighting, environment, and controls
- **PortfolioBox** - Animated 3D box component
- **PortfolioSphere** - Animated 3D sphere component
- **PortfolioTorus** - Animated 3D torus component

## Dependencies

- react >=18
- react-dom >=18
- three
- @react-three/fiber
- @react-three/drei
- gsap

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
```

## License

MIT
