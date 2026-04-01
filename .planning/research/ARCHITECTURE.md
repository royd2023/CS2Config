# Architecture Research

**Domain:** React SPA — CS2 crosshair designer + autoexec config builder
**Researched:** 2026-03-31
**Confidence:** HIGH

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Shell (Layout)                        │
│  Nav + section tabs, AdSense placements, global providers        │
├────────────────────────┬────────────────────────────────────────┤
│   Crosshair Section    │         Config Section                  │
│                        │                                         │
│  ┌──────────────────┐  │  ┌──────────────────────────────────┐  │
│  │ CrosshairPreview │  │  │  ConfigForm (sections)           │  │
│  │   (SVG output)   │  │  │  - SensitivitySection            │  │
│  └──────────────────┘  │  │  - NetworkSection                │  │
│  ┌──────────────────┐  │  │  - AudioSection                  │  │
│  │ CrosshairControls│  │  │  - BindsSection                  │  │
│  │  (sliders/inputs)│  │  │  - LaunchOptionsSection          │  │
│  └──────────────────┘  │  └──────────────────────────────────┘  │
│  ┌──────────────────┐  │  ┌──────────────────────────────────┐  │
│  │ CrosshairCode    │  │  │  CfgPreview (read-only textarea) │  │
│  │ (import string)  │  │  └──────────────────────────────────┘  │
│  └──────────────────┘  │  ┌──────────────────────────────────┐  │
│                        │  │  DownloadButton + Instructions   │  │
│                        │  └──────────────────────────────────┘  │
├────────────────────────┴────────────────────────────────────────┤
│                       State Layer (Zustand)                      │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │   useCrosshairStore     │  │     useConfigStore          │   │
│  │  (crosshair params)     │  │  (all cfg settings)         │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      Pure Logic Layer                            │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐  │
│  │ crosshairCodeGen.ts  │  │  cfgGenerator.ts                │  │
│  │ (params → CSGO-xxx)  │  │  (config object → .cfg string)  │  │
│  └──────────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `App` | Provides router and Zustand provider wrappers. Renders layout shell. | Layout |
| `Layout` | Top nav, section tabs/links, AdSense slot placement, page chrome | Section pages, AdUnit |
| `CrosshairSection` | Page-level container for all crosshair UI | CrosshairPreview, CrosshairControls, CrosshairCodeOutput |
| `CrosshairPreview` | Renders live SVG crosshair from params. Pure display — no side effects. | Reads from `useCrosshairStore` |
| `CrosshairControls` | All sliders, selects, and color inputs for crosshair params | Writes to `useCrosshairStore` |
| `CrosshairCodeOutput` | Renders the `CSGO-XXXXX-...` import code. Has copy-to-clipboard button. | Reads from `useCrosshairStore`, calls `crosshairCodeGen.ts` |
| `ConfigSection` | Page-level container for all config builder UI | ConfigForm, CfgPreview, DownloadButton |
| `ConfigForm` | Grouped form sections (sensitivity, network, audio, binds, launch options) | Writes to `useConfigStore` |
| `CfgPreview` | Read-only textarea showing live-generated `.cfg` output | Reads from `useConfigStore`, calls `cfgGenerator.ts` |
| `DownloadButton` | Triggers `file-saver` download of the generated `.cfg` string | Reads generated string, calls `file-saver` |
| `InstallInstructions` | Static content showing file path + copy button | None (static text) |
| `AdUnit` | Google AdSense slot. Calls `push({})` on mount. | `window.adsbygoogle` |
| `useCrosshairStore` | Zustand store for all crosshair parameters | CrosshairControls (write), CrosshairPreview / CrosshairCodeOutput (read) |
| `useConfigStore` | Zustand store for all cfg parameters | ConfigForm (write), CfgPreview / DownloadButton (read) |
| `crosshairCodeGen.ts` | Pure function: crosshair params object → `CSGO-XXXXX-...` share code string | No React dependency |
| `cfgGenerator.ts` | Pure function: config params object → valid `.cfg` file string | No React dependency |

---

## Recommended Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root component — wraps router + providers
│   └── router.tsx               # Route definitions (/ → crosshair, /config, /about)
│
├── features/
│   ├── crosshair/
│   │   ├── components/
│   │   │   ├── CrosshairSection.tsx       # Page container
│   │   │   ├── CrosshairPreview.tsx       # SVG renderer
│   │   │   ├── CrosshairControls.tsx      # All sliders/inputs
│   │   │   └── CrosshairCodeOutput.tsx    # Import code display + copy
│   │   ├── store/
│   │   │   └── useCrosshairStore.ts       # Zustand store + actions
│   │   ├── lib/
│   │   │   └── crosshairCodeGen.ts        # Pure: params → CSGO-xxx string
│   │   └── types.ts                       # CrosshairSettings interface
│   │
│   └── config/
│       ├── components/
│       │   ├── ConfigSection.tsx          # Page container
│       │   ├── ConfigForm.tsx             # Form orchestrator
│       │   ├── sections/
│       │   │   ├── SensitivitySection.tsx
│       │   │   ├── NetworkSection.tsx
│       │   │   ├── AudioSection.tsx
│       │   │   ├── BindsSection.tsx
│       │   │   └── LaunchOptionsSection.tsx
│       │   ├── CfgPreview.tsx             # Live .cfg text output
│       │   ├── DownloadButton.tsx         # file-saver trigger
│       │   └── InstallInstructions.tsx    # Static path + copy button
│       ├── store/
│       │   └── useConfigStore.ts          # Zustand store + actions
│       ├── lib/
│       │   └── cfgGenerator.ts            # Pure: config params → .cfg string
│       └── types.ts                       # ConfigSettings interface
│
├── components/
│   ├── ui/
│   │   ├── Slider.tsx                     # Reusable labeled slider
│   │   ├── ColorPicker.tsx                # Reusable color input
│   │   ├── Select.tsx                     # Reusable select wrapper
│   │   ├── CopyButton.tsx                 # Clipboard copy with feedback
│   │   └── KeybindInput.tsx               # Single bind capture input
│   └── AdUnit.tsx                         # Google AdSense slot component
│
├── layouts/
│   └── MainLayout.tsx                     # Nav, tab bar, footer, ad slots
│
├── hooks/
│   └── useClipboard.ts                    # useClipboard(text) → { copied, copy }
│
├── types/
│   └── global.d.ts                        # window.adsbygoogle declaration
│
└── main.tsx                               # Vite entry, mounts <App />
```

### Structure Rationale

- **`features/crosshair/` and `features/config/`:** Each major section owns its components, store, logic, and types. Cross-feature imports are not allowed — both sections are composed in `App.tsx`/`router.tsx`. This matches the Bulletproof React unidirectional rule: `shared → features → app`.
- **`features/*/lib/`:** Pure TypeScript functions live here with no React imports. They can be unit-tested with Vitest without needing a DOM or component tree. This is the most important isolation in the whole codebase — the code generators should be exercised by tests independent of React.
- **`features/*/store/`:** Zustand store per feature (not one combined store). The crosshair state and config state have zero interdependency — they are never read together in a single action. The Zustand maintainer's guidance is clear: independent data belongs in separate stores.
- **`components/ui/`:** Shared primitive components (Slider, Select, etc.) with no store dependencies. These accept value/onChange as props only. Both features consume them.
- **`layouts/`:** The shell that holds both sections. Ad placements live here so they are predictable across all routes.

---

## Architectural Patterns

### Pattern 1: Pure Generator Functions (No React)

**What:** `crosshairCodeGen.ts` and `cfgGenerator.ts` are plain TypeScript functions that accept a typed params object and return a string. They import nothing from React, Zustand, or any component.

**When to use:** Any transformation that can be described as `(input) => string` — crosshair code generation, .cfg file assembly, validation logic.

**Trade-offs:** Requires passing the full state object rather than reading from a store. The upside is complete testability with Vitest and zero coupling to the UI layer.

**Example:**

```typescript
// features/config/lib/cfgGenerator.ts
import type { ConfigSettings } from '../types';

export function generateCfg(settings: ConfigSettings): string {
  const lines: string[] = [
    '// CS2 Autoexec — generated by CS2 Setup Builder',
    '',
    '// Sensitivity',
    `sensitivity "${settings.sensitivity}"`,
    `zoom_sensitivity_ratio_mouse "${settings.zoomSensitivity}"`,
    '',
    '// Network',
    `rate "${settings.rate}"`,
    '',
    '// Audio',
    `volume "${settings.volume}"`,
    `voice_scale "${settings.voiceScale}"`,
    '',
    '// Binds',
    ...settings.binds.map(b => `bind "${b.key}" "${b.command}"`),
    '',
    'echo "Autoexec loaded."',
  ];
  return lines.join('\n');
}
```

### Pattern 2: Feature-Scoped Zustand Stores

**What:** Each feature has its own `useXxxStore` with the full state shape and all actions co-located. No shared store, no slices pattern needed at this scale.

**When to use:** This project. Two independent domains (crosshair, config) with zero cross-store reads.

**Trade-offs:** If a future feature needs to read crosshair state inside the config section (e.g., "include crosshair in cfg export"), a subscription is needed: `const crosshairSettings = useCrosshairStore(s => s.settings)` inside `cfgGenerator`. That is a one-line addition and does not require a store redesign.

**Example:**

```typescript
// features/crosshair/store/useCrosshairStore.ts
import { create } from 'zustand';
import type { CrosshairSettings } from '../types';

interface CrosshairStore {
  settings: CrosshairSettings;
  update: (patch: Partial<CrosshairSettings>) => void;
  reset: () => void;
}

const DEFAULT_SETTINGS: CrosshairSettings = {
  style: 4,
  size: 3,
  thickness: 1,
  gap: -3,
  color: '#00ff00',
  alpha: 255,
  dot: false,
  outline: false,
  outlineThickness: 1,
};

export const useCrosshairStore = create<CrosshairStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  update: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  reset: () => set({ settings: DEFAULT_SETTINGS }),
}));
```

### Pattern 3: SVG Crosshair Preview as Pure Derived Output

**What:** `CrosshairPreview` is a pure presentation component. It reads from `useCrosshairStore` and derives SVG element props inline — no `useEffect`, no imperative drawing, no `useRef`.

**When to use:** Always for the crosshair preview. The component re-renders automatically on every store update (every slider drag). At 6 SVG elements, this is imperceptible overhead.

**Trade-offs:** React re-renders on every slider drag event. This is fine because the component tree rooted at `CrosshairPreview` is shallow (6 SVG nodes), and Zustand's selector subscription means only `CrosshairPreview` and `CrosshairCodeOutput` re-render — not the entire page — when crosshair state changes.

```typescript
// features/crosshair/components/CrosshairPreview.tsx
import { useCrosshairStore } from '../store/useCrosshairStore';

export function CrosshairPreview() {
  const { size, thickness, gap, color, alpha, dot } = useCrosshairStore(s => s.settings);
  const center = 64;
  const halfLen = size * 4;          // scale to viewBox
  const offset = (gap + thickness / 2) * 4;
  const fill = color;
  const opacity = alpha / 255;

  return (
    <svg viewBox="0 0 128 128" className="w-32 h-32">
      {/* Top */}
      <rect x={center - thickness * 2} y={center - offset - halfLen}
            width={thickness * 4} height={halfLen} fill={fill} opacity={opacity} />
      {/* Bottom */}
      <rect x={center - thickness * 2} y={center + offset}
            width={thickness * 4} height={halfLen} fill={fill} opacity={opacity} />
      {/* Left */}
      <rect x={center - offset - halfLen} y={center - thickness * 2}
            width={halfLen} height={thickness * 4} fill={fill} opacity={opacity} />
      {/* Right */}
      <rect x={center + offset} y={center - thickness * 2}
            width={halfLen} height={thickness * 4} fill={fill} opacity={opacity} />
      {dot && <circle cx={center} cy={center} r={thickness * 2} fill={fill} opacity={opacity} />}
    </svg>
  );
}
```

### Pattern 4: Shared UI Primitives with No Store Dependencies

**What:** `components/ui/` holds Slider, Select, ColorPicker, CopyButton, KeybindInput. These accept `value` and `onChange` as props only. They know nothing about stores.

**When to use:** Any time the same input type appears in both the crosshair section and the config section (e.g., labeled sliders appear in both).

**Trade-offs:** Slightly more prop-passing in the feature components. The benefit is these primitives are portable — they can be tested in isolation and reused without side effects.

---

## Data Flow

### Crosshair Parameter Flow

```
User drags slider (CrosshairControls)
    ↓
onChange handler calls useCrosshairStore.update({ thickness: 2 })
    ↓
Zustand updates settings object in store
    ↓
CrosshairPreview (subscribed) re-renders SVG with new props
CrosshairCodeOutput (subscribed) re-derives CSGO-xxx string via crosshairCodeGen()
    ↓
User sees updated preview and updated import code simultaneously
```

### Config Parameter Flow

```
User changes input (ConfigForm section)
    ↓
onChange handler calls useConfigStore.update({ sensitivity: '1.5' })
    ↓
Zustand updates settings object in store
    ↓
CfgPreview (subscribed) re-derives .cfg string via cfgGenerator()
    ↓
User sees live .cfg text update in the preview textarea
    ↓
User clicks Download
    ↓
DownloadButton reads current .cfg string, calls file-saver saveAs(blob, 'autoexec.cfg')
    ↓
Browser downloads the file
```

### State Management Summary

```
useCrosshairStore (Zustand)
    ├── subscribed by: CrosshairPreview, CrosshairCodeOutput
    └── written by: CrosshairControls

useConfigStore (Zustand)
    ├── subscribed by: CfgPreview, DownloadButton
    └── written by: ConfigForm (all sub-sections)
```

The two stores never communicate. If a future feature requires crosshair params inside the cfg output (e.g., `cl_crosshairsize 3` embedded in autoexec), `cfgGenerator.ts` can accept a second argument `crosshairSettings?: CrosshairSettings` and the caller reads both stores — no store refactor needed.

---

## Suggested Build Order

Dependencies in this app flow from the inside out: pure logic → store → components. Build in this sequence to avoid rework.

### Phase 1 — Data Models and Generators (no UI)

Build first because everything else depends on these shapes being correct.

1. `features/crosshair/types.ts` — Define `CrosshairSettings` interface with all CS2 crosshair params
2. `features/config/types.ts` — Define `ConfigSettings` interface with all cfg fields
3. `features/crosshair/lib/crosshairCodeGen.ts` — Pure function, write Vitest tests first
4. `features/config/lib/cfgGenerator.ts` — Pure function, write Vitest tests first

If the data shape is wrong here, it propagates everywhere. Nail this first.

### Phase 2 — Zustand Stores

1. `features/crosshair/store/useCrosshairStore.ts`
2. `features/config/store/useConfigStore.ts`

Both are trivial once types are defined. Test that `update()` merges correctly.

### Phase 3 — Shared UI Primitives

Build before feature components so the feature work is unblocked.

1. `components/ui/Slider.tsx`
2. `components/ui/Select.tsx`
3. `components/ui/ColorPicker.tsx`
4. `components/ui/CopyButton.tsx`
5. `components/ui/KeybindInput.tsx`

### Phase 4 — Crosshair Feature (highest visual interest, validate the core concept)

Build the crosshair section before the config section. It has more design complexity (SVG preview) and validates that the data model and generators work end-to-end.

1. `CrosshairPreview.tsx` — SVG output
2. `CrosshairControls.tsx` — Sliders/inputs wired to store
3. `CrosshairCodeOutput.tsx` — Import code display with copy button
4. `CrosshairSection.tsx` — Compose the above

### Phase 5 — Config Feature

1. Individual section components (SensitivitySection, NetworkSection, etc.)
2. `ConfigForm.tsx` — Composes section components
3. `CfgPreview.tsx` — Live .cfg textarea
4. `DownloadButton.tsx` + `InstallInstructions.tsx`
5. `ConfigSection.tsx` — Compose the above

### Phase 6 — App Shell and Routing

1. `MainLayout.tsx` — Nav, section tabs, footer
2. `router.tsx` + `App.tsx` — Wire routes to section pages
3. `AdUnit.tsx` — Add AdSense slots to Layout after routing works

### Phase 7 — Polish and Deployment

1. Responsive layout testing
2. `public/ads.txt` for AdSense
3. Vercel deploy, then apply for AdSense

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google AdSense | Script tag in `index.html` + `AdUnit` component that calls `(window.adsbygoogle = window.adsbygoogle || []).push({})` in `useEffect` | Only renders in production. Wrap push call in try/catch to suppress dev errors. Do not render inside React.StrictMode double-invoke without protection. |
| Vercel | Zero-config deploy of Vite SPA. `vercel.json` not needed for basic deploy. | `public/ads.txt` served at root by Vercel automatically. No rewrites needed for client-side routing when using react-router v7 with hash-based or proper 404 config. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `CrosshairControls` → `useCrosshairStore` | Direct Zustand write via `update()` | No prop drilling. Each control calls `update({ paramName: value })`. |
| `CrosshairPreview` → `useCrosshairStore` | Zustand selector subscription | Reads full `settings` object. Re-renders on any setting change. Acceptable at 6 SVG nodes. |
| `CrosshairCodeOutput` → `crosshairCodeGen.ts` | Function call with store state as argument | The component reads settings from the store, passes to the pure function, renders the result. |
| `CfgPreview` → `cfgGenerator.ts` | Same pattern as above | Component reads config store, passes to generator, renders string in textarea. |
| `DownloadButton` → `file-saver` | Calls `saveAs(new Blob([cfgString], { type: 'text/plain' }), 'autoexec.cfg')` | The button component either regenerates the string from the store or receives it as a prop from ConfigSection. Prefer receiving as prop to avoid double generation. |
| `crosshair` feature ↔ `config` feature | No direct import allowed | If crosshair params need to appear in the .cfg, pass them through the app layer (ConfigSection imports from crosshair store only at composition time, not feature-to-feature). |

---

## Anti-Patterns

### Anti-Pattern 1: Putting Generator Logic Inside Components

**What people do:** Compute the CSGO-xxx string or .cfg string directly inside the JSX render function or a `useMemo` call in the component.

**Why it's wrong:** The generation logic becomes untestable without mounting a component. Bugs in the output format (wrong CS2 syntax, broken import codes) are harder to catch without a DOM test environment.

**Do this instead:** Keep all string generation in `crosshairCodeGen.ts` and `cfgGenerator.ts`. Components call these functions and render the result. Test the functions with Vitest directly — no React Testing Library needed for these tests.

### Anti-Pattern 2: One Monolithic Form Component

**What people do:** Put all config form fields into a single large `ConfigForm.tsx` with hundreds of lines of JSX.

**Why it's wrong:** The config builder has 5 distinct categories (sensitivity, network, audio, binds, launch options) each with different input types. A monolithic form is hard to read, hard to test sections in isolation, and hard to add/remove fields without touching unrelated code.

**Do this instead:** Each category gets its own section component (`SensitivitySection`, `NetworkSection`, etc.). Each section writes to the config store independently. `ConfigForm.tsx` is a thin composition of section components.

### Anti-Pattern 3: Using Context API for Crosshair State

**What people do:** Use `createContext` + `useState` + a Provider at the top of the tree to share crosshair state between the preview and controls.

**Why it's wrong:** Every time a slider fires (on every mouse move), the context value changes and React re-renders every component inside the Provider, including unrelated parts of the UI like the config form and navigation. This causes visible jank during rapid slider movement.

**Do this instead:** Zustand with per-component selectors. Only components that call `useCrosshairStore(s => s.settings)` re-render when the store updates. The config form and layout are unaffected by crosshair slider events.

### Anti-Pattern 4: Importing Features from Other Features

**What people do:** Import a component from `features/crosshair/` inside a component in `features/config/`, or vice versa.

**Why it's wrong:** Creates hidden coupling. When the crosshair type signature changes, you now have a compilation error deep inside the config feature that is not immediately obvious.

**Do this instead:** Cross-feature dependencies are composed at the app level. If `ConfigSection` needs to display crosshair settings, it receives them as props from a parent that reads both stores — the two features themselves remain blind to each other.

### Anti-Pattern 5: Rendering AdUnit Inside a Frequently Re-Rendering Component

**What people do:** Place `<AdUnit>` inside a component that re-renders on every crosshair slider drag.

**Why it's wrong:** Each re-render calls `push({})` again (or risks double-calling it), which causes AdSense console errors and potentially shows duplicate ads.

**Do this instead:** Place `<AdUnit>` in `MainLayout.tsx`, which is outside the Zustand re-render boundary for both feature sections. `MainLayout` only re-renders on route changes.

---

## Scaling Considerations

This is a static SPA with no backend. Scaling concerns are limited to bundle size and client-side performance.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–10k users | Current architecture is fine. No changes needed. Vercel free tier handles 100GB bandwidth/month. |
| 10k–100k users | Monitor Core Web Vitals. If bundle grows (new features), add `React.lazy()` + `Suspense` to split crosshair and config sections into separate chunks loaded on demand. |
| 100k+ users | Consider static generation of popular content pages (pro player crosshair presets) with Next.js migration for SEO. Keep the designer itself as a client-side React tool. |

### Scaling Priorities

1. **First bottleneck:** Bundle size. SVG + Zustand + Tailwind + file-saver is a lean stack. Risk only appears if large libraries are added (image editing, animation libraries). Monitor with `vite-bundle-visualizer`.
2. **Second bottleneck:** AdSense load time. The async script is non-blocking, but too many ad slots slow perceived load. Cap at 2-3 slots per page.

---

## Sources

- [Bulletproof React project structure — github.com/alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) — Feature-based folder structure rationale (HIGH confidence)
- [Zustand store organization — github.com/pmndrs/zustand/discussions/2486](https://github.com/pmndrs/zustand/discussions/2486) — Maintainer guidance: independent data → separate stores (HIGH confidence)
- [Zustand multiple stores discussion — github.com/pmndrs/zustand/discussions/2496](https://github.com/pmndrs/zustand/discussions/2496) — Community corroboration (MEDIUM confidence)
- [React folder structure 2025 — robinwieruch.de](https://www.robinwieruch.de/react-folder-structure/) — Feature-based organization patterns (MEDIUM confidence)
- [CS2 crosshair parameters — totalcsgo.com/crosshairs/generator](https://totalcsgo.com/crosshairs/generator) — CS2 crosshair param names verified (MEDIUM confidence)
- [CS2 autoexec structure — tradeit.gg/blog/cs2-autoexec-guide](https://tradeit.gg/blog/cs2-autoexec-guide/) — cfg command syntax and categories (MEDIUM confidence)
- [CS2 crosshair share codes — totalcsgo.com/crosshairs](https://totalcsgo.com/crosshairs) — Import code format CSGO-XXXXX (MEDIUM confidence)
- STACK.md (this project) — SVG approach, Zustand, file-saver decisions (HIGH confidence, already verified)

---
*Architecture research for: CS2 Setup Builder (React SPA — crosshair designer + autoexec config builder)*
*Researched: 2026-03-31*
