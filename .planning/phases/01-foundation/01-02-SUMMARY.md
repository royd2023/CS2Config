---
phase: 01-foundation
plan: 02
subsystem: infra
tags: [typescript, zustand, types, stores, cs2-crosshair, cs2-config]

# Dependency graph
requires:
  - phase: 01-01
    provides: Vite 8 + React 19 + TypeScript scaffold with @/ alias and Zustand 5 installed
provides:
  - CrosshairState nested TypeScript interfaces (color, line, dot, outline groups)
  - ConfigState TypeScript interfaces (MouseSettings, KeyBinds, AudioSettings, LaunchOptions)
  - DEPRECATED_CS2_COMMANDS constant as single source of truth for banned commands
  - useCrosshairStore Zustand hook with DEFAULT_CROSSHAIR (style 4, green, gap -3)
  - useConfigStore Zustand hook with DEFAULT_CONFIG (sensitivity 1.0, novid+console enabled)
affects: [01-03, 01-04, 02-crosshair, 03-config, 04-export]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Nested state groups for crosshair (color.r/g/b/a, line.length/thickness/gap, dot.enabled, outline.enabled/thickness)
    - Zustand 5 curried create<T>()() pattern for TypeScript compatibility
    - Fine-grained nested setters on stores (setColor, setLine, etc.) to prevent field wipe on partial updates
    - No localStorage persistence in stores (deferred to Phase 4)

key-files:
  created:
    - src/types/crosshair.ts
    - src/types/config.ts
    - src/lib/constants/deprecatedCmds.ts
    - src/stores/crosshairStore.ts
    - src/stores/configStore.ts
  modified: []

key-decisions:
  - "CrosshairState uses nested type groups (color.r, line.gap pattern) matching CONTEXT.md locked decision"
  - "No localStorage persistence in stores — deferred to Phase 4 per CONTEXT.md locked decision"
  - "Fine-grained nested setters on both stores prevent Zustand top-level merge from wiping nested fields"
  - "DEPRECATED_CS2_COMMANDS excludes -tickrate 128 (launch flag, not cfg command)"
  - "DEFAULT_CROSSHAIR style=4 (classic static) as most common CS2 competitive default"

patterns-established:
  - "Store pattern: extend state interface with setters, use curried create<Store>()(set => ({...defaults, setters}))"
  - "Nested setter pattern: (partial) => set((s) => ({ field: { ...s.field, ...partial } }))"
  - "Constants pattern: as const array + typeof array[number] for union type derivation"

requirements-completed: []

# Metrics
duration: 10min
completed: 2026-04-02
---

# Phase 1 Plan 02: TypeScript Data Model and Zustand Stores Summary

**Five typed files forming the state/constants layer: CrosshairState and ConfigState nested interfaces, DEPRECATED_CS2_COMMANDS constant, and two Zustand stores initialized with CS2 competitive defaults**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-02T23:10:12Z
- **Completed:** 2026-04-02T23:20:00Z
- **Tasks:** 2
- **Files modified:** 5 created

## Accomplishments
- CrosshairState type with nested groups (color.r/g/b/a, line.length/thickness/gap, dot.enabled, outline.enabled/thickness) plus CrosshairStyle union type
- ConfigState type covering all Phase 3 fields: mouse sensitivity/DPI, 15 key bind actions, audio settings, and safe launch option presets
- DEPRECATED_CS2_COMMANDS array (cl_updaterate, cl_cmdrate, cl_interp, cl_interp_ratio, rate) importable by cfgGenerator and its tests
- useCrosshairStore with fine-grained setColor/setLine/setDot/setOutline setters preventing partial-update field wipe
- useConfigStore with setMouse/setBind/setAudio/setLaunch setters; both stores export DEFAULT_* constants for Plan 03 test imports

## Task Commits

Each task was committed atomically:

1. **Task 1: TypeScript type definitions and deprecated commands constants** - `5fbe08d` (feat)
2. **Task 2: Zustand stores with CS2 defaults** - `d38a29f` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/types/crosshair.ts` - CrosshairColor, CrosshairLine, CrosshairDot, CrosshairOutline, CrosshairStyle, CrosshairState interfaces
- `src/types/config.ts` - MouseSettings, BindAction, KeyBinds, AudioSettings, LaunchOptions, ConfigState interfaces
- `src/lib/constants/deprecatedCmds.ts` - DEPRECATED_CS2_COMMANDS as const array + DeprecatedCommand type
- `src/stores/crosshairStore.ts` - useCrosshairStore hook + DEFAULT_CROSSHAIR export with nested setters
- `src/stores/configStore.ts` - useConfigStore hook + DEFAULT_CONFIG export with nested setters

## Decisions Made
- No localStorage persistence added to stores — CONTEXT.md explicitly defers this to Phase 4
- Fine-grained nested setters are required (not optional) because Zustand's set only merges top-level; Phase 2 sliders depend on setColor/setLine
- DEPRECATED_CS2_COMMANDS excludes -tickrate 128 because it is a launch flag, not a cfg command

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All five state/constants files ready for Plan 03 (cfgGenerator tests and implementation)
- DEFAULT_CROSSHAIR and DEFAULT_CONFIG exported for direct import in test assertions
- DEPRECATED_CS2_COMMANDS importable by cfgGenerator.ts (to skip) and cfgGenerator.test.ts (to verify absence)
- useCrosshairStore and useConfigStore readable from browser devtools with sensible CS2 defaults
- npm run build exits 0 with no TypeScript errors (16 modules, ~110ms)

## Self-Check: PASSED

All 5 source files exist on disk. Both task commits (5fbe08d, d38a29f) confirmed in git log. TypeScript and build pass with 0 errors.

---
*Phase: 01-foundation*
*Completed: 2026-04-02*
