# NPM Squatting Monitor Plan

## Overview

This plan outlines the strategy for reserving and monitoring package names on npm to ensure the OpenSource Framework can publish its forked packages under the `@opensourceframework` scope and related names.

## Target Package Names

### Primary Scope: `@opensourceframework`

These packages will be published under our scope:

| Package Name | Original Package | Weekly Downloads | Status |
|--------------|------------------|------------------|--------|
| `@opensourceframework/next-seo` | next-seo | 200K | ⚠️ Check availability |
| `@opensourceframework/next-transpile-modules` | next-transpile-modules | 300K | ⚠️ Check availability |
| `@opensourceframework/next-compose-plugins` | next-compose-plugins | 100K | ⚠️ Check availability |
| `@opensourceframework/next-cookies` | next-cookies | 20K | ⚠️ Check availability |
| `@opensourceframework/next-auth` | next-auth | 500K | ⚠️ Check availability |
| `@opensourceframework/next-pwa` | next-pwa | 200K | ⚠️ Check availability |
| `@opensourceframework/react-virtualized` | react-virtualized | 300K | ⚠️ Check availability |
| `@opensourceframework/next-session` | next-session | 30K | ⚠️ Check availability |
| `@opensourceframework/next-iron-session` | next-iron-session | 150K | ⚠️ Check availability |
| `@opensourceframework/next-mdx` | @next/mdx | 50K | ⚠️ Check availability |

### Additional Names to Monitor

These names may be taken by others, we should monitor:

- `next-seo` (original package)
- `next-transpile-modules`
- `next-compose-plugins`
- `next-cookies`
- `next-auth`
- `next-pwa`
- `react-virtualized`
- `next-session`
- `next-iron-session`
- `next-mdx`

## Strategy

### 1. Pre-Publish Reservation

**Goal**: Reserve all package names before first release.

#### For `@opensourceframework/*` Scope

1. **Create npm organization** (if not exists)
   ```bash
   npm org create opensourceframework
   ```

2. **Add team members** with appropriate permissions

3. **Reserve package names** by publishing initial versions:
   - Create minimal valid packages with placeholder content
   - Publish as `@opensourceframework/[name]` version `0.0.0-placeholder`
   - Mark as deprecated with clear messaging
   - This reserves the name legally

4. **Verify ownership** of all names before forking

#### For Original Package Names (Optional)

Consider reserving original names as fallback:

- **Not recommended** due to trademark concerns
- Could confuse users
- May violate npm policies
- Use only if original package is truly abandoned and name is available

### 2. Monitoring Schedule

#### Weekly Checks

Run this script weekly:

```bash
#!/bin/bash
# scripts/check-npm-names.sh

NAMES=(
  "@opensourceframework/next-seo"
  "@opensourceframework/next-transpile-modules"
  # ... all packages
)

for name in "${NAMES[@]}"; do
  if npm view "$name" version >/dev/null 2>&1; then
    echo "✓ $name is registered (version: $(npm view "$name" version))"
  else
    echo "✗ $name is NOT registered - URGENT: Reserve immediately!"
  fi
done
```

#### Automated Monitoring

Set up a GitHub Actions workflow:

```yaml
name: Monitor NPM Package Names

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  check-names:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check package names
        run: |
          ./scripts/check-npm-names.sh
```

### 3. Trademark Considerations

#### Original Package Names

- **Do NOT use original package names** in a way that suggests affiliation
- Use clear "forked from" attribution in documentation
- Consider legal implications before using similar names

#### Our Scope

- `@opensourceframework` is our trademark
- Register as npm organization
- Consider trademark registration if budget allows

### 4. Name Availability Check

Before forking any package:

1. **Check our scope availability**:
   ```bash
   npm view @opensourceframework/next-seo
   ```

2. **If available**: Reserve immediately by publishing placeholder

3. **If taken**:
   - Check if it's us (already published)
   - Check if it's a squatter (no recent updates)
   - Consider alternative names
   - May need legal action for trademark infringement

### 5. Pre-Publish Checklist

For each package:

- [ ] Package name is reserved in our scope
- [ ] `package.json` has correct `name` field
- [ ] `publishConfig.access` is set to `"public"`
- [ ] README clearly states it's a maintained fork
- [ ] Original author attribution included
- [ ] LICENSE is compatible (MIT preferred)
- [ ] No trademark violations in name/description

### 6. Squatting Detection

Watch for:

- **Package name squatting**: Someone registers `@opensourceframework/next-seo` before us
  - Action: npm support ticket immediately
  - Provide proof of intent to publish

- **Typosquatting**: `@opensourceframework/next-seo` vs `opensourceframework-next-seo`
  - Monitor with tools like `npm-audit` or Snyk
  - Report to npm if malicious

- **Brand squatting**: Someone tries to register `opensourceframework` org
  - Already secured? Verify ownership
  - If not, secure immediately

### 7. Action Plan

#### Immediate (Before Forking)

1. ✅ Create npm organization `opensourceframework`
2. ✅ Add all maintainers as members
3. ⬜ Reserve all `@opensourceframework/*` names via placeholder publish
4. ⬜ Verify no conflicts with existing packages

#### Ongoing (Weekly)

1. Run `scripts/check-npm-names.sh`
2. Monitor for typosquatting
3. Review npm security advisories
4. Check for unauthorized use of our name

#### Per-Release

1. Verify package name matches `package.json`
2. Ensure `publishConfig` is correct
3. Test publish to npm with `--dry-run`
4. Verify access permissions

## Implementation

### Script: `scripts/reserve-names.sh`

Create a script to reserve all package names:

```bash
#!/bin/bash
# Reserve all @opensourceframework package names

PACKAGES=(
  "@opensourceframework/next-seo"
  "next-transpile-modules"
  "@opensourceframework/next-compose-plugins"
  "next-cookies"
  "@opensourceframework/next-auth"
  "@opensourceframework/next-pwa"
  "@opensourceframework/react-virtualized"
  "@opensourceframework/next-session"
  "@opensourceframework/next-iron-session"
  "@opensourceframework/next-mdx"
)

for pkg in "${PACKAGES[@]}"; do
  echo "Checking @opensourceframework/$pkg..."

  if npm view "@opensourceframework/$pkg" version >/dev/null 2>&1; then
    echo "  ✓ Already exists"
  else
    echo "  ✗ Not found - needs reservation"
    # TODO: Create placeholder and publish
  fi
done
```

### Placeholder Package

Create a minimal placeholder package:

```json
{
  "name": "@opensourceframework/next-seo",
  "version": "0.0.0-placeholder",
  "description": "PLACEHOLDER - This package name is reserved by OpenSource Framework",
  "main": "index.js",
  "scripts": {
    "prepublishOnly": "echo 'This is a placeholder package' && exit 1"
  },
  "author": "OpenSource Framework",
  "license": "MIT",
  "publishConfig": {
    "access": "public",
    "provenance": false
  },
  "__reserved_by": "OpenSource Framework",
  "__reserved_at": "2025-02-18"
}
```

### Deprecation Notice

When real package is ready:

1. Update placeholder to real package (same name, new version)
2. npm will automatically replace placeholder
3. Users will get the real package on next install

## Monitoring Tools

- **npm audit**: Built-in vulnerability scanning
- **Snyk**: External vulnerability monitoring (free for open source)
- **OSS Index**: Sonatype's vulnerability database
- **GitHub Dependabot**: Automated dependency updates
- **GitHub Security Advisories**: Monitor for issues

## Escalation

If package name is taken without authorization:

1. Check if it's our team member (internal issue)
2. Check npm for similar names (typosquatting)
3. File npm support ticket with:
   - Proof of intent to publish
   - Trademark documentation (if applicable)
   - Timeline of our reservation plans
4. Public communication if needed

## Success Criteria

- ✅ All 10 package names reserved in `@opensourceframework` scope
- ✅ Weekly monitoring automated
- ✅ No typosquatting detected
- ✅ Clear ownership established
- ✅ No unauthorized use of our brand

## Resources

- [npm Docs: Package Name](https://docs.npmjs.com/creating-a-package#package-name)
- [npm Support](https://www.npmjs.com/support)
- [npm Trademark Policy](https://www.npmjs.com/policies/trademark)

---

*Last Updated: 2025-02-18*
*Maintained by: OpenSource Framework Team*
