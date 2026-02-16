# Unmaintained Dependencies Analysis

**Analysis Date:** 2026-02-15  
**Projects Analyzed:** boeloe, gabriel, itsalive, jamal, slotenmaker-master, tarkuv

---

## Critical (Archived or No Updates 2+ Years)

| Package | Last npm Update | GitHub Status | Used In | Recommendation |
|---------|-----------------|---------------|---------|----------------|
| **critters** | 2024-10-28 | ⚠️ **ARCHIVED** | slotenmaker-master | **URGENT:** Repository archived by owner. Migrate to alternative or fork. You have a `packages/critters/` fork - consider publishing it. |
| **next-images** | 2023-09-16 | Last commit: 2023-04-16 | slotenmaker-master | **URGENT:** No updates in 2.5+ years. Next.js now has built-in image optimization. Remove and use Next.js Image component. |
| **tailwindcss-animate** | 2023-08-28 | Last commit: 2024-07-28 | jamal, slotenmaker-master | **WARNING:** No npm release in 2.5+ years despite GitHub activity. Consider `tw-animate-css` as modern alternative (already in jamal). |

---

## Warning (No Updates 1-2 Years)

| Package | Last npm Update | GitHub Status | Notes |
|---------|-----------------|---------------|-------|
| **@react-three/postprocessing** | 2025-02-20 | 85 open issues | Last release ~1 year ago. GitHub shows commits but no releases. Monitor for updates. |
| **class-variance-authority** | 2024-11-26 | Active (Dec 2025 commits) | NPM package stale but GitHub active. May need maintainers to publish update. |
| **input-otp** | 2025-01-06 | Active (Jan 2026 commits) | NPM package stale but GitHub active. Consider contributing to help release. |
| **next-themes** | 2025-03-11 | 49 open issues | Nearly 1 year without update. Stable package, low risk. |
| **vaul** | 2024-12-14 | Active (Oct 2025 commits) | NPM stale for 1+ year but GitHub active. 149 open issues indicate maintenance needed. |
| **bcryptjs** | 2025-11-02 | Active (Jan 2026 commits) | Stable security package. Consider native Node.js `crypto.scrypt` for new projects. |
| **clsx** | 2025-06-27 | Stable | Mature package, low maintenance needs. Safe to continue using. |
| **sonner** | 2025-08-02 | Active (Dec 2025 commits) | NPM stale but GitHub active. Popular package with active maintainer. |

---

## Healthy (Recently Updated)

| Package | Last Update | Version | Notes |
|---------|-------------|---------|-------|
| react | 2026-02-14 | 19.x | Core framework |
| react-dom | 2026-02-13 | 19.x | Core framework |
| next | 2026-02-14 | 16.x | Core framework |
| framer-motion | 2026-02-09 | 12.x | Actively maintained |
| lucide-react | 2026-02-13 | 0.563.x | Frequent updates |
| tailwind-merge | 2026-02-15 | 3.x | Actively maintained |
| zustand | 2026-02-01 | 5.x | Actively maintained |
| convex | 2026-02-11 | 1.x | Actively maintained |
| pino | 2026-02-09 | 10.x | Actively maintained |
| zod | 2026-01-25 | 3.x | Actively maintained |
| @clerk/nextjs | 2026-02-14 | 6.x | Actively maintained |
| @sentry/nextjs | 2026-02-13 | 10.x | Actively maintained |
| @radix-ui/* | 2025-12-24 | Various | All Radix packages actively maintained |
| @prisma/client | 2026-02-13 | 5.x | Actively maintained |
| prisma | 2026-02-13 | 5.x | Actively maintained |
| three | 2025-12-10 | 0.182.x | Actively maintained |
| @react-three/drei | 2026-02-03 | 10.x | Actively maintained |
| @react-three/fiber | 2026-02-09 | 9.x | Actively maintained |
| jsonwebtoken | 2026-01-27 | 9.x | Maintained, but consider `jose` for new projects |
| qrcode | 2025-11-13 | 1.x | Stable |
| recharts | 2026-01-21 | 2.x | Actively maintained |
| whatsapp-web.js | 2026-01-30 | 1.x | Actively maintained |
| react-hook-form | 2026-01-13 | 7.x | Actively maintained |
| react-day-picker | 2026-02-10 | 9.x | Actively maintained |
| react-resizable-panels | 2026-02-14 | 2.x | Actively maintained |
| sharp | 2026-01-02 | 0.34.x | Actively maintained |
| uuid | 2025-09-08 | 11.x | Stable |
| web-vitals | 2025-09-18 | 5.x | Stable |
| @vercel/analytics | 2026-01-23 | 1.x | Actively maintained |
| autoprefixer | 2026-01-30 | 10.x | Actively maintained |
| embla-carousel-react | 2026-01-20 | 8.x | Actively maintained |
| cmdk | 2025-08-27 | 1.x | Actively maintained |
| date-fns | 2025-08-03 | 4.x | Actively maintained |
| gsap | 2025-12-12 | 3.x | Commercial license, actively maintained |
| lenis | 2025-12-28 | 1.x | Actively maintained |
| next-intl | 2026-02-02 | 4.x | Actively maintained |
| pino-pretty | 2025-12-01 | 13.x | Actively maintained |
| shadcn-ui | 2025-06-09 | 0.9.x | CLI tool, not a runtime dependency |

---

## Recommendations

### Immediate Action Required

1. **critters** (slotenmaker-master)
   - **Status:** Repository ARCHIVED by Google Chrome Labs
   - **Action:** You already have a fork at `packages/critters/`. Consider:
     - Publishing your fork to npm under a scoped package name
     - Or removing the dependency and using Next.js built-in CSS optimization
   - **Timeline:** Within 1 month

2. **next-images** (slotenmaker-master)
   - **Status:** Abandoned for 2.5+ years
   - **Action:** Remove and migrate to Next.js built-in Image component
   - **Timeline:** Within 1 month
   - **Note:** Next.js has had native image optimization since v10

3. **tailwindcss-animate** (jamal, slotenmaker-master)
   - **Status:** No npm release in 2.5+ years
   - **Action:** 
     - jamal already uses `tw-animate-css` as alternative
     - Migrate slotenmaker-master to `tw-animate-css`
   - **Timeline:** Within 2 months

### Monitor Closely

| Package | Risk Level | Monitoring Action |
|---------|------------|-------------------|
| @react-three/postprocessing | Medium | Watch for security updates; 85 open issues |
| vaul | Medium | 149 open issues; may need contribution |
| next-themes | Low | Stable but aging; consider alternatives |
| class-variance-authority | Low | GitHub active, npm stale - may just need release |

### Contribution Opportunities

Consider contributing to these packages that have active development but need help:

1. **@react-three/postprocessing** - 85 open issues, could use triage and PRs
2. **vaul** - 149 open issues, high-impact drawer component
3. **input-otp** - 23 open issues, growing adoption

### Fork Candidates

If you rely heavily on these packages and they become fully unmaintained:

1. **critters** - Already forked in monorepo
2. **tailwindcss-animate** - Simple enough to maintain fork
3. **next-images** - Can be replaced, forking not recommended

---

## Summary Statistics

| Category | Count | Percentage |
|----------|-------|------------|
| Critical (Action Required) | 3 | 4% |
| Warning (Monitor) | 8 | 11% |
| Healthy | 66 | 85% |
| **Total Runtime Dependencies** | **77** | 100% |

---

## Notes

- This analysis focused on **runtime dependencies only** (not devDependencies)
- Dev dependencies like testing libraries, build tools were excluded as they don't affect production
- "Last Update" refers to npm package publish date, not GitHub activity
- Some packages show stale npm but active GitHub - maintainers may need help with releases
- All Radix UI packages are actively maintained as a monorepo

---

## Next Steps

1. Create issues/tickets for Critical packages migration
2. Set up automated dependency monitoring (Dependabot/Renovate)
3. Review `packages/critters/` for potential npm publication
4. Schedule quarterly dependency health reviews
