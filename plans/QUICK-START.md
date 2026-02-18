# Quick Start Guide

## Fork Infrastructure - Ready to Use

The complete automation infrastructure for forking 10 unmaintained Next.js packages is now ready.

### 🎯 What's Been Created

**3 Automation Scripts:**
- `scripts/fork-setup.sh` - Fork a single package
- `scripts/setup-all-packages.sh` - Fork all 10 packages (or a subset)
- `scripts/security-audit.sh` - Run security audits

**7 Template Files:**
- `templates/README.template.md`
- `templates/SECURITY.template.md`
- `templates/CONTRIBUTING.template.md`
- `templates/package.json.template`
- `templates/.changeset/config.json.template`
- `templates/vitest.config.template.ts`
- `templates/tsup.config.template.ts`

**10 Package Placeholders:**
All 10 target packages have `PENDING-FORK.md` files in `packages/`:
- next-seo (200K/week)
- next-transpile-modules (300K/week)
- next-compose-plugins (100K/week)
- next-cookies (20K/week)
- next-auth (500K/week) ⚠️ Critical
- next-pwa (200K/week)
- react-virtualized (300K/week)
- next-session (30K/week)
- next-iron-session (150K/week)
- next-mdx (50K/week)

**Documentation:**
- `plans/modernization-plans.md` - Detailed plans for each package (646 hours total)
- `plans/npm-squatting-monitor.md` - Package name reservation strategy
- `plans/security-audits/` - Directory for audit reports
- `packages/CONTRIBUTING.md` - Unified contribution guidelines
- `plans/FORK-INFRASTRUCTURE-SETUP.md` - Complete infrastructure guide

**GitHub Templates Updated:**
- `.github/CODEOWNERS` - Added all 10 new packages
- `.github/PULL_REQUEST_TEMPLATE.md` - Updated package checklist
- `.github/ISSUE_TEMPLATE/bug_report.yml` - Added package dropdown
- `.github/ISSUE_TEMPLATE/feature_request.yml` - Added package dropdown

---

### 🚀 Getting Started

#### Step 1: Reserve NPM Package Names

Before forking, reserve the `@opensourceframework/*` names on npm:

```bash
# See plans/npm-squatting-monitor.md for detailed strategy
# Quick check if names are available:
for pkg in next-seo next-transpile-modules next-compose-plugins next-cookies next-auth next-pwa react-virtualized next-session next-iron-session next-mdx; do
  echo "Checking @opensourceframework/$pkg..."
  npm view "@opensourceframework/$pkg" version 2>/dev/null || echo "  ❌ NOT AVAILABLE"
done
```

#### Step 2: Dry Run the Fork Setup

```bash
# See what would be done without actually doing it
./scripts/setup-all-packages.sh --dry-run
```

#### Step 3: Fork the Packages

**Option A: Fork all packages**
```bash
./scripts/setup-all-packages.sh
```

**Option B: Fork only high-priority, low-effort packages**
```bash
./scripts/fork-setup.sh next-compose-plugins https://github.com/hoangvvo/next-compose-plugins "Hoang Vo"
./scripts/fork-setup.sh next-cookies https://github.com/hoangvvo/next-cookies "Hoang Vo"
./scripts/fork-setup.sh next-mdx https://github.com/hoangvvo/next-mdx "Hoang Vo" @next/mdx
```

**Option C: Fork with custom ordering**
```bash
./scripts/setup-all-packages.sh --start-index 0  # Start with #1
./scripts/setup-all-packages.sh --start-index 3  # Start with #4
```

#### Step 4: After Forking

For each forked package:

```bash
# Install dependencies (from monorepo root)
pnpm install

# Build the package
pnpm --filter @opensourceframework/package-name build

# Run tests
pnpm --filter @opensourceframework/package-name test

# Create changeset
pnpm changeset

# Run security audit
./scripts/security-audit.sh --packages package-name
```

---

### 📋 Package Priority & Effort

**Tier 1 - Quick Wins** (Low Effort, High Impact):
1. next-compose-plugins (2 days)
2. next-transpile-modules (3 days)
3. next-cookies (2 days)
4. next-mdx (4 days)

**Tier 2 - Medium Effort**:
5. next-seo (5-6 days)
6. next-session (5-6 days)
7. next-iron-session (6-7 days)

**Tier 3 - High Effort, High Impact**:
8. next-pwa (2-3 weeks)
9. react-virtualized (2-3 weeks)

**Tier 4 - Very High Effort, Critical**:
10. next-auth (5-6 weeks, requires special handling due to archived status)

---

### 🔒 Security Considerations

**Security-Critical Packages** (require extra review):
- `next-auth` - Authentication ⚠️ CRITICAL
- `next-session` - Session management
- `next-iron-session` - Encrypted sessions
- `next-csrf` - CSRF protection

For these packages:
- All PRs require senior maintainer approval
- Security audit mandatory before release
- Consider third-party security review
- Follow `SECURITY.md` strictly

---

### 📚 Documentation

**Start here:**
1. `plans/FORK-INFRASTRUCTURE-SETUP.md` - Complete infrastructure guide
2. `plans/modernization-plans.md` - Detailed per-package plans
3. `packages/CONTRIBUTING.md` - Contribution guidelines
4. Individual `packages/[name]/PENDING-FORK.md` - Package-specific notes

**Reference:**
- `CONTRIBUTING.md` (root) - General workflow
- `SECURITY.md` (root) - Security policy
- `templates/` - Template files for new packages

---

### ✅ Checklist Before Publishing

- [ ] Package forked and set up
- [ ] All tests passing (≥80% coverage)
- [ ] TypeScript strict mode compliance
- [ ] README updated with migration guide
- [ ] Security audit passed (no critical/high)
- [ ] Changeset created
- [ ] CI/CD pipeline green
- [ ] npm name reserved
- [ ] Package reviewed by maintainer

---

### 🆘 Need Help?

- **Questions**: See `packages/CONTRIBUTING.md` or root `CONTRIBUTING.md`
- **Security issues**: `security@opensourceframework.dev` (NOT GitHub issues)
- **Bugs**: Use GitHub issue templates (updated with all packages)
- **Infrastructure issues**: Check `plans/FORK-INFRASTRUCTURE-SETUP.md`

---

**Infrastructure Status**: ✅ Complete and Ready

All scripts are executable, templates are in place, placeholders created, documentation complete, and GitHub templates updated.

**Next Action**: Run `./scripts/setup-all-packages.sh --dry-run` to preview the forking process.
