# Phase 2: Crosshair Feature - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

A live crosshair designer where users configure visual parameters (style, size, thickness, gap, color, center dot, T-style, outline) and see a real-time SVG preview. The output is a CS2-ready `CSGO-XXXXX-...` import code they can copy and paste directly into CS2. Config builder, routing, and sharing are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Preview Presentation
- Background: solid dark (#1a1a1a or similar) — mimics CS2's dark environment
- Preview panel position: full-width at top of page, controls stacked below
- Crosshair scale: realistic CS2 scale (actual pixel size as it appears in-game)
- No center marker or reticle — just the crosshair on the dark background

### Control Layout
- Controls organized into grouped sections below the preview (e.g., Style, Size & Shape, Color, Outline)
- Each slider has an editable number input beside it for precise value entry
- Boolean parameters (center dot, T-style, outline) use toggle switches inline with their label
- CS2 import code is always visible at the bottom of the controls — no extra clicks needed to reveal it

### Style Selector
- Style picker is a segmented button group (4 buttons in a row) at the top of the controls section
- Switching style resets all parameters to CS2 defaults for that style
- Controls that don't apply to the selected style are hidden (not just disabled)
- Text labels only — no thumbnail previews in the style buttons

### Color Picking
- Color input: separate R, G, B sliders + separate alpha slider — matches CS2's internal value format
- A small color swatch sits beside the sliders, showing the current color with checkerboard behind it to indicate alpha
- Alpha range: 0–255 (matching CS2's `cl_crosshaircolor_a` convention)
- No color presets — slider-only control

### Claude's Discretion
- Exact visual styling of grouped sections (borders, spacing, card vs flat)
- Copy button UX (icon, tooltip, confirmation flash)
- Responsive breakpoints for stacked vs side-by-side on larger screens

</decisions>

<specifics>
## Specific Ideas

- Color range 0–255 is intentional: it matches what CS2 players already know from `cl_crosshaircolor_r/g/b/a`
- Style switching resetting to defaults mirrors how CS2 itself behaves when you change crosshair style

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-crosshair-feature*
*Context gathered: 2026-04-02*
