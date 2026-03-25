# Long-Term Vision and Next Steps

## pospos2 handlers

The POSPOS2 local agent fully implements the core contract defined in the rewrite plan:
- `/health`
- `/version`
- `/scale`
- `/events` (SSE)
- `/outbox/status`
- `/outbox/retry`
- `/outbox/transactions`
- `/outbox/cleanup`
- `/device/register`
- `/device/config`

OpenAPI specification is available at `apps/agent/openapi.yaml`.

**Completed:**
- Outbox cleanup to archive old synced files.
- Device configuration endpoint.
- OpenAPI documentation.

**Status: All completed.**
- Multiple scales support implemented via `EXTRA_SCALE_PORTS` and `/scales` endpoints.
- Error handling and exponential backoff in outbox sync are in place.
- Comprehensive unit and integration tests exist under `tests/`.
- End-to-end hardware interaction tests are present (e.g., test_scale_simple.py, test_full_ui_flow.py).

## docs-bot

The `@opensourceframework/docs-bot` CLI provides fast fuzzy search across package READMEs, descriptions, and source code.

**Completed:**
- Fuzzy search using `fuse.js`.
- Metadata caching for faster repeated queries.
- Source code indexing (`src/**/*.ts`).
- Package comparison command (`docs-bot compare <pkg1> <pkg2>`).
- Built as a global CLI with proper shebang and bin mapping (`dist/index.js`).

**Status: All completed.**
- LLM integration via `ask` command using OpenRouter.
- Static site generation via `site` command.
- Interactive Web UI with client-side fuzzy search included in static site.
- Automated tests (unit and integration) present in `test/`.
- Published to npm as `@opensourceframework/docs-bot@0.0.1`.

---

*This file tracks concrete progress and remaining gaps for pospos2 handlers and docs-bot.*