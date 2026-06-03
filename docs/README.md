# OpenSourceFramework docs

This workspace contains the Nextra/Next.js documentation app for the monorepo.

## Local development

From the repository root:

```bash
corepack pnpm@9.6.0 --filter docs dev
```

Or from this directory:

```bash
corepack pnpm@9.6.0 dev
```

## Build behavior

The `docs` package currently keeps its `build` script as a no-op so the monorepo build can run package validation without trying to produce a docs-site artifact. That script points here intentionally so maintainers know why docs builds are skipped.

Run `corepack pnpm@9.6.0 --filter docs dev` when editing pages under `docs/app/`.
