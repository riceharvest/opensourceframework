# npm Publication Checklist

**Phase 1: Package Preparation Status**

Generated: 2026-02-15

## Overview

This document tracks the readiness status of all packages in the opensourceframework monorepo for publication to npm.

## Prerequisites

Before publishing, ensure you have:

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] npm account with 2FA enabled
- [ ] `NPM_TOKEN` environment variable set (create at https://www.npmjs.com/settings/tokens)
- [ ] Membership in the `@opensourceframework` npm organization

## Package Status Summary

| Package | package.json | LICENSE | Build | Tests | README | Changeset | Ready |
|---------|--------------|---------|-------|-------|--------|-----------|-------|
| @opensourceframework/critters | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |
| @opensourceframework/next-csrf | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| @opensourceframework/next-images | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| @opensourceframework/next-circuit-breaker | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| @opensourceframework/react-a11y-utils | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| @opensourceframework/seeded-rng | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| @opensourceframework/next-json-ld | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

Legend:
- ✅ Ready
- ⚠️ Needs attention
- ❌ Not ready

## Detailed Package Status

### 1. @opensourceframework/critters

**Status: ⚠️ Needs attention**

**Package Type:** Fork (Apache-2.0 license)

**Metadata:**
- Name: `@opensourceframework/critters`
- Version: `0.0.27`
- License: Apache-2.0
- Author: OpenSource Framework Contributors
- Repository: https://github.com/opensourceframework/opensourceframework

**Checklist:**
- [x] package.json configured correctly
- [x] LICENSE file present (Apache-2.0)
- [x] Build successful
- [ ] **Tests: 10 failures** - Requires review
- [x] README with badges
- [x] Changeset created

**Test Failures to Review:**
The following tests are failing and need investigation before publication:
1. `critters.test.js`:
   - "Prevent injection via media attr" - Security test
   - "handles empty HTML gracefully"
   - "handles additionalStylesheets option"
   - "respects critters:exclude comment"
   - "handles preload: swap option"
   - "handles preload: js option"
2. `security.test.js`:
   - "should strip HTML entities from CSS to prevent HTML injection"
   - "should not inject HTML via media attribute manipulation"
   - "should handle encoded quotes in CSS safely"
   - "should prevent script injection via CSS content"

**Action Required:** Review and fix failing tests before publication.

---

### 2. @opensourceframework/next-csrf

**Status: ✅ Ready**

**Package Type:** Fork (MIT license, original by j0lv3r4)

**Metadata:**
- Name: `@opensourceframework/next-csrf`
- Version: `0.2.3`
- License: MIT
- Author: OpenSource Framework Contributors
- Repository: https://github.com/opensourceframework/opensourceframework

**Checklist:**
- [x] package.json configured correctly
- [x] LICENSE file present (MIT)
- [x] Build successful
- [x] Tests passing (19 tests)
- [x] README with badges
- [x] Changeset created

**Ready to publish:** Yes

---

### 3. @opensourceframework/next-images

**Status: ✅ Ready**

**Package Type:** Maintained compatibility fork (MIT license, original by Aref Aslani)

**Metadata:**
- Name: `@opensourceframework/next-images`
- Version: `1.9.3`
- License: MIT
- Author: OpenSource Framework Contributors (fork), Original: Aref Aslani
- Repository: https://github.com/opensourceframework/opensourceframework

**Checklist:**
- [x] package.json configured correctly
- [x] LICENSE file present (MIT)
- [x] Build successful
- [x] Tests passing (11 tests)
- [x] README with badges
- [x] Changeset created

**Note:** This package remains actively maintained as a compatibility option for teams that rely on the classic `next-images` plugin workflow. `next/image` may be a good fit for new applications, but the fork is not deprecated solely because Next.js includes a native image component.

**Ready to publish:** Yes

---

### 4. @opensourceframework/next-circuit-breaker

**Status: ✅ Ready**

**Package Type:** New package

**Metadata:**
- Name: `@opensourceframework/next-circuit-breaker`
- Version: `0.0.1`
- License: MIT
- Author: OpenSource Framework Contributors
- Repository: https://github.com/opensourceframework/opensourceframework

**Checklist:**
- [x] package.json configured correctly
- [x] LICENSE file present (MIT)
- [x] Build successful
- [x] Tests passing (15 tests)
- [x] README with badges
- [x] Changeset created

**Ready to publish:** Yes

---

### 5. @opensourceframework/react-a11y-utils

**Status: ✅ Ready**

**Package Type:** New package

**Metadata:**
- Name: `@opensourceframework/react-a11y-utils`
- Version: `0.0.1`
- License: MIT
- Author: OpenSource Framework Contributors
- Repository: https://github.com/opensourceframework/opensourceframework

**Checklist:**
- [x] package.json configured correctly
- [x] LICENSE file present (MIT)
- [x] Build successful
- [x] Tests passing (27 tests)
- [x] README with badges
- [x] Changeset created

**Ready to publish:** Yes

---

### 6. @opensourceframework/seeded-rng

**Status: ✅ Ready**

**Package Type:** New package

**Metadata:**
- Name: `@opensourceframework/seeded-rng`
- Version: `0.0.1`
- License: MIT
- Author: OpenSource Framework Contributors
- Repository: https://github.com/opensourceframework/opensourceframework

**Checklist:**
- [x] package.json configured correctly
- [x] LICENSE file present (MIT)
- [x] Build successful
- [x] Tests passing (34 tests)
- [x] README with badges
- [x] Changeset created

**Ready to publish:** Yes

---

### 7. @opensourceframework/next-json-ld

**Status: ✅ Ready**

**Package Type:** New package

**Metadata:**
- Name: `@opensourceframework/next-json-ld`
- Version: `0.0.1`
- License: MIT
- Author: OpenSource Framework Contributors
- Repository: https://github.com/opensourceframework/opensourceframework

**Checklist:**
- [x] package.json configured correctly
- [x] LICENSE file present (MIT)
- [x] Build successful
- [x] Tests passing (22 tests)
- [x] README with badges
- [x] Changeset created

**Ready to publish:** Yes

---

## Publication Process

### Step 1: Set up npm authentication

```bash
# Create .npmrc file with your token (do NOT commit this)
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

# Or login interactively
npm login
```

### Step 2: Version packages

```bash
# Run changeset version to update package versions
npx pnpm changeset version
```

### Step 3: Publish packages

```bash
# Publish all packages
npx pnpm -r publish --access public

# Or publish individual packages
cd packages/{package-name} && npm publish --access public
```

### Step 4: Verify publication

After publishing, verify each package:
1. Check https://www.npmjs.com/package/@opensourceframework/{package-name}
2. Verify README renders correctly
3. Verify version number is correct
4. Test installation: `npm install @opensourceframework/{package-name}`

## Publication Order

Recommended order for publication:

1. **First batch (ready now):**
   - @opensourceframework/next-csrf
   - @opensourceframework/next-images
   - @opensourceframework/next-circuit-breaker
   - @opensourceframework/react-a11y-utils
   - @opensourceframework/seeded-rng
   - @opensourceframework/next-json-ld

2. **Second batch (after test fixes):**
   - @opensourceframework/critters (fix failing tests first)

## Post-Publication Tasks

After successful publication:

- [ ] Create GitHub release for each package
- [ ] Update documentation with npm links
- [ ] Announce on social media (Twitter, LinkedIn)
- [ ] Submit to Next.js resources (if applicable)
- [ ] Monitor for issues and feedback

## Rollback Plan

If issues are discovered after publication:

1. **Deprecate version:**
   ```bash
   npm deprecate @opensourceframework/{package-name}@{version} "Reason for deprecation"
   ```

2. **Bump version and republish:**
   ```bash
   # Fix the issue
   npx pnpm changeset add --type patch
   npx pnpm changeset version
   npx pnpm -r publish --access public
   ```

## Notes

- All packages use `files` field in package.json to control what gets published
- Build output goes to `dist/` directory
- Source maps are included for debugging
- TypeScript declarations are bundled
