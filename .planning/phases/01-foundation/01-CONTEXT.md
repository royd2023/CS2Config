# Phase 1: Foundation - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffold, typed data models, pure generator functions, Zustand stores, and shared UI primitives — the engine and toolkit that all other phases build on. No production-visible UI in this phase; everything here unblocks Phases 2 and 3.

</domain>

<decisions>
## Implementation Decisions

### UI Primitive Scope
- Functional only — correct behavior, no custom styling
- Styling deferred to Phase 4 when the full design system is defined
- No isolation tests (Storybook or render tests) — primitives are implicitly tested via Phase 2 and 3 consumers
- ColorPicker: native HTML color input (no custom RGB+alpha control yet)
- CopyButton: accepts a `value` prop and handles clipboard writing internally; shows a brief success state after copy

### Data Model Design
- Crosshair parameters use grouped/nested TypeScript types (e.g., `crosshair.color.r`, `crosshair.line.gap`, `crosshair.line.thickness`)
- Two separate Zustand stores: `crosshairStore` and `configStore` (not one combined store)
- Stores initialize with sensible CS2 default values — Phase 2 renders immediately without empty-state handling
- No localStorage persistence in Phase 1 — deferred to Phase 4 alongside the share-URL feature

### Test Coverage
- Crosshair code generator: tests verify valid CS2 import code format (`CSGO-XXXXX-...`) and absence of deprecated fields
- autoexec.cfg generator: critical test is confirming deprecated commands never appear in output (e.g., `cl_updaterate`, `cl_interp`, `cl_cmdrate`, `-tickrate 128`)
- Deprecated command list lives in a shared constants file used by both the generator and the tests — single source of truth

### TypeScript Config
- `strict: true` — standard strict mode (noImplicitAny, strictNullChecks, etc.)
- `noEmitOnError: true` — build fails on TypeScript errors (aligns with phase success criterion)
- Path alias configured from Phase 1: `@/` pointing to `src/` for cleaner cross-phase imports

### Claude's Discretion
- Exact folder/file structure within src/ (e.g., src/stores/, src/lib/, src/components/ui/)
- Vitest configuration details
- Exact default crosshair and config values (use sensible CS2 community defaults)
- Any additional tsconfig flags beyond strict + noEmitOnError

</decisions>

<specifics>
## Specific Ideas

- No specific references given — open to standard Vite + React + TypeScript project conventions
- Generator functions should be pure (no side effects) — easy to unit test and reason about

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-02*
