---
"@opensourceframework/next-compose-plugins": patch
---

Fixed critical babel-traverse vulnerability by removing legacy babel-core@6.26.3 dependency. Upgraded jest from 24.7.1 to 29.7.0 to address form-data vulnerability.

- Removed babel-core@6.26.3 (had critical babel-traverse vulnerability GHSA-67hx-6x53-jw92)
- Upgraded jest from 24.7.1 to 29.7.0
- All 27 tests pass with 98.98% line coverage
