# Repository Guidelines

## Project Structure & Module Organization
This repository is a pnpm/Turbo monorepo for published `@opensourceframework/*` packages. Put package code in `packages/<name>/src`, package tests in `test/`, `src/**/*.test.*`, or `src/__tests__/`, and keep demos in `examples/`, `test-app/`, or `www/` when a package already uses them. Shared workspace tooling lives in `tools/` (`eslint-config`, `prettier-config`, `tsconfig`). Repo automation is in `scripts/`, starter files are in `templates/`, and maintenance/security notes live in `plans/`.

## Build, Test, and Development Commands
Use Node 20 and `pnpm@9.6.0` locally to match the main CI path and the root
`packageManager`/`engines` constraints. If your global pnpm is older, run commands through
Corepack, for example `corepack pnpm@9.6.0 test`.

- `corepack pnpm@9.6.0 install` installs all workspaces.
- `corepack pnpm@9.6.0 build` runs Turbo builds across packages.
- `corepack pnpm@9.6.0 test` runs each package’s own test script.
- `corepack pnpm@9.6.0 test:coverage` runs the CI-style coverage pass.
- `corepack pnpm@9.6.0 lint` and `corepack pnpm@9.6.0 typecheck` run repo-wide quality checks.
- `corepack pnpm@9.6.0 --filter @opensourceframework/next-cookies test` targets one published package.
- `corepack pnpm@9.6.0 --filter @opensourceframework/next-connect dev` starts a package watch/dev script when available.

## Coding Style & Naming Conventions
Prettier is the source of truth: 2-space indentation, single quotes, semicolons, trailing commas (`es5`), and 100-character lines. Root linting is ESLint via `eslint.config.mjs`; most packages follow that directly, while a few keep package-local tooling. Preserve package-local config files such as `tsup.config.ts`, `vitest.config.ts`, and `tsconfig.json`. Use kebab-case package directories, keep public entrypoints in `src/index.ts`, and name tests `*.test.ts` or `*.test.tsx`.

## Testing Guidelines
Most workspaces use Vitest, but some legacy packages wrap Jest or `tsx --test` behind their package scripts. Run the package script instead of assuming a runner. Every fix should add a regression test, and every feature should include coverage for the public API. Target at least 80% coverage on new code, and be stricter for auth, session, or security-sensitive packages.

## Commit & Pull Request Guidelines
Follow Conventional Commits with a package scope, for example `feat(next-csrf): add App Router support` or `fix(next-cookies): handle state sync`. PRs should follow `.github/PULL_REQUEST_TEMPLATE.md`: include a clear description, linked issue, affected package list, tests run, and screenshots only for UI or docs-site changes. Add a changeset with `pnpm changeset` for changes that affect a published npm package.

## Package Strategy
This monorepo exists to ship safe, maintained, compatibility-first forks of useful packages whose original maintainers have stalled, moved on, or changed direction in ways that leave real users behind.

- Prefer drop-in or near-drop-in replacements over steering users toward a different library or a framework-native rewrite.
- Preserve the original package API, configuration shape, and migration surface whenever it is reasonable and safe to do so.
- Do not deprecate a package just because Next.js, React, or another framework now offers a native alternative.
- Only recommend migration to a different package or framework-native feature when the user explicitly wants that migration, or when we cannot make the compatibility package safe and maintainable at an acceptable cost.
- Treat vulnerable or outdated transitive dependencies as a maintenance problem to solve first, not automatic evidence that the top-level package should be deprecated.
- When evaluating fork opportunities, distinguish between an unmaintained upstream package and a maintained upstream package that is merely pulled in at an old vulnerable version by another dependency.

If older docs or package READMEs still say "use the native framework alternative instead", follow this policy as the current maintainer intent unless the user asks to change that policy.
