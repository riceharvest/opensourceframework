---
'@opensourceframework/next-optimized-images': patch
---

Restrict explicit loader detection to the target project's node_modules so parent workspaces do not cause false positives.
