---
"@opensourceframework/next-cookies": patch
---

Added comprehensive security-focused test coverage (30 new tests) for cookie handling.

Security tests include:
- Cookie injection attack prevention
- Special characters in cookie values (XSS payloads, unicode, emojis)
- Large cookie handling (4KB+ values, 50+ cookies)
- Edge cases (null context, missing headers, malformed cookies)
- URL encoding edge cases

All 37 tests pass.
