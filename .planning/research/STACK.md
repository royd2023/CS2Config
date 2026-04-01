# Stack Research

**Domain:** React SPA — CS2 crosshair + config builder web tool
**Researched:** 2026-03-31
**Confidence:** HIGH (core stack verified against official docs and multiple sources)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.1 | UI framework | Current stable (Dec 2025). React 19 is production-ready, 90%+ compatible with React 18 patterns. Concurrent rendering improvements, built-in metadata management. PROJECT.md already specifies React. |
| TypeScript | 5.x (bundled via Vite) | Type safety | Catches parameter name bugs early (crosshair config has ~15 numeric params that are easy to mis-wire). Vite's react-ts template includes it at zero setup cost. |
| Vite | 8.0.3 | Build tool + dev server | CRA is officially deprecated as of Feb 2025 (react.dev/blog). Vite is the explicit React-team recommendation. Dev server starts in <2s vs CRA's 20-30s. First-party Tailwind v4 plugin means zero PostCSS config. |
| Tailwind CSS | 4.x | Styling | Released Jan 2025. CSS-first config (@theme in CSS, not tailwind.config.js). 182x faster incremental rebuilds. First-party Vite plugin = zero config. Dominant choice for React SPAs in 2025/2026. Correct choice for a polished, non-AI-looking UI — utility classes map to design tokens precisely. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zustand | 5.0.x | State management | Single source of truth for crosshair settings + config builder state. Lightweight (no boilerplate), selective re-renders (only components subscribed to changed slices re-render). Context API would cause full-tree re-renders on every crosshair slider drag. |
| react-router-dom | 7.x | Client-side routing | Needed if adding separate pages (e.g. /crosshair, /config, /about for AdSense surface area). v7 is stable and familiar. For a single-page tool with no navigation, this can be deferred — but include it from day 1 to support AdSense's preference for multi-page content. |
| file-saver | 2.0.5 | Download autoexec.cfg | Industry-standard for client-side file downloads. Wraps Blob + URL.createObjectURL with cross-browser handling. For .cfg text files (<1KB), this is zero-risk. No backend needed. |

### Crosshair Preview: SVG (Recommended over Canvas or CSS divs)

**Verdict: Use SVG rendered inline in React, no library needed.**

Confidence: MEDIUM (based on use-case analysis + community patterns; no single authoritative benchmark for this exact use case)

**Why SVG over Canvas:**
- CS2 crosshairs are composed of 4-6 geometric shapes (rectangles and a dot). SVG handles this with 6 DOM nodes — far below the threshold (100s of nodes) where Canvas outperforms SVG.
- SVG is declarative and maps 1:1 to React's component model. Crosshair parameters (size, thickness, gap, color, alpha) become SVG attribute props. No imperative draw calls.
- No `useRef` / `useEffect` redraw loop required. React re-renders the SVG elements automatically on state change.
- Canvas requires clearing and redrawing the entire frame on every slider drag. For 6 shapes, this complexity buys nothing.
- SVG scales perfectly to any preview size via `viewBox` — important for responsive layout.

**Why NOT Canvas (react-konva, Fabric.js, or raw HTMLCanvasElement):**
- Canvas is the right choice when rendering hundreds or thousands of objects, or doing per-pixel manipulation. CS2 crosshairs have neither.
- react-konva and Fabric.js add 50-200KB to the bundle for zero benefit at this object count.
- Canvas `useEffect` imperative draw loops are harder to maintain and are a common source of stale-closure bugs.

**Why NOT CSS divs:**
- CSS div crosshairs (absolute-positioned pseudo-elements) cannot easily replicate CS2's gap parameter or alpha channel in a way that maps cleanly to the actual in-game rendering model.
- SVG `opacity` and `stroke` attributes map directly to the game's crosshair parameters.

**Implementation pattern:**

```tsx
// Pure SVG crosshair preview — no library needed
function CrosshairPreview({ size, thickness, gap, color, alpha, dot }: CrosshairSettings) {
  const center = 64; // viewBox is 0 0 128 128
  const halfLen = size;
  const offset = gap + thickness / 2;

  return (
    <svg viewBox="0 0 128 128" width="128" height="128">
      {/* Top line */}
      <rect
        x={center - thickness / 2}
        y={center - offset - halfLen}
        width={thickness}
        height={halfLen}
        fill={color}
        opacity={alpha / 255}
      />
      {/* Bottom, Left, Right lines follow same pattern */}
      {dot && <circle cx={center} cy={center} r={thickness / 2} fill={color} opacity={alpha / 255} />}
    </svg>
  );
}
```

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9.x | Linting | Included in Vite's react-ts template. Flat config format (eslint.config.js) is the new standard in ESLint 9. |
| Prettier | Code formatting | Add separately. Pair with `eslint-config-prettier` to disable ESLint formatting rules. |
| Vitest | Unit testing | Native Vite integration, Jest-compatible API. Use for testing config generation logic (e.g., that autoexec.cfg output matches expected CS2 syntax). Absolutely do not skip testing the config string generation — wrong output is a user trust issue. |

---

## Google AdSense Integration Approach

**Confidence: MEDIUM** (pattern verified across multiple sources; no Vite-specific official guide exists, but the underlying mechanism is the same)

AdSense in a Vite React SPA requires three things:

1. **Script tag in `index.html`** (Vite's entry point):
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX" crossorigin="anonymous"></script>
   ```

2. **Ad unit component** that calls `push({})` in `useEffect` after mount:
   ```tsx
   // components/AdUnit.tsx
   import { useEffect, useRef } from 'react';
   declare global { interface Window { adsbygoogle: unknown[] } }

   export function AdUnit({ slot }: { slot: string }) {
     const adRef = useRef<HTMLModElement>(null);
     useEffect(() => {
       try {
         (window.adsbygoogle = window.adsbygoogle || []).push({});
       } catch (e) { /* suppress in dev */ }
     }, []);
     return (
       <ins className="adsbygoogle" style={{ display: 'block' }}
         data-ad-client="ca-pub-XXXXXXXX" data-ad-slot={slot}
         data-ad-format="auto" data-full-width-responsive="true" ref={adRef} />
     );
   }
   ```

3. **`ads.txt` in `/public/`** — Vercel serves `/public` at root, so `/public/ads.txt` becomes `yourdomain.com/ads.txt`. Required for AdSense approval.

**Key caveat:** AdSense only renders ads in production (not `localhost`). Test ad placements only after deploying. Do not wrap AdUnit in React.StrictMode's double-invoke — the double `push({})` call causes console errors. Wrap the push call in a try/catch.

---

## Installation

```bash
# Scaffold project
npm create vite@latest cs2-config-builder -- --template react-ts

cd cs2-config-builder

# Core dependencies
npm install zustand react-router-dom file-saver

# TypeScript types
npm install -D @types/file-saver

# Styling
npm install -D @tailwindcss/vite tailwindcss

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Tailwind v4 Vite config** (`vite.config.ts`):
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Tailwind v4 CSS entry** (`src/index.css`):
```css
@import "tailwindcss";
```
No `tailwind.config.js` needed.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite 8 | Create React App | Never for new projects — officially deprecated Feb 2025 |
| Vite 8 | Next.js 15 | If you need SSR/SSG for SEO-critical content, or server actions. This project is a pure client-side tool; SSR adds complexity with zero SEO benefit (config content is user-generated, not indexable). |
| Tailwind v4 | CSS Modules | If you dislike utility classes or need strict CSS isolation for a component library. Not warranted here. |
| Tailwind v4 | Styled Components | If building a themeable design system for distribution. Runtime CSS-in-JS has zero-runtime cost disadvantage in 2025, especially with React Server Components (not applicable here but sets bad precedent). |
| SVG (inline React) | react-konva | Only if crosshair preview grows to 100+ objects or requires complex hit-testing. Current scope: 6 shapes. |
| SVG (inline React) | Fabric.js | Fabric is an editing/manipulation library — overkill for a display-only preview. |
| Zustand | Context API | Only for auth state or theme (low-frequency). Crosshair sliders fire on every mouse move — Context re-renders the entire tree on every change. |
| Zustand | Redux Toolkit | For a team of 5+ on a large application. This is a solo project with clear, simple state shape. Redux's boilerplate is not justified. |
| react-router-dom v7 | TanStack Router | TanStack Router has better type safety for complex search-param-heavy apps. This app's routing needs are minimal (2-3 routes). React Router v7 is familiar and sufficient. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Create React App (CRA) | Officially deprecated February 2025 by the React team. Not maintained. No Vite/ESM architecture. 20-30s dev server start. | Vite 8 |
| react-konva / Fabric.js | Bundle overhead (50-200KB) for a use case (6 geometric shapes) that needs zero canvas library | Inline SVG React components |
| CSS-in-JS (Emotion, Styled Components) | Runtime cost, incompatible with React Server Components direction, unnecessary for a single-developer project | Tailwind CSS v4 |
| Redux (non-RTK) | Legacy boilerplate. If you think you need Redux, use Zustand instead — same capability, 90% less code | Zustand 5 |
| next-google-adsense package | Third-party wrapper is unnecessary for a Vite project; adds a dependency that may lag behind AdSense API changes | Direct script tag + AdUnit component pattern (see above) |
| StreamSaver.js | Designed for files >blob size limit (GBs). autoexec.cfg is <2KB text — extreme overkill | file-saver 2.0.5 |

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| React 19.2 | react-router-dom 7.x | Fully compatible. RRD 7 targets React 18+. |
| React 19.2 | Zustand 5.x | Fully compatible. Zustand 5 dropped React <18 support; uses `useSyncExternalStore`. |
| Vite 8.x | @tailwindcss/vite | First-party plugin, designed for Vite 6+. Compatible with Vite 8. |
| Tailwind v4 | Node.js 18+ | Requires Node 18 or higher. Vite 8 also requires Node 18+. No conflict. |
| TypeScript 5.x | All above | All libraries ship their own types or have @types packages. No DefinitelyTyped issues known. |

---

## Stack Patterns by Variant

**If routing is not needed (pure single-page):**
- Skip react-router-dom initially
- Use Zustand for all state
- Add routing only when AdSense strategy requires multiple indexable pages

**If crosshair preview needs to be exported as an image:**
- Use `canvas.toDataURL()` from a hidden HTMLCanvasElement rather than converting SVG — more reliable cross-browser
- Or use the `html2canvas` library to rasterize the SVG preview div

**If the project later adds user accounts (v2 per PROJECT.md):**
- Add a backend: Supabase (free tier, Postgres + Auth) pairs naturally with Vercel
- Keep state management as Zustand; add server state layer with TanStack Query (React Query)

---

## Sources

- [React versions — react.dev](https://react.dev/versions) — Confirmed v19.2.1 as latest stable (HIGH confidence)
- [React v19 release post — react.dev/blog](https://react.dev/blog/2024/12/05/react-19) — Feature verification (HIGH confidence)
- [Sunsetting Create React App — react.dev/blog](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) — CRA deprecation confirmed official (HIGH confidence)
- [Vite releases — github.com/vitejs/vite/releases](https://github.com/vitejs/vite/releases) — Confirmed v8.0.3 current stable March 2026 (HIGH confidence)
- [Tailwind CSS v4.0 — tailwindcss.com/blog](https://tailwindcss.com/blog/tailwindcss-v4) — v4 feature list, Vite plugin confirmed (HIGH confidence)
- [Zustand v5 announcement — pmnd.rs](https://pmnd.rs/blog/announcing-zustand-v5) — v5 stable, React 18+ only (HIGH confidence)
- [Vite vs CRA 2026 — mol-tech.us](https://www.mol-tech.us/blog/vite-vs-create-react-app-2026) — Community corroboration (MEDIUM confidence)
- [SVG vs Canvas — svggenie.com](https://www.svggenie.com/blog/svg-vs-canvas-vs-webgl-performance-2025) — Performance characteristics (MEDIUM confidence)
- [AdSense in SPA — jasonwatmore.com](https://jasonwatmore.com/add-google-adsense-to-a-single-page-app-react-angular-vue-next-etc) — SPA pattern (MEDIUM confidence)
- [State management 2025 — dev.to](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k) — Zustand recommendation corroboration (MEDIUM confidence)
- [file-saver — npmjs.com](https://www.npmjs.com/package/file-saver) — Package status check (HIGH confidence)

---
*Stack research for: CS2 Setup Builder (crosshair designer + autoexec config builder)*
*Researched: 2026-03-31*
