---
'@opensourceframework/bcryptjs': patch
---

Remove the unused native `bcrypt` development dependency to eliminate vulnerable install-time transitive packages from the workspace audit surface.
