---
phase: 02-crosshair-feature
plan: "01"
subsystem: crosshair
tags: [test-stubs, data-model, css, ui-primitives]
dependency_graph:
  requires: [01-04-PLAN.md]
  provides: [test scaffolding for all 7 crosshair components, STYLE_DEFAULTS, STYLE_VISIBILITY, STYLE_OPTIONS, slider-range CSS, className props on Slider/CopyButton]
  affects: [02-02-PLAN.md, 02-03-PLAN.md, 02-04-PLAN.md]
tech_stack:
  added: []
  patterns: [vitest it.todo stubs, Record<number, CrosshairState> defaults, @layer components CSS]
key_files:
  created:
    - src/features/crosshair/__tests__/CrosshairPreview.test.tsx
    - src/features/crosshair/__tests__/SegmentedButtonGroup.test.tsx
    - src/features/crosshair/__tests__/SliderRow.test.tsx
    - src/features/crosshair/__tests__/ColorSection.test.tsx
    - src/features/crosshair/__tests__/ToggleSwitch.test.tsx
    - src/features/crosshair/__tests__/ImportCodeBar.test.tsx
    - src/features/crosshair/__tests__/CrosshairDesigner.test.tsx
    - src/features/crosshair/defaults.ts
  modified:
    - src/index.css
    - src/components/ui/Slider.tsx
    - src/components/ui/CopyButton.tsx
decisions:
  - "STYLE_DEFAULTS sets gap: -3 for Classic Static (style 4) to match DEFAULT_CROSSHAIR from store; other styles use gap: 0"
  - "STYLE_VISIBILITY.tStyle is false for Tee (5) per UI-SPEC — Tee crosshair has no T-style variant"
  - "Test stubs import render/screen from @testing-library/react even though unused — validates import path at stub stage"
metrics:
  duration: ~12 min
  completed: 2026-04-07
  tasks_completed: 3
  files_created: 8
  files_modified: 3
---

# Phase 2 Plan 01: Wave 0 Foundation Summary

Wave 0 test scaffolding, per-style defaults data model, slider/toggle CSS classes, and className prop upgrades for Phase 1 UI primitives.

## What Was Built

**Task 1 — 7 test stub files** in `src/features/crosshair/__tests__/`:
- 39 `it.todo()` stubs covering all XHAIR-01 through XHAIR-09 and EXPO-02 requirements
- All 7 files run under Vitest with exit code 0 (all skipped as todos)
- Imports from `@testing-library/react` and `vitest` validated at stub stage

**Task 2 — `src/features/crosshair/defaults.ts`**:
- `STYLE_DEFAULTS`: full `CrosshairState` presets for styles 2, 3, 4, 5
- `STYLE_VISIBILITY`: per-style boolean map for `centerDot`, `tStyle`, `followRecoil` controls
- `STYLE_OPTIONS`: segmented button config (Classic Static=4, Classic Dynamic=3, Classic=2, Tee=5)
- Imports `CrosshairState` from `@/types/crosshair`; TypeScript compiles clean

**Task 3 — CSS + UI primitive upgrades**:
- `src/index.css`: `.slider-range` class with cross-browser `-webkit-appearance`/`-moz` thumb styling, focus ring using `#f97316` orange; `.number-input` class for numeric side inputs
- `Slider.tsx`: added optional `className?: string` prop passed to `<input type="range">`
- `CopyButton.tsx`: added optional `className?: string` prop passed to `<button>`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Planning files deleted by git reset --soft**
- **Found during:** Task 1 commit
- **Issue:** `git reset --soft f6bcf09` in the worktree left staged deletions for planning files (02-01-PLAN.md through 02-VALIDATION.md) that existed in the base commit but not in the older worktree state. These got accidentally committed as deletions in the Task 1 commit.
- **Fix:** Ran `git checkout f6bcf09 -- .planning/` to restore all planning files, then committed the restoration as a separate fix commit.
- **Files modified:** `.planning/phases/02-crosshair-feature/` (8 files restored)
- **Commit:** 7eb4a8e

## Known Stubs

The 7 test files are intentionally all stubs (`it.todo()`). This is by design — Wave 0 establishes the test contract before Wave 1 implements the components. No actual test assertions exist yet; they will be filled in during plans 02-02 through 02-04.

## Threat Flags

None — Wave 0 creates test stubs, static data constants, and CSS only. No user input processing, no network endpoints, no auth paths.

## Self-Check: PASSED

Files verified to exist:
- src/features/crosshair/__tests__/CrosshairPreview.test.tsx — FOUND
- src/features/crosshair/__tests__/SegmentedButtonGroup.test.tsx — FOUND
- src/features/crosshair/__tests__/SliderRow.test.tsx — FOUND
- src/features/crosshair/__tests__/ColorSection.test.tsx — FOUND
- src/features/crosshair/__tests__/ToggleSwitch.test.tsx — FOUND
- src/features/crosshair/__tests__/ImportCodeBar.test.tsx — FOUND
- src/features/crosshair/__tests__/CrosshairDesigner.test.tsx — FOUND
- src/features/crosshair/defaults.ts — FOUND

Commits verified:
- af65a27 test(02-01): add Wave 0 test stub files
- 7eb4a8e fix(02-01): restore planning files deleted by reset
- 04bf7d9 feat(02-01): add defaults.ts
- 0510447 feat(02-01): add slider/toggle CSS classes and className props
