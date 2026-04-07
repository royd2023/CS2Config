---
phase: 2
slug: crosshair-feature
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-07
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.1.2 + @testing-library/react ^16.3.2 |
| **Config file** | vite.config.ts (test block with globals: true, environment: jsdom) |
| **Quick run command** | `npx vitest run src/features/crosshair/__tests__/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/features/crosshair/__tests__/`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | XHAIR-01 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/CrosshairPreview.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 0 | XHAIR-02 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/SegmentedButtonGroup.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 0 | XHAIR-03,XHAIR-04 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/SliderRow.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 0 | XHAIR-04 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/ColorSection.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-05 | 01 | 0 | XHAIR-05,XHAIR-06 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/ToggleSwitch.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-06 | 01 | 0 | XHAIR-07 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/CrosshairDesigner.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-07 | 01 | 0 | XHAIR-08,EXPO-02 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/ImportCodeBar.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-08 | 01 | 0 | XHAIR-09 | — | N/A | unit | `npx vitest run src/features/crosshair/__tests__/CrosshairPreview.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/features/crosshair/__tests__/CrosshairPreview.test.tsx` — stubs for XHAIR-01, XHAIR-09
- [ ] `src/features/crosshair/__tests__/SegmentedButtonGroup.test.tsx` — stubs for XHAIR-02
- [ ] `src/features/crosshair/__tests__/SliderRow.test.tsx` — stubs for XHAIR-03
- [ ] `src/features/crosshair/__tests__/ColorSection.test.tsx` — stubs for XHAIR-04
- [ ] `src/features/crosshair/__tests__/ToggleSwitch.test.tsx` — stubs for XHAIR-05, XHAIR-06
- [ ] `src/features/crosshair/__tests__/CrosshairDesigner.test.tsx` — stubs for XHAIR-07
- [ ] `src/features/crosshair/__tests__/ImportCodeBar.test.tsx` — stubs for XHAIR-08, EXPO-02

*All test files are Wave 0 — must exist before Wave 1 component work begins.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SVG crosshair visually matches in-game at CS2 scale | XHAIR-01 | Pixel accuracy requires visual comparison to actual CS2 | Open dev server, set default values, compare SVG size to in-game screenshot |
| Share code pastes correctly into CS2 | XHAIR-08 | Requires running CS2 client | Copy generated code, paste into CS2 console via crosshair import dialog |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
