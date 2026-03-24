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

**Remaining work:**
- Add support for multiple scales via abstraction.
- Improve error handling and implement retry backoff in cloud sync.
- Write comprehensive unit and integration tests.
- Add end-to-end tests covering hardware interactions.

## docs-bot

The `@opensourceframework/docs-bot` CLI provides fast fuzzy search across package READMEs, descriptions, and source code.

**Completed:**
- Fuzzy search using `fuse.js`.
- Metadata caching for faster repeated queries.
- Source code indexing (`src/**/*.ts`).
- Package comparison command (`docs-bot compare <pkg1> <pkg2>`).
- Built as a global CLI with proper shebang and bin mapping (`dist/index.js`).

**Remaining enhancements:**
- Integrate with LLM to answer natural language questions about the monorepo.
- Generate a static site with package documentation.
- Provide a Web UI for interactive browsing.
- Add automated tests (unit and integration).
- Publish to npm.

---

*This file tracks concrete progress and remaining gaps for pospos2 handlers and docs-bot.*