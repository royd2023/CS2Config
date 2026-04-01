# Project Research Summary

**Project:** CS2 Setup Builder (crosshair designer + autoexec config builder)
**Domain:** React SPA — CS2 gaming tool
**Researched:** 2026-03-31
**Confidence:** HIGH

## Executive Summary

This is a client-side React SPA that fills a genuine gap in the CS2 tooling market: no single competitor combines a polished crosshair generator with a full autoexec config builder in one cohesive experience. The recommended approach is a lean, zero-backend React 19 + Vite 8 + Tailwind CSS v4 + Zustand 5 stack with inline SVG for crosshair preview and pure TypeScript generator functions for both the CS2 import code and the .cfg file output. The architecture is deliberately inside-out: data models and pure logic are built first, then state stores, then UI components — ensuring the most business-critical output (crosshair codes and config files) is tested in isolation before any React layer touches it.

The single greatest technical risk is the CS2 share code encoding. The `CSGO-XXXXX-...` format uses a custom Base57/BigInt byte-packing scheme that is not publicly documented. Any attempt to hand-roll this encoder will produce codes that silently decode to wrong crosshair settings. The `akiver/csgo-sharecode` MIT library (v4.0.0, ESM-only) is the de facto standard used by every serious CS2 tool and must be used directly. The second major risk is CS2-specific command deprecation: `cl_updaterate`, `cl_cmdrate`, `cl_interp`, `cl_interp_ratio`, `-novid`, and `-tickrate 128` were all removed or neutered in CS2. Including any of them in the generated output destroys user trust and is the easiest mistake to make when copying from CS:GO reference material, which dominates search results.

Monetization via Google AdSense is viable and well-supported by the Vite deployment model, but requires three specific steps (script in index.html, AdUnit component with try/catch-guarded push(), and ads.txt in /public) to avoid common StrictMode double-push errors and AdSense application rejection. The combined tool differentiator is real but only lands if the crosshair feature is genuinely polished — the config builder alone is not differentiated, but crosshair + config in one place is.

---

## Key Findings

### Recommended Stack

The stack is modern, minimal, and validated against official sources. Vite 8 (not Create React App, which was officially deprecated February 2025) is the React team's explicit recommendation. Tailwind CSS v4 with the first-party Vite plugin eliminates all PostCSS configuration. Zustand 5 is the correct choice over Context API specifically because crosshair sliders fire on every mouse move — Context would cause full-tree re-renders; Zustand's per-selector subscriptions isolate re-renders to only the subscribed components.

**Core technologies:**
- **React 19.2.1**: Current stable, concurrent rendering, production-ready — specified in project requirements
- **Vite 8.0.3**: Build tool and dev server, <2s start, first-party Tailwind plugin — CRA officially dead
- **TypeScript 5.x**: Catches crosshair parameter mis-wiring early; included free in Vite react-ts template
- **Tailwind CSS v4**: CSS-first config, 182x faster incremental builds, zero config with Vite plugin
- **Zustand 5.0.x**: Feature-scoped stores, selective re-renders — prevents slider-drag jank
- **Inline SVG (no library)**: 6 geometric shapes; Canvas/Konva/Fabric.js add 50-200KB for zero benefit
- **file-saver 2.0.5**: Client-side .cfg download; autoexec.cfg is <2KB text — no backend needed
- **akiver/csgo-sharecode v4.0.0**: MIT, ESM-only, the only reliable CS2 share code encoder/decoder
- **Vitest**: Native Vite integration; essential for testing config generator output correctness

**Version compatibility is clean:** React 19 + Zustand 5 + RRD 7 + Vite 8 + Tailwind v4 all require Node 18+ with no known conflicts.

### Expected Features

The market is fragmented — no competitor does crosshair + config well together. The combined tool is a validated gap. Feature research is based on direct inspection of totalcsgo.com, csdb.gg, cs2config.com, dathost.net, and mobbi.dev.

**Must have (table stakes):**
- Real-time crosshair preview — users will not accept editing blind; every competitor has this
- All 12 core crosshair parameters (style, size, gap, thickness, dot, T-style, outline, alpha, color presets + custom RGB)
- CS2 import code generation (`CSGO-XXXXX-...`) — the primary output users need
- Copy-to-clipboard for crosshair code — one-click copy with visual confirmation
- Config builder: sensitivity, network rates (`rate` only — not deprecated interp commands), audio, basic binds
- Autoexec.cfg download as a .cfg file via Blob
- Cfg folder path instructions with copy button
- Launch options section with `+exec autoexec.cfg` prominently featured

**Should have (competitive differentiation):**
- Crosshair import code parsing (paste `CSGO-...` to pre-populate controls) — same library, high trust value
- Shareable URL (crosshair settings encoded in query string) — zero backend, drives return visits
- Pro player crosshair presets (top 10-20 most searched: s1mple, ZywOo, NiKo, donk, ropz)
- Viewmodel settings section (fov, x/y/z offsets, hand preference)
- Multiple map background previews for crosshair visibility testing
- eDPI calculator alongside sensitivity input (pure math, no API)

**Defer (v2+):**
- Advanced crosshair parameters (dynamic split, sniper width, follow recoil) — small audience
- User accounts and saved configs — validate with localStorage first
- Config preset templates ("Max FPS", "Beginner") — useful but not differentiating at launch
- Full bind editor (200+ actions) — cover the 10-15 most common only

**Anti-features to explicitly avoid:** sensitivity converter (already done better elsewhere), automated cfg file placement (browser filesystem access is impossible), crosshair animation/recoil simulation (high complexity, low accuracy), video settings builder (not in autoexec).

### Architecture Approach

The architecture is a feature-based SPA (Bulletproof React pattern) with two independent domain sections — `features/crosshair/` and `features/config/` — each owning their components, Zustand store, pure logic library, and types. The two features never import from each other; they are composed at the app level. The most important structural decision is isolating the generator functions (`crosshairCodeGen.ts`, `cfgGenerator.ts`) as pure TypeScript with no React imports — these are tested with Vitest directly without mounting components, which is the only reliable way to catch output correctness bugs.

**Major components:**
1. **useCrosshairStore / useConfigStore** — Zustand stores, one per feature, with typed settings objects and a single `update(patch)` action
2. **CrosshairPreview** — Pure SVG presentation component, subscribes to crosshair store, no useEffect or imperative draw calls; re-renders automatically on every slider change
3. **crosshairCodeGen.ts / cfgGenerator.ts** — Pure functions (params → string), zero React dependency, fully unit-testable; the most critical correctness boundary in the codebase
4. **ConfigForm sections** — One component per category (SensitivitySection, NetworkSection, AudioSection, BindsSection, LaunchOptionsSection); thin composition in ConfigForm.tsx
5. **MainLayout** — App shell containing AdSense slots; must sit outside Zustand re-render boundaries so ad units are never re-rendered by slider events
6. **components/ui/** — Shared primitives (Slider, Select, ColorPicker, CopyButton, KeybindInput) with value/onChange props only; no store dependencies

Data flow is unidirectional: user interaction → store write → subscribed component re-render → pure generator call → UI display. The config download path is: store read → cfgGenerator() → Blob → file-saver saveAs().

### Critical Pitfalls

1. **Deprecated CS2 networking commands in output** — `cl_updaterate`, `cl_cmdrate`, `cl_interp`, and `cl_interp_ratio` were removed in CS2 (September 2023 and later). Every CS:GO autoexec template on the internet includes them. Do not include them. Build a canonical CS2 command allowlist before writing any output generation. Only `rate 786432` remains valid for networking.

2. **Wrong bind syntax** — CS2 switched to scancode-based input (February 2024 update). Letter/number key binds using the old `bind "w"` format silently fail on non-US keyboards. Build a scancode lookup table. Named keys (SPACE, MOUSE1, MWHEELDOWN) still work with the old format.

3. **Reimplementing the share code encoder** — The `CSGO-XXXXX-...` format is Base57 + BigInt byte-packing with no public spec. Any hand-rolled implementation will produce codes that decode to wrong settings. Use `akiver/csgo-sharecode` v4.0.0 (MIT, ESM-only) exclusively. The library's field names do not map 1:1 to console command names — build an explicit translation table.

4. **AdSense StrictMode double-push** — React StrictMode (default in Vite template) invokes useEffect twice in development. Wrap every `push({})` call in try/catch. Keep StrictMode on — it catches real bugs. Accept that ads will not render on localhost regardless.

5. **Missing vercel.json rewrites** — Without a `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}` in vercel.json, every non-root URL returns a 404 on direct access or refresh. Add this before the first Vercel deploy.

6. **Defunct launch options** — `-novid` (Valve removed the intro video), `-tickrate 128` (no effect online in CS2), and `-disable_d3d9ex` do not work in CS2. Including them as "recommended" options damages credibility with knowledgeable users.

---

## Implications for Roadmap

Based on the architecture research's explicit build order and the pitfall phase mappings, seven phases are suggested. The architecture's inside-out build sequence (pure logic → stores → components) is the correct ordering and must not be inverted to avoid building UI against unverified data shapes.

### Phase 1: Project Scaffold and Data Foundation
**Rationale:** The type definitions for CrosshairSettings and ConfigSettings are the root dependency for everything else. If these shapes are wrong, the error propagates to all stores and components. Build and test the pure generator functions before any UI exists — this is the only reliable way to catch output correctness bugs. Establishing the Zustand store patterns and the Vite/Tailwind config also unblocks all subsequent UI work.
**Delivers:** Working project skeleton, typed data models, tested generator functions (crosshairCodeGen.ts, cfgGenerator.ts), both Zustand stores, and the shared UI primitives library.
**Addresses:** Core architecture patterns, Zustand store setup
**Avoids:** Pitfall 3 (custom share code encoder — use akiver from day one), Pitfall 6 (Zustand full-store subscriptions — establish selective selector patterns immediately)

### Phase 2: Crosshair Feature (Core)
**Rationale:** The crosshair section is built before the config section because it has higher design complexity (SVG preview + share code encoding) and is the feature that validates the core concept. The crosshair preview is the highest-interest element for first impressions. Getting the share code encoder working and tested here, before adding config complexity, reduces risk.
**Delivers:** Fully functional crosshair designer — SVG live preview, all 12 core parameter controls, CS2 import code generation with copy-to-clipboard.
**Uses:** React 19 SVG rendering, Zustand crosshair store, akiver/csgo-sharecode v4, Tailwind layout
**Avoids:** Pitfall 3 (akiver library integration verified working), Pitfall 4 (SVG vs Canvas — correct approach)

### Phase 3: Config Builder (Core)
**Rationale:** Config builder sections are independent of each other and of the crosshair feature, so they can be built in any internal order. The config builder is less technically risky than the crosshair feature but requires careful command-by-command validation against CS2's actual command set.
**Delivers:** Config form with sensitivity, network rates, audio, FPS, HUD settings; basic key binds (jump, grenades, console); launch options; live .cfg preview textarea; autoexec.cfg download; cfg folder path instructions.
**Implements:** ConfigForm, all section components, CfgPreview, DownloadButton, InstallInstructions
**Avoids:** Pitfall 1 (no deprecated networking commands — build allowlist first), Pitfall 2 (scancode bind format), Pitfall 5 (defunct launch options excluded), Pitfall 7 (URL.revokeObjectURL after download)

### Phase 4: App Shell, Routing, and Deployment
**Rationale:** Routing and the app shell should follow working feature sections so the layout is informed by actual content. The Vercel deployment and vercel.json rewrite config must be established as a complete unit — not deferred — because all subsequent AdSense and routing testing happens against the live domain.
**Delivers:** MainLayout with navigation, react-router-dom v7 routes (/crosshair, /config, /about), Vercel deployment, vercel.json rewrite rules, ads.txt in /public.
**Avoids:** Pitfall 5 (vercel.json rewrites added at first deploy), AdSense pre-requisite (ads.txt live before application submission)

### Phase 5: AdSense Integration
**Rationale:** AdSense is integrated after the live deployment is confirmed stable, because ads only render on approved production domains. The application process (which requires a live, content-rich, policy-compliant site) cannot begin until the site is deployed. The AdUnit component and index.html script tag can be implemented immediately, but ad slot testing must happen post-deployment.
**Delivers:** AdUnit component with try/catch-guarded push(), AdSense script tag in index.html, ad slot placements in MainLayout, AdSense application submitted.
**Avoids:** Pitfall 4 (StrictMode double-push), AdSense gotcha (script in index.html not in a component)

### Phase 6: Differentiating Features (v1.x)
**Rationale:** These features are high value but depend on the core being stable. Crosshair import parsing uses the same akiver library already integrated. Shareable URL and pro player presets are low complexity additions once the state management and crosshair feature are working. This phase turns a functional tool into a competitive one.
**Delivers:** Crosshair import code parsing (paste CSGO-... to pre-populate), shareable URL (crosshair settings in query string), pro player presets (top 10-20), viewmodel settings section, eDPI calculator, multiple map background previews.
**Addresses:** All P2 features from the feature prioritization matrix

### Phase 7: Polish, SEO, and Content
**Rationale:** SEO-oriented content (About page, Privacy Policy, FAQ) is required for AdSense approval and improves organic discovery. Inline command explanations, CS2 color palette labels, and the alpha percentage display are low-effort UX polish with disproportionate trust value for knowledgeable users.
**Delivers:** About page, Privacy Policy page, inline command tooltips, UX polish (alpha % display, color preset labels, non-QWERTY keyboard note in bind output, Mac/Linux cfg path options).

### Phase Ordering Rationale

- Pure logic before UI is non-negotiable: generator functions must be tested before stores are built and stores before components. Inverting this order means building UI against unverified output, and the primary trust failure mode for this tool is incorrect crosshair codes or broken .cfg files.
- Crosshair before config because it has higher technical complexity (share code encoding) and is the primary visual hook for new users. Validating the akiver library integration early prevents the highest-cost recovery scenario.
- Routing and deployment before AdSense because AdSense approval requires a live domain, and ad slot testing is meaningless on localhost.
- Differentiating features after core because they depend on stable state management and the core generators being proven correct.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Crosshair Core):** The akiver/csgo-sharecode field-to-console-command translation table needs to be built from library source inspection — not yet documented in research. The SVG scaling math to match actual in-game crosshair proportions needs empirical validation against a real CS2 client.
- **Phase 3 (Config Builder):** The CS2 scancode lookup table for the bind output needs to be built from the SDL2 scancode specification. This is a data-heavy task with no shortcut.
- **Phase 5 (AdSense):** AdSense eligibility requirements (content sufficiency, policy compliance for gaming content) need checking against current Google policy before the application is submitted.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Scaffold):** Vite + Tailwind v4 + Zustand 5 setup is fully documented in official sources. Installation commands are already verified.
- **Phase 4 (Deployment):** Vercel deploy + vercel.json rewrite is a one-time well-documented fix.
- **Phase 6 (v1.x features):** Shareable URL encoding, pro player preset data (all public), and eDPI math are all standard patterns with no research needed.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core technologies verified against official docs and release notes. Vite 8.0.3, React 19.2.1, Tailwind v4, Zustand 5.0.x version numbers confirmed. akiver v4.0.0 ESM-only requirement verified from GitHub releases. |
| Features | MEDIUM-HIGH | Feature set verified via direct page inspection of 5 competitors. CS2 crosshair parameter list verified against totalcsgo.com/commands. The combined tool gap assessment is based on competitive analysis, not user research — it is a hypothesis to validate. |
| Architecture | HIGH | Architecture patterns are directly derived from Bulletproof React (well-established), Zustand maintainer guidance on store separation, and SVG vs Canvas analysis. The build order is logical and internally consistent. |
| Pitfalls | HIGH for CS2 domain | CS2-specific deprecations (cl_updaterate removal, -novid removal, scancode bind change) are corroborated by multiple independent sources. akiver library requirements verified from source. AdSense and Vercel patterns are MEDIUM — verified across multiple community sources but no single official React+Vite+AdSense guide exists. |

**Overall confidence: HIGH**

### Gaps to Address

- **Share code field mapping:** The akiver/csgo-sharecode library's internal field names (e.g., `length`, `gap`) do not map 1:1 to CS2 console commands (`cl_crosshairsize`, `cl_crosshairgap`). This translation table must be built by reading the library source before implementing the crosshair feature. Do not assume the field names match.
- **SVG proportional accuracy:** The crosshair preview SVG math in research is a plausible approximation, but exact pixel matching to CS2's in-game rendering has not been empirically validated. Plan for a calibration step in Phase 2.
- **CS2 scancode table completeness:** The bind output requires a lookup table mapping SDL2 scancodes to physical key positions. This table was not built during research. It is a bounded, solvable problem but represents real implementation work in Phase 3.
- **AdSense approval timeline and content thresholds:** Google's current content sufficiency requirements for AdSense approval on gaming tools are not precisely known. Plan for an About page, FAQ, and Privacy Policy as prerequisites — and budget for a potential re-application cycle of 1-2 weeks.
- **Mac/Linux cfg path:** Research confirmed the Windows path is standard; the Mac path was identified (`~/Library/Application Support/Steam/...`). Linux path was not explicitly verified. Note for Phase 7.

---

## Sources

### Primary (HIGH confidence)
- [React v19 release — react.dev/blog](https://react.dev/blog/2024/12/05/react-19) — version and feature verification
- [Sunsetting Create React App — react.dev/blog](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) — CRA deprecation confirmed official
- [Vite releases — github.com/vitejs/vite/releases](https://github.com/vitejs/vite/releases) — v8.0.3 current stable
- [Tailwind CSS v4.0 — tailwindcss.com/blog](https://tailwindcss.com/blog/tailwindcss-v4) — v4 features and Vite plugin
- [akiver/csgo-sharecode GitHub](https://github.com/akiver/csgo-sharecode) — v4.0.0 ESM-only, BigInt requirement, field names
- [Total CS Crosshair Commands — totalcsgo.com](https://totalcsgo.com/commands/categories/crosshair) — CS2 crosshair parameter reference
- [Total CS Launch Options — totalcsgo.com](https://totalcsgo.com/launch-options) — confirmed defunct options (-novid, -tickrate 128, etc.)
- [Bulletproof React — github.com/alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react) — feature-based project structure
- [Zustand store organization — github.com/pmndrs/zustand/discussions/2486](https://github.com/pmndrs/zustand/discussions/2486) — maintainer guidance on independent stores
- [Vercel SPA routing fix — Vercel Community](https://community.vercel.com/t/404-on-refresh-direct-access-for-spa-subpaths-vercel-deployment/12593) — vercel.json rewrite requirement
- [file-saver — npmjs.com](https://www.npmjs.com/package/file-saver) — package status
- [AdSense eligibility — support.google.com/adsense](https://support.google.com/adsense/answer/9724) — approval requirements, ads.txt

### Secondary (MEDIUM confidence)
- [CS2 September 2023 update removes legacy convars — esports.gg](https://esports.gg/news/counter-strike-2/cs2-september-13-update/) — cl_updaterate, cl_cmdrate removal
- [Valve removed cl_interp — bo3.gg](https://bo3.gg/news/valve-has-removed-the-clinterp-and-clinterpratio-commands-from-cs2-a-new-update-in-the-game) — cl_interp, cl_interp_ratio removal
- [CS2 bind scancode format — Steam Community](https://steamcommunity.com/sharedfiles/filedetails/?l=german&id=3163205753) — February 2024 scancode change
- [CSDB.gg Crosshair Generator](https://csdb.gg/crosshair-generator/) — competitor feature baseline
- [cs2config.com Crosshair Generator](https://cs2config.com/crosshair-generator/) — competitor feature baseline
- [DatHost CS2 Crosshair Generator](https://dathost.net/tools/cs2-crosshair-generator) — competitor feature baseline
- [AdSense in SPA — jasonwatmore.com](https://jasonwatmore.com/add-google-adsense-to-a-single-page-app-react-angular-vue-next-etc) — SPA integration pattern
- [Zustand re-render optimization — dev.to](https://dev.to/eraywebdev/optimizing-zustand-how-to-prevent-unnecessary-re-renders-in-your-react-app-59do) — selector patterns, useShallow

### Tertiary (LOW confidence)
- [ProSettings.net CS2 Generator](https://prosettings.net/tools/cs2-crosshair-generator/) — page fetch returned CSS only; feature set inferred from name
- [eloboss.net CS2 Launch Options](https://eloboss.net/blog/csgo-launch-options) — WebSearch only; not directly inspected

---
*Research completed: 2026-03-31*
*Ready for roadmap: yes*
