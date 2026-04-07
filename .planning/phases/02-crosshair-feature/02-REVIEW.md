---
phase: 02-crosshair-feature
reviewed: 2026-04-07T00:00:00Z
depth: standard
files_reviewed: 22
files_reviewed_list:
  - src/components/ui/CopyButton.tsx
  - src/components/ui/Slider.tsx
  - src/features/crosshair/__tests__/ColorSection.test.tsx
  - src/features/crosshair/__tests__/CrosshairDesigner.test.tsx
  - src/features/crosshair/__tests__/CrosshairPreview.test.tsx
  - src/features/crosshair/__tests__/ImportCodeBar.test.tsx
  - src/features/crosshair/__tests__/SegmentedButtonGroup.test.tsx
  - src/features/crosshair/__tests__/SliderRow.test.tsx
  - src/features/crosshair/__tests__/ToggleSwitch.test.tsx
  - src/features/crosshair/defaults.ts
  - src/index.css
  - src/App.tsx
  - src/features/crosshair/CrosshairDesigner.tsx
  - src/features/crosshair/index.ts
  - src/features/crosshair/CrosshairPreview.tsx
  - src/features/crosshair/SectionCard.tsx
  - src/features/crosshair/SegmentedButtonGroup.tsx
  - src/features/crosshair/SliderRow.tsx
  - src/features/crosshair/ToggleSwitch.tsx
  - src/features/crosshair/ColorSwatch.tsx
  - src/features/crosshair/ColorSection.tsx
  - src/features/crosshair/ImportCodeBar.tsx
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-07
**Depth:** standard
**Files Reviewed:** 22
**Status:** issues_found

## Summary

The crosshair designer feature is well-structured with clear component boundaries, a clean Zustand store, and good test coverage overall. No security vulnerabilities or data-loss risks were found. There are four warnings representing functional bugs — notably a double-fire event bug in `ToggleSwitch`, hidden-but-focusable interactive controls, a preview rendering discrepancy at `thickness=0.5`, and unhandled store states for unsupported crosshair styles. Four informational items cover dead code and minor type/logic inconsistencies.

---

## Warnings

### WR-01: ToggleSwitch double-fires onChange when label text is clicked

**File:** `src/features/crosshair/ToggleSwitch.tsx:11-30`

**Issue:** The outer `<label>` element wraps both a `<span>` (label text) and a `<button role="switch">`. When the user clicks the text span, the browser's label activation fires a synthetic click on the label's associated control. However, `<label>` implicitly activates the first interactive descendant — the `<button>`. That synthetic click triggers the button's `onClick` handler, then the original click event also bubbles through the button a second time. The result is `onChange` being called twice per text-click, toggling the switch on then immediately off (net no-op from the user's perspective). The test in `ToggleSwitch.test.tsx:34-40` exercises this path but only asserts the call happened, not that it was called exactly once, so the bug passes tests silently.

**Fix:** Remove the wrapping `<label>` element and use an explicit `id`/`htmlFor` linkage, or move the button outside the label and use a plain `<div>` as the row container:

```tsx
export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  const id = React.useId();
  return (
    <div className="flex items-center justify-between cursor-pointer h-11">
      <span id={id} className="text-sm text-[#e5e5e5]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className={[
          'relative w-9 h-5 rounded-[10px] transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f97316] focus-visible:outline-offset-2',
          checked ? 'bg-[#f97316]' : 'bg-[#3a3a3a]',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-150',
            checked ? 'translate-x-4' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  );
}
```

---

### WR-02: Hidden toggle controls remain keyboard-focusable

**File:** `src/features/crosshair/CrosshairDesigner.tsx:47-60`

**Issue:** Controls that should be hidden (Center Dot, T-Style, Follow Recoil) use `className={condition ? '' : 'hidden'}` on a wrapper `<div>`. The Tailwind `hidden` class applies `display: none`, which does remove the element from the tab order in modern browsers. However the child `ToggleSwitch` renders a `<button>` — and `display: none` on a parent does correctly remove focus. This specific concern is mitigated by `display: none`. The actual bug is that setting `hidden` on the outer `<div>` but leaving the `ToggleSwitch` rendered means screen readers may still announce the control depending on the accessibility tree implementation, and more importantly `aria-checked` state on the hidden button is still present and readable. Prefer `aria-hidden` or conditional rendering for cleaner semantics.

**Fix:** Replace CSS-hiding with conditional rendering for controls whose state does not need to be persisted in the DOM when invisible:

```tsx
{visibility.centerDot && (
  <ToggleSwitch label="Center Dot" checked={dot.enabled}
    onChange={(v) => setDot({ enabled: v })} />
)}
{visibility.tStyle && (
  <ToggleSwitch label="T-Style" checked={tStyle}
    onChange={(v) => set({ tStyle: v })} />
)}
{visibility.followRecoil && (
  <ToggleSwitch label="Follow Recoil" checked={followRecoil}
    onChange={(v) => set({ followRecoil: v })} />
)}
```

Note: The existing tests for hidden controls (`CrosshairDesigner.test.tsx:91-113`) rely on `.closest('.hidden')` and will need to be updated to check that the element is absent from the DOM.

---

### WR-03: SVG preview renders thickness at 1px minimum while slider shows 0.5

**File:** `src/features/crosshair/CrosshairPreview.tsx:9`

**Issue:** `const thickness = Math.max(1, line.thickness)` clamps the rendered SVG line thickness to a minimum of 1px. The `SliderRow` for Line Thickness in `CrosshairDesigner.tsx` has `min={0.5}`, so a user can set thickness to `0.5` and see `0.5` displayed in the number input, but the SVG preview will render as `1px`. This is a silent visual discrepancy — the preview does not reflect the actual exported value. Depending on the intent, either the slider minimum should be raised to `1`, or the SVG should render at sub-pixel thickness.

**Fix (option A — raise slider minimum to match render minimum):**

```tsx
// CrosshairDesigner.tsx line 41
<SliderRow label="Line Thickness" min={1} max={5} step={0.5} value={line.thickness}
  onChange={(v) => setLine({ thickness: v })} />
```

**Fix (option B — remove the clamp and let SVG render sub-pixel):**

```tsx
// CrosshairPreview.tsx line 9
const thickness = line.thickness; // SVG handles sub-pixel rendering natively
```

---

### WR-04: Unsupported CrosshairStyle values (0, 1) produce silent fallback behaviour

**File:** `src/features/crosshair/CrosshairDesigner.tsx:16-22` and `src/features/crosshair/defaults.ts:4-9`

**Issue:** `CrosshairStyle` in `types/crosshair.ts` is typed as `0 | 1 | 2 | 3 | 4 | 5`. Both `STYLE_DEFAULTS` and `STYLE_VISIBILITY` only cover styles `2`–`5`. If the store is ever set to `style: 0` or `style: 1` (e.g. via an import code that decodes to these values, or a future store migration), `CrosshairDesigner` will silently fall back to `STYLE_VISIBILITY[4]`, showing incorrect controls. `handleStyleChange` will silently no-op for those values since `STYLE_DEFAULTS[0]` is `undefined`.

**Fix:** Add explicit guards to surface unsupported styles rather than silently falling back:

```ts
// defaults.ts — narrow the key type to the supported subset
export const STYLE_DEFAULTS: Record<2 | 3 | 4 | 5, CrosshairState> = { ... };
export const STYLE_VISIBILITY: Record<2 | 3 | 4 | 5, StyleVisibility> = { ... };
```

```tsx
// CrosshairDesigner.tsx
const handleStyleChange = (newStyle: number) => {
  const defaults = STYLE_DEFAULTS[newStyle as 2 | 3 | 4 | 5];
  if (!defaults) {
    console.warn(`Unsupported crosshair style: ${newStyle}`);
    return;
  }
  set(defaults);
};
```

---

## Info

### IN-01: Slider.tsx is dead code — not used anywhere in the codebase

**File:** `src/components/ui/Slider.tsx`

**Issue:** `Slider.tsx` exports a `Slider` component that is never imported. All slider usage in the feature goes through `SliderRow.tsx`. The file will cause confusion for future maintainers who may wonder which slider component to use.

**Fix:** Delete `src/components/ui/Slider.tsx` unless it is planned for use in a future feature, in which case add a comment documenting the intended consumer.

---

### IN-02: SliderRow rounding logic ignores the slider's step parameter

**File:** `src/features/crosshair/SliderRow.tsx:21`

**Issue:** `commitInput` always rounds committed values to one decimal place (`Math.round(n * 10) / 10`) regardless of the `step` prop. For integer-step sliders (color channels, step=1), a user entering `128.4` commits `128.4` instead of `128`. The clamping is correct but the quantization is inconsistent with the slider's own step constraints.

**Fix:** Quantize to the nearest step value instead of hardcoding one decimal:

```ts
const commitInput = () => {
  const n = parseFloat(inputStr);
  if (isNaN(n)) {
    setInputStr(String(value));
    onChange(value);
    return;
  }
  const stepped = Math.round(n / step) * step;
  const precision = step % 1 === 0 ? 0 : 1;
  const clamped = parseFloat(Math.min(max, Math.max(min, stepped)).toFixed(precision));
  setInputStr(String(clamped));
  onChange(clamped);
};
```

---

### IN-03: outlineFill silently uses crosshair alpha instead of being fully opaque

**File:** `src/features/crosshair/CrosshairPreview.tsx:11`

**Issue:** `const outlineFill = \`rgba(0,0,0,${color.a / 255})\`` ties the outline opacity to the crosshair's alpha. If alpha is low (e.g. 50), the outline also becomes transparent, potentially making the outline invisible while the crosshair arms themselves are semi-transparent. In CS2 the outline is always rendered fully opaque. This may be intentional for the preview, but it will produce visually incorrect results at low alpha values.

**Fix:** Use a fixed opacity for the outline layer:

```tsx
const outlineFill = 'rgba(0,0,0,0.85)'; // Outline is always near-opaque in CS2
```

---

### IN-04: CrosshairDesigner.test.tsx mock resets mockState but vi.fn() references may drift

**File:** `src/features/crosshair/__tests__/CrosshairDesigner.test.tsx:33-51`

**Issue:** `beforeEach` reassigns the `mockState` object variable but the `vi.mock` factory captures the module-level `mockState` reference via closure: `useCrosshairStore: () => mockState`. Since `beforeEach` reassigns the variable (not mutates it), and the module mock closure reads the variable at call time, this works correctly in Vitest. However the `set` mock on line 46 calls `Object.assign(mockState, partial)` against the new object. If a test calls `set` and then another test reads `mockState`, the state from the prior test's `set` call will have mutated the object created in `beforeEach` of the current test. This is subtle: the test at line 121 fires a style button click which calls `set`, mutating `mockState.style` to `5` — if tests run in order, subsequent tests begin with a polluted object. Currently tests appear isolated only because `beforeEach` reassigns before each test runs, but the `set` mock in `beforeEach` is a fresh `vi.fn()` that doesn't reflect the previous `Object.assign`. This is benign today but fragile.

**Fix:** Use `vi.fn().mockImplementation(...)` and reset via `mockClear` rather than replacing the whole object, or avoid the `Object.assign` side-effect in the mock and assert on the mock call arguments only.

---

_Reviewed: 2026-04-07_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
