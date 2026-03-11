# Repository Guidelines

## Project Structure & Module Organization
This repository is a pnpm/Turbo monorepo for published `@opensourceframework/*` packages. Put package code in `packages/<name>/src`, package tests in `test/`, `src/**/*.test.*`, or `src/__tests__/`, and keep demos in `examples/`, `test-app/`, or `www/` when a package already uses them. Shared workspace tooling lives in `tools/` (`eslint-config`, `prettier-config`, `tsconfig`). Repo automation is in `scripts/`, starter files are in `templates/`, and maintenance/security notes live in `plans/`.

## Build, Test, and Development Commands
Use Node 20 and `pnpm@9` locally to match the main CI path.

- `pnpm install` installs all workspaces.
- `pnpm build` runs Turbo builds across packages.
- `pnpm test` runs each package’s own test script.
- `pnpm test:coverage` runs the CI-style coverage pass.
- `pnpm lint` and `pnpm typecheck` run repo-wide quality checks.
- `pnpm --filter @opensourceframework/next-cookies test` targets one published package.
- `pnpm --filter @opensourceframework/next-connect dev` starts a package watch/dev script when available.

## Coding Style & Naming Conventions
Prettier is the source of truth: 2-space indentation, single quotes, semicolons, trailing commas (`es5`), and 100-character lines. Root linting is ESLint via `eslint.config.mjs`; most packages follow that directly, while a few keep package-local tooling. Preserve package-local config files such as `tsup.config.ts`, `vitest.config.ts`, and `tsconfig.json`. Use kebab-case package directories, keep public entrypoints in `src/index.ts`, and name tests `*.test.ts` or `*.test.tsx`.

## Testing Guidelines
Most workspaces use Vitest, but some legacy packages wrap Jest or `tsx --test` behind their package scripts. Run the package script instead of assuming a runner. Every fix should add a regression test, and every feature should include coverage for the public API. Target at least 80% coverage on new code, and be stricter for auth, session, or security-sensitive packages.

## Commit & Pull Request Guidelines
Follow Conventional Commits with a package scope, for example `feat(next-csrf): add App Router support` or `fix(next-cookies): handle state sync`. PRs should follow `.github/PULL_REQUEST_TEMPLATE.md`: include a clear description, linked issue, affected package list, tests run, and screenshots only for UI or docs-site changes. Add a changeset with `pnpm changeset` for changes that affect a published npm package.
