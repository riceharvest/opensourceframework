# Contributing to Next SEO

Thank you for your interest in contributing to Next SEO! We are open to all and any contributions. This guide will help you get started.

It is critical that you look over the guidance for new components [here](ADDING_NEW_COMPONENTS.md)

## 🚀 Quick Start

1. Fork the OpenSourceFramework monorepo
2. Clone your fork: `git clone git@github.com:your-username/opensourceframework.git`
3. Install dependencies: `corepack pnpm@9.6.0 install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes in `packages/next-seo`
6. Add a changeset when your change affects the published package: `corepack pnpm@9.6.0 changeset`
7. Submit a pull request

## 📦 Development Setup

### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 9.6.0 via Corepack

### Installation

```bash
# Clone the OpenSourceFramework monorepo
git clone git@github.com:riceharvest/opensourceframework.git
cd opensourceframework

# Install dependencies
corepack pnpm@9.6.0 install

# Start next-seo development (watch mode)
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo dev
```

### Available Commands

```bash
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo dev        # Watch mode development
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo build      # Build the library
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test       # Run type checking and linting
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:unit  # Run unit tests
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:e2e   # Run E2E tests (requires build first)
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:sweep # Run full test suite (CI equivalent)
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo lint       # Check linting
corepack pnpm@9.6.0 format                                             # Format code with Prettier
```

## 📝 Adding a Changeset

**Important:** All PRs with code changes require a changeset. This helps us track changes and automatically manage releases.

### What is a changeset?

A changeset is a piece of information about changes made in a branch or commit. It includes:

- What packages changed
- What kind of change it was (major/minor/patch)
- A description of the change for the changelog

### How to add a changeset:

1. After making package changes, run: `corepack pnpm@9.6.0 changeset`
2. Select the packages affected (usually just `next-seo`)
3. Choose the type of change:
   - **patch**: Bug fixes, documentation, internal changes (0.0.X) **Rarely use this, generally only for security, since this is an SEO package I don't want patches to slip through for people without validating**
   - **minor**: New features, non-breaking enhancements (0.X.0) **Most common**
   - **major**: Breaking changes (X.0.0)
4. Write a brief description of your changes
5. Commit the generated changeset file

### Example:

```bash
$ corepack pnpm@9.6.0 changeset
🦋 Which packages would you like to include? › next-seo
🦋 Which packages should have a major bump? › (none)
🦋 Which packages should have a minor bump? › next-seo
🦋 The following packages will be patch bumped:
🦋 next-seo@minor
🦋 Please enter a summary for this change:
📝 Added support for RecipeJsonLd component with full Schema.org compliance
```

We recommend never using patch unless critical security bug

This creates a markdown file in `.changeset/` that will be used to:

- Update the package version
- Generate changelog entries
- Credit you as a contributor

### When is a changeset NOT required?

- Documentation-only changes (README, etc.)
- Changes to GitHub workflows
- Changes to development tooling that don't affect the published package

## 🏗️ Project Guidelines

### For AI-Assisted Development

This project leverages AI coding tools. If you're using tools like Claude or GitHub Copilot:

- Refer to [CLAUDE.md](CLAUDE.md) for project-specific AI guidance
- Refer to [ADDING_NEW_COMPONENTS.md](ADDING_NEW_COMPONENTS.md) for component development

### For Large Features

If you're planning a large feature or refactor:

1. Open an issue first to discuss with maintainers
2. Provide comprehensive context in your issue/PR
3. Break down large changes into smaller, reviewable PRs if possible

## 🧪 Testing Requirements

Before submitting a PR, ensure all tests pass:

```bash
# Quick checks
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test       # Type checking and linting
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:unit  # Unit tests

# Full validation (what CI runs)
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:sweep # Complete test suite
```

## 🔄 Pull Request Process

1. **Fork & Clone**: Fork the repo and clone locally
2. **Branch**: Create a feature branch from `main`
3. **Develop**: Make your changes following our guidelines
4. **Changeset**: Add a changeset describing your changes
5. **Test**: Ensure all tests pass
6. **Push**: Push to your fork
7. **PR**: Open a pull request with a clear description

### PR Guidelines

- Use clear, descriptive titles
- Reference any related issues
- Include examples if adding new features
- Ensure CI passes before requesting review

## ❓ Questions?

- Open a [Discussion](https://github.com/riceharvest/opensourceframework/discussions) for general questions
- Check existing issues and PRs
- Refer to the [README](./README.md) for usage documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

---

Thank you for contributing to Next SEO! Your efforts help make SEO easier for the Next.js community.
