## 8.0.5

### Patch Changes

- Modernization and stabilization fixes:
  - Standardized scripts and CI/CD lockfiles
  - Fixed lint rules and CI/CD unblocking
  - Added llms.txt for AI-First Discovery
  - Include llms.txt in published files

## [8.0.0-alpha.0](https://github.com/vvo/iron-session/compare/v6.2.1...v8.0.0-alpha.0) (2023-05-27)

### ⚠ BREAKING CHANGES

- rewrite (#574)

### Features

- rewrite ([#574](https://github.com/vvo/iron-session/issues/574)) ([ecdd626](https://github.com/vvo/iron-session/commit/ecdd6260641cd9a61c671fd18a7ef980148ca76a))

### Bug Fixes

- handle ttl and max-age properly in case of overriden options in save/destroy calls ([3c00b13](https://github.com/vvo/iron-session/commit/3c00b1325079c594930fda82157deec3a70d1dd7))
