# next-seo

## 7.3.1

### Patch Changes

- e700978: Fixed React 18 peer dependency compatibility and upgraded Next.js to 15.5.10 to address security vulnerabilities (GHSA-h25m-26qc-wcjf, GHSA-9qr9-h5gf-34mp, GHSA-mwv6-3258-q52c, GHSA-9g9p-9gw9-jx7f).
  - Pinned React to ^18.2.0 in devDependencies to match peer dependencies
  - Upgraded Next.js from 15.3.2 to 15.5.10 in both main package and example app
  - All 539 unit tests pass

## 7.3.0

### Minor Changes

- Initial fork from garmeeh/next-seo with Next.js 15+ compatibility and TypeScript improvements

## 7.2.0

### Minor Changes

- 28c684e: Add `review` and `aggregateRating` props to OrganizationJsonLd component, matching the existing support in LocalBusinessJsonLd. Both are direct Schema.org Organization properties processed using shared utilities.

## 7.1.0

### Minor Changes

- d412e2b: Add HowToJsonLd component for structured data support
  - New `HowToJsonLd` component following Schema.org HowTo specification
  - Support for HowToStep, HowToSection, HowToDirection, and HowToTip types
  - HowToSupply and HowToTool for materials and equipment
  - Duration properties (prepTime, performTime, totalTime) in ISO 8601 format
  - estimatedCost as string or MonetaryAmount object
  - yield as string or QuantitativeValue
  - Video support via VideoObject

## 7.0.1

### Patch Changes

- 1db3648: Add JSDoc comment to internal type guard function
