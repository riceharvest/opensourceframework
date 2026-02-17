---
"@opensourceframework/react-a11y-utils": patch
"@opensourceframework/seeded-rng": patch
"@opensourceframework/next-csrf": patch
---

fix: resolve code quality issues across multiple packages

- react-a11y-utils: rename CSSProperties to A11yCSSProperties to avoid shadowing React's type
- seeded-rng: add error logging in catch block instead of silently swallowing errors
- next-csrf: return null for missing cookies (instead of empty string) to distinguish from empty values
- next-csrf: fix HttpError constructor to have proper default status value
- next-csrf: add @returns type info to nextCsrf() function JSDoc
