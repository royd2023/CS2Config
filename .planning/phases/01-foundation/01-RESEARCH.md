# Phase 1: Foundation - Research

**Researched:** 2026-04-02
**Domain:** Vite 8 + React 19 + TypeScript scaffold, Zustand 5 stores, Vitest 4, Tailwind v4, crosshair code generation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### UI Primitive Scope
- Functional only — correct behavior, no custom styling
- Styling deferred to Phase 4 when the full design system is defined
- No isolation tests (Storybook or render tests) — primitives are implicitly tested via Phase 2 and 3 consumers
- ColorPicker: native HTML color input (no custom RGB+alpha control yet)
- CopyButton: accepts a `value` prop and handles clipboard writing internally; shows a brief success state after copy

#### Data Model Design
- Crosshair parameters use grouped/nested TypeScript types (e.g., `crosshair.color.r`, `crosshair.line.gap`, `crosshair.line.thickness`)
- Two separate Zustand stores: `crosshairStore` and `configStore` (not one combined store)
- Stores initialize with sensible CS2 default values — Phase 2 renders immediately without empty-state handling
- No localStorage persistence in Phase 1 — deferred to Phase 4 alongside the share-URL feature

#### Test Coverage
- Crosshair code generator: tests verify valid CS2 import code format (`CSGO-XXXXX-...`) and absence of deprecated fields
- autoexec.cfg generator: critical test is confirming deprecated commands never appear in output (e.g., `cl_updaterate`, `cl_interp`, `cl_cmdrate`, `-tickrate 128`)
- Deprecated command list lives in a shared constants file used by both the generator and the tests — single source of truth

#### TypeScript Config
- `strict: true` — standard strict mode (noImplicitAny, strictNullChecks, etc.)
- `noEmitOnError: true` — build fails on TypeScript errors (aligns with phase success criterion)
- Path alias configured from Phase 1: `@/` pointing to `src/` for cleaner cross-phase imports

### Claude's Discretion
- Exact folder/file structure within src/ (e.g., src/stores/, src/lib/, src/components/ui/)
- Vitest configuration details
- Exact default crosshair and config values (use sensible CS2 community defaults)
- Any additional tsconfig flags beyond strict + noEmitOnError

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

## Summary

Phase 1 is a greenfield scaffold — no source code exists yet. The task is to initialize a Vite 8 + React 19 + TypeScript project, configure the full toolchain (Tailwind v4, Vitest 4, path aliases), define typed data models for crosshair and config state, implement two Zustand 5 stores with CS2 defaults, write pure generator functions for crosshair code and cfg output, and wire up shared UI primitives. The `akiver/csgo-sharecode` v4.0.0 library handles crosshair code encoding — this must NOT be hand-rolled.

The critical discipline of this phase is building the CS2 command allowlist/denylist BEFORE implementing `cfgGenerator`. Deprecated commands (`cl_updaterate`, `cl_cmdrate`, `cl_interp`, `cl_interp_ratio`, `-tickrate 128`) were removed by Valve when CS2 shipped on Source 2. They are server-controlled and non-functional if emitted — they must never appear in generated output. A shared constants file ensures the generator and tests share a single source of truth.

Vite 8 (Rolldown-powered, stable since March 2026) is the current scaffolding tool. React 19.2 is the current stable React. Tailwind v4.2 uses a Vite plugin and `@import "tailwindcss"` — no PostCSS or tailwind.config.js required. Vitest 4 is current and integrates directly with Vite config.

**Primary recommendation:** Scaffold with `npm create vite@latest -- --template react-ts`, then layer in Tailwind v4, Vitest 4, `vite-tsconfig-paths`, and `csgo-sharecode@4.0.0` in one setup pass before writing any application code.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | 8.x (8.0.2+) | Build tool, dev server | Fastest builds (Rolldown/Rust), official React template, HMR |
| React | 19.2 | UI framework | Project decision, latest stable with improved hooks |
| TypeScript | 5.x (via Vite template) | Type safety | Project decision, strict mode required |
| Zustand | 5.0.12 | Client state management | Project decision, minimal API, devtools-friendly |
| Tailwind CSS | 4.2 | Utility CSS | Project decision, Vite plugin — zero PostCSS config |
| Vitest | 4.x (4.1.2+) | Unit testing | Native Vite integration, same config, no separate pipeline |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@vitejs/plugin-react` | latest | React JSX transform in Vite | Required for React + Vite |
| `@tailwindcss/vite` | latest | Tailwind v4 Vite plugin | Replaces PostCSS pipeline |
| `vite-tsconfig-paths` | latest | Reads tsconfig paths for Vite | Enables `@/` alias without manual resolve.alias |
| `csgo-sharecode` | 4.0.0 | Encode/decode CS2 crosshair share codes | Do NOT hand-roll — handles BigInt encoding |
| `@testing-library/react` | 16.1.0+ | React component testing | Required for Phase 1 primitive smoke tests; React 19 needs v16.1.0+ |
| `@testing-library/jest-dom` | latest | DOM assertions in Vitest | Provides `toBeInTheDocument()`, etc. |
| `jsdom` | latest | Browser-like DOM in Vitest | Required environment for component tests |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand | Jotai, Recoil, Redux Toolkit | Zustand is locked decision; simpler API, less boilerplate than RTK |
| Vitest | Jest | Vitest reuses Vite config — no Babel/ts-jest setup; Jest requires separate pipeline |
| `vite-tsconfig-paths` | Manual `resolve.alias` in vite.config.ts | Plugin approach reads tsconfig.json directly, stays in sync automatically |
| `@tailwindcss/vite` plugin | PostCSS pipeline | Plugin is faster, zero config, recommended for Vite projects in v4 |

**Installation:**
```bash
# After scaffolding with npm create vite@latest -- --template react-ts
npm install zustand csgo-sharecode
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/dom jsdom @tailwindcss/vite tailwindcss vite-tsconfig-paths
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   └── ui/              # Shared primitives: Slider, Select, ColorPicker, CopyButton
├── lib/
│   ├── crosshairCodeGen.ts    # Pure function: Crosshair → CS2 share code
│   ├── cfgGenerator.ts        # Pure function: ConfigState → autoexec.cfg string
│   └── constants/
│       └── deprecatedCmds.ts  # Single source of truth for banned commands
├── stores/
│   ├── crosshairStore.ts      # Zustand store for crosshair state
│   └── configStore.ts         # Zustand store for config state
├── types/
│   ├── crosshair.ts           # CrosshairState, CrosshairColor, CrosshairLine, etc.
│   └── config.ts              # ConfigState, KeyBinds, AudioSettings, etc.
└── tests/
    ├── crosshairCodeGen.test.ts
    └── cfgGenerator.test.ts
```

### Pattern 1: Nested TypeScript Types for Crosshair State

**What:** Group related crosshair parameters into nested interfaces matching the user's mental model and the CONTEXT.md decision (`crosshair.color.r`, `crosshair.line.gap`).

**When to use:** Crosshair state definition — this is the locked data model shape.

**Example:**
```typescript
// Source: CONTEXT.md locked decision + akiver/csgo-sharecode Crosshair interface
export interface CrosshairColor {
  r: number;  // 0-255
  g: number;
  b: number;
  a: number;  // 0-255
}

export interface CrosshairLine {
  length: number;
  thickness: number;
  gap: number;
}

export interface CrosshairDot {
  enabled: boolean;
}

export interface CrosshairOutline {
  enabled: boolean;
  thickness: number;
}

export interface CrosshairState {
  style: 0 | 1 | 2 | 3 | 4 | 5;  // CS2 cl_crosshairstyle values
  color: CrosshairColor;
  line: CrosshairLine;
  dot: CrosshairDot;
  outline: CrosshairOutline;
  tStyle: boolean;
  followRecoil: boolean;
}
```

### Pattern 2: Zustand Store with TypeScript

**What:** Use the curried `create<T>()()` form — required for TypeScript and future-proof with middleware.

**When to use:** Both crosshairStore and configStore.

**Example:**
```typescript
// Source: https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript
import { create } from 'zustand';
import { CrosshairState } from '@/types/crosshair';

interface CrosshairStore extends CrosshairState {
  set: (partial: Partial<CrosshairState>) => void;
  reset: () => void;
}

const DEFAULT_CROSSHAIR: CrosshairState = {
  style: 4,           // Classic static — most common CS2 default
  color: { r: 0, g: 255, b: 0, a: 200 },
  line: { length: 4, thickness: 1, gap: -3 },
  dot: { enabled: false },
  outline: { enabled: false, thickness: 1 },
  tStyle: false,
  followRecoil: false,
};

export const useCrosshairStore = create<CrosshairStore>()((set) => ({
  ...DEFAULT_CROSSHAIR,
  set: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () => set(DEFAULT_CROSSHAIR),
}));

// Selector usage (prevents re-renders on unrelated state changes):
const color = useCrosshairStore((s) => s.color);
```

### Pattern 3: Pure Generator Functions

**What:** Generator functions take state as input, return strings as output, import nothing from React. Easy to unit test.

**When to use:** `crosshairCodeGen.ts` and `cfgGenerator.ts` — both are pure.

**Example:**
```typescript
// Source: Project decision (CONTEXT.md) + akiver/csgo-sharecode API
import { encodeCrosshair } from 'csgo-sharecode';
import type { CrosshairState } from '@/types/crosshair';

export function crosshairCodeGen(state: CrosshairState): string {
  // Map CrosshairState → Crosshair shape expected by csgo-sharecode
  const crosshair = {
    gap: state.line.gap,
    outline: state.outline.thickness,
    red: state.color.r,
    green: state.color.g,
    blue: state.color.b,
    alpha: state.color.a,
    // ...remaining field mapping
  };
  return encodeCrosshair(crosshair);
}
```

### Pattern 4: Deprecated Command Constants File

**What:** A single `deprecatedCmds.ts` constants file imported by both the generator (to skip) and tests (to verify absence).

**When to use:** Before writing cfgGenerator — this is the allowlist discipline.

**Example:**
```typescript
// src/lib/constants/deprecatedCmds.ts
// Source: Valve CS2 documentation, confirmed removed in CS2/Source 2
export const DEPRECATED_CS2_COMMANDS = [
  'cl_updaterate',   // Server-controlled in CS2, non-functional
  'cl_cmdrate',      // Server-controlled in CS2, non-functional
  'cl_interp',       // Removed by Valve, server handles interpolation
  'cl_interp_ratio', // Removed alongside cl_interp
  '-tickrate',       // Launch option only, CS2 uses subtick — not a cfg command
  'rate',            // CS2 auto-detects optimal rate
] as const;

export type DeprecatedCommand = typeof DEPRECATED_CS2_COMMANDS[number];
```

### Pattern 5: Tailwind v4 Setup in Vite

**What:** Single plugin import, no tailwind.config.js, no PostCSS config.

**When to use:** Initial scaffold configuration.

**Example:**
```typescript
// vite.config.ts — Source: https://tailwindcss.com/docs/installation/using-vite
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
});
```

```css
/* src/index.css */
@import "tailwindcss";
```

### Pattern 6: TypeScript Path Alias via tsconfig

**What:** `vite-tsconfig-paths` plugin reads `paths` from tsconfig.json so Vite and TypeScript both resolve `@/` → `src/`.

**When to use:** Once at scaffold time, before writing any application imports.

**Example:**
```json
// tsconfig.json (add to compilerOptions)
{
  "compilerOptions": {
    "strict": true,
    "noEmitOnError": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals"]
  }
}
```

### Anti-Patterns to Avoid

- **Combining crosshairStore and configStore into one store:** CONTEXT.md locked two separate stores. Combining them causes unrelated re-renders and makes Phase 2/3 consumer code messier.
- **Importing React in generator functions:** `crosshairCodeGen.ts` and `cfgGenerator.ts` must be pure TypeScript with no React dependency — keeps them framework-agnostic and trivially unit-testable.
- **Hand-rolling crosshair share code encoding:** The CSGO-XXXXX format uses BigInt math and a specific byte-packing protocol. Use `csgo-sharecode` v4.0.0.
- **Using `create(...)` without type parameter in Zustand 5:** Always `create<T>()()` — TypeScript won't catch shape errors otherwise.
- **Configuring PostCSS for Tailwind v4:** The `@tailwindcss/vite` plugin makes PostCSS unnecessary. Adding it creates conflicts.
- **Not setting `environment: 'jsdom'` in Vitest config:** Default Vitest environment is Node.js. DOM APIs (`navigator.clipboard`, `document`) are unavailable without jsdom.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CS2 crosshair share code encoding | Custom BigInt byte-packer | `csgo-sharecode` v4.0.0 `encodeCrosshair()` | Share code format uses specific BigInt packing, base64 encoding, and checksum — trivially wrong to DIY |
| State management | useContext + useReducer | Zustand 5 (locked decision) | Zustand provides devtools, subscriptions, shallow equality out of the box |
| TypeScript path resolution | Manual `resolve.alias` in vite.config + duplicate tsconfig paths | `vite-tsconfig-paths` plugin | Plugin reads tsconfig.json directly — single source of truth, Vitest also picks it up |
| CSS design tokens / dark mode | Manual CSS custom properties | Tailwind v4 (locked decision) | v4 CSS-first variables, dark mode, responsive — not worth replicating |
| Test DOM environment | Custom global setup | jsdom (Vitest built-in environment) | Just set `environment: 'jsdom'` |

**Key insight:** The crosshair encoding library is the only non-trivial external dependency for this phase. Everything else is standard scaffolding.

---

## Common Pitfalls

### Pitfall 1: csgo-sharecode is ESM-only in v4

**What goes wrong:** `require('csgo-sharecode')` throws; TypeScript `"module": "CommonJS"` projects fail to import.

**Why it happens:** v4.0.0 dropped CJS support. Vite templates default to ESM, so this is compatible — but if tsconfig `module` is set to `CommonJS` the build fails.

**How to avoid:** Ensure `tsconfig.json` has `"module": "ESNext"` or `"module": "Bundler"` (Vite template default). Do not set `"module": "CommonJS"`.

**Warning signs:** `ERR_REQUIRE_ESM` at runtime or TypeScript error about module resolution.

### Pitfall 2: @testing-library/react v16 requires @testing-library/dom peer

**What goes wrong:** Tests fail with missing module errors at import time.

**Why it happens:** RTL v16+ split `@testing-library/dom` into a separate package and added it as a peer dependency.

**How to avoid:** Install both: `npm install -D @testing-library/react @testing-library/dom`.

**Warning signs:** `Cannot find module '@testing-library/dom'` in test output.

### Pitfall 3: Vitest globals not recognized by TypeScript

**What goes wrong:** `describe`, `it`, `expect` show TypeScript errors in test files even though tests run.

**Why it happens:** `globals: true` in Vitest config enables globals at runtime but TypeScript still needs type declarations.

**How to avoid:** Add `"vitest/globals"` to `types` array in tsconfig.json compilerOptions.

**Warning signs:** Red squiggles on `describe`/`it`/`expect` in IDEs; CI TypeScript check fails.

### Pitfall 4: Deprecated CS2 commands silently ignored in-game

**What goes wrong:** `cfgGenerator` outputs `cl_updaterate 128` or `cl_interp 0` — no error in-game but the config appears broken to savvy users.

**Why it happens:** CS2 ignores these commands silently (they're no longer registered). Developers unfamiliar with CS2 copy CS:GO command lists.

**How to avoid:** Build the `DEPRECATED_CS2_COMMANDS` constants file FIRST. Write a test that loops over the constant and asserts `cfgGenerator` output does not contain any of them.

**Warning signs:** Test coverage of deprecated command list exists but constants file is not imported by `cfgGenerator`.

### Pitfall 5: Tailwind v4 + PostCSS conflict

**What goes wrong:** Styles don't apply, or duplicate processing causes build errors.

**Why it happens:** Adding `tailwindcss` and `autoprefixer` to PostCSS config alongside the `@tailwindcss/vite` plugin double-processes CSS.

**How to avoid:** Remove any `postcss.config.js`/`postcss.config.cjs`. Only add `@tailwindcss/vite` to `vite.config.ts` plugins.

**Warning signs:** CSS class names not generating, or `@import "tailwindcss"` not found warning.

### Pitfall 6: Zustand store `set` partial update drops nested state

**What goes wrong:** Calling `set({ color: { r: 255 } })` wipes out `color.g`, `color.b`, `color.a`.

**Why it happens:** Zustand's `set` merges at the top level only — not deeply. `color` is replaced, not merged.

**How to avoid:** Either spread explicitly in the setter: `set((s) => ({ color: { ...s.color, r: 255 } }))`, or expose fine-grained setters per field in the store interface.

**Warning signs:** Crosshair color appears to reset partial fields after individual slider changes.

---

## Code Examples

Verified patterns from official sources:

### Vitest Config (in vite.config.ts)
```typescript
// Source: https://vitest.dev/guide/ (v4.1.2)
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
});
```

### Vitest Setup File
```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom';
```

### crosshairCodeGen Unit Test Shape
```typescript
// src/tests/crosshairCodeGen.test.ts
import { crosshairCodeGen } from '@/lib/crosshairCodeGen';
import { DEFAULT_CROSSHAIR } from '@/stores/crosshairStore';

describe('crosshairCodeGen', () => {
  it('produces a valid CS2 share code format', () => {
    const code = crosshairCodeGen(DEFAULT_CROSSHAIR);
    expect(code).toMatch(/^CSGO-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$/);
  });
});
```

### cfgGenerator Deprecated Command Test
```typescript
// src/tests/cfgGenerator.test.ts
import { cfgGenerator } from '@/lib/cfgGenerator';
import { DEPRECATED_CS2_COMMANDS } from '@/lib/constants/deprecatedCmds';
import { DEFAULT_CONFIG } from '@/stores/configStore';

describe('cfgGenerator', () => {
  it('never outputs deprecated CS2 commands', () => {
    const cfg = cfgGenerator(DEFAULT_CONFIG);
    for (const cmd of DEPRECATED_CS2_COMMANDS) {
      expect(cfg).not.toContain(cmd);
    }
  });
});
```

### CopyButton Primitive
```typescript
// src/components/ui/CopyButton.tsx
// Locked behavior: accepts value prop, handles clipboard, shows success state
import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} type="button">
      {copied ? 'Copied!' : label}
    </button>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `npm create react-app` | `npm create vite@latest -- --template react-ts` | 2022-2023 | CRA is unmaintained; Vite is the community default |
| Vite with esbuild + Rollup (dual bundler) | Vite 8 with Rolldown (single Rust bundler) | March 2026 | 10-30x faster production builds, same plugin API |
| Tailwind v3 with PostCSS + `tailwind.config.js` | Tailwind v4 with `@tailwindcss/vite` plugin + CSS `@import` | Early 2025 | Zero config files, first-party Vite integration |
| `@tailwind base/components/utilities` directives | `@import "tailwindcss"` single import | Tailwind v4 | Simpler CSS entrypoint |
| Zustand `create(...)` (v4 TS pattern) | Zustand `create<T>()()` curried (v5 required) | Zustand v5 | Required for proper TypeScript inference |
| Jest with Babel/ts-jest for Vite projects | Vitest (native Vite integration) | 2022 onwards | No separate transpile pipeline needed |
| `cl_updaterate`, `cl_cmdrate`, `cl_interp` in autoexec | These commands are non-functional/removed in CS2 | CS2 launch (2023) | Must NEVER appear in generated output |

**Deprecated/outdated:**
- `cl_updaterate`: Removed in CS2 — server-controlled, client commands ignored
- `cl_cmdrate`: Removed in CS2 — server-controlled
- `cl_interp` / `cl_interp_ratio`: Removed by Valve; CS2 handles interpolation server-side
- `-tickrate 128`: CS2 uses subtick, not fixed tickrate — irrelevant as a launch option

---

## Open Questions

1. **csgo-sharecode field mapping to CrosshairState**
   - What we know: `csgo-sharecode` v4.0.0 exports a `Crosshair` type with 20 properties (gap, outline, red, green, blue, alpha, splitDistance, fixedCrosshairGap, color, innerSplitAlpha, outerSplitAlpha, splitSizeRatio, thickness, centerDotSize, deployedWeaponGapEnabled, alphaEnabled, tStyle, style, length, followRecoil)
   - What's unclear: The exact mapping from the library's flat `Crosshair` interface to this project's nested `CrosshairState` (specifically: which library fields map to `crosshair.line.*` vs other groups)
   - Recommendation: Inspect the library's TypeScript types directly after install (`node_modules/csgo-sharecode/dist/index.d.ts`) during Wave 1 to build the canonical mapping table before writing `crosshairCodeGen.ts`

2. **Clipboard API in Vitest/jsdom**
   - What we know: `navigator.clipboard.writeText()` is used in CopyButton; jsdom doesn't implement the Clipboard API by default
   - What's unclear: Whether a mock is needed in tests or if the component is simply not unit-tested (CONTEXT.md says no isolation tests)
   - Recommendation: Since CONTEXT.md explicitly defers primitive testing to Phase 2/3 consumers, skip CopyButton unit tests in this phase. If any test exercises it, mock `navigator.clipboard` in the Vitest setup file.

3. **CS2 cfg valid command set completeness**
   - What we know: The deprecated list (`cl_updaterate`, `cl_cmdrate`, `cl_interp`, `cl_interp_ratio`, `-tickrate 128`) is confirmed removed
   - What's unclear: Whether `rate` is also deprecated — some sources list it, others still include it in 2025 guides
   - Recommendation: Treat `rate` as deprecated and exclude it from generated cfg. If evidence emerges it's functional, it can be added in Phase 3 with a specific test.

---

## Sources

### Primary (HIGH confidence)
- `https://vite.dev/blog/announcing-vite8` — Vite 8 stable release, version confirmation (v8.0.2, March 2026)
- `https://tailwindcss.com/docs/installation/using-vite` — Official Tailwind v4 Vite setup (v4.2, plugin + CSS import)
- `https://zustand.docs.pmnd.rs/learn/guides/beginner-typescript` — Official Zustand TypeScript guide, `create<T>()()` pattern, selectors
- `https://vitest.dev/guide/` — Vitest current version (v4.1.2), configuration patterns
- `https://github.com/akiver/csgo-sharecode` — Package API: `encodeCrosshair`, `decodeCrosshairShareCode`, `crosshairToConVars`, v4.0.0 ESM-only

### Secondary (MEDIUM confidence)
- `https://bo3.gg/news/valve-has-removed-the-clinterp-and-clinterpratio-commands-from-cs2-a-new-update-in-the-game` — Valve removed `cl_interp`/`cl_interp_ratio` from CS2 (verified by multiple Steam discussion threads)
- `https://steamcommunity.com/app/730/discussions/0/595138196466061529/` — `cl_cmdrate` confirmed non-functional in CS2 by community and Valve response
- `https://github.com/testing-library/react-testing-library` — RTL v16.1.0+ required for React 19; `@testing-library/dom` peer dependency required

### Tertiary (LOW confidence)
- WebSearch consensus on `rate` command deprecation — multiple 2025 autoexec guides still include it; status unclear. Treat as deprecated until Phase 3 research confirms either way.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Verified via official Vite, Tailwind, Vitest, Zustand docs with current version numbers
- Architecture: HIGH — Derived from locked CONTEXT.md decisions; folder structure is Claude's discretion backed by standard React conventions
- Pitfalls: HIGH — ESM issue, RTL peer dep, and deprecated command list verified with official sources; Zustand nested merge is a known documented behavior
- csgo-sharecode field mapping: MEDIUM — API shape confirmed, exact field-to-nested-type mapping requires post-install inspection

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (30 days — stack is stable; Tailwind/Vite ship frequently but no breaking changes expected in minor versions)
