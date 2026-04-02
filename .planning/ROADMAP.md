# Roadmap: CS2 Setup Builder

## Overview

Starting from a blank React project, this roadmap delivers a polished CS2 crosshair designer and autoexec config builder in five phases. The build order is inside-out: pure logic and data foundations first, then the crosshair feature (highest technical complexity), then the config builder (highest data volume), then app shell and live deployment, then AdSense integration and content required for monetization eligibility. Each phase delivers a coherent, independently verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Project scaffold, typed data models, pure generator functions, Zustand stores, and shared UI primitives
- [ ] **Phase 2: Crosshair Feature** - Complete crosshair designer with SVG live preview, all parameter controls, and CS2 import code generation
- [ ] **Phase 3: Config Builder** - Complete config form with sensitivity, binds, audio, launch options, and autoexec.cfg download
- [ ] **Phase 4: App Shell and Deployment** - Routing, responsive layout, dark/light mode, shareable URL, cfg path instructions, and live Vercel deploy
- [ ] **Phase 5: Monetization and Content** - AdSense integration, pro player presets, and AdSense-eligibility pages (Privacy Policy, About)

## Phase Details

### Phase 1: Foundation
**Goal**: The project builds, runs, and has verified-correct output logic before any user-facing UI exists
**Depends on**: Nothing (first phase)
**Requirements**: (No direct v1 user-facing requirements — foundational work that unblocks all phases)
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts the Vite dev server with no errors and the app renders at localhost
  2. `npm run build` produces a production bundle with no TypeScript errors
  3. `npm test` runs Vitest and all crosshairCodeGen + cfgGenerator unit tests pass (covering at minimum: valid CS2 import code output, no deprecated commands in .cfg output)
  4. The Zustand crosshair store and config store are wired up and readable from browser devtools
  5. The shared UI primitive components (Slider, Select, ColorPicker, CopyButton) render in isolation without errors
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Vite 8 + React 19 project and configure full toolchain (Tailwind v4, Vitest 4, path aliases)
- [x] 01-02-PLAN.md — TypeScript types, Zustand stores with CS2 defaults, deprecated commands constants
- [ ] 01-03-PLAN.md — Generator functions (crosshairCodeGen, cfgGenerator) and unit tests
- [ ] 01-04-PLAN.md — Shared UI primitives (Slider, Select, ColorPicker, CopyButton) and barrel export

### Phase 2: Crosshair Feature
**Goal**: A user can design their crosshair visually and copy their CS2 import code — the complete crosshair workflow end-to-end
**Depends on**: Phase 1
**Requirements**: XHAIR-01, XHAIR-02, XHAIR-03, XHAIR-04, XHAIR-05, XHAIR-06, XHAIR-07, XHAIR-08, XHAIR-09, EXPO-02
**Success Criteria** (what must be TRUE):
  1. User sees a live SVG crosshair preview on a dark in-game-like background that updates in real time as they move any slider or toggle
  2. User can change crosshair style (classic static, classic dynamic, classic, tee) and see the preview update immediately
  3. User can adjust size, thickness, gap, color (RGB + alpha), center dot, T-style, and outline — all reflected in the preview
  4. User can click a copy button and paste the resulting `CSGO-XXXXX-...` import code directly into CS2 and get a matching crosshair
**Plans**: TBD

### Phase 3: Config Builder
**Goal**: A user can configure their game settings and download a ready-to-use autoexec.cfg file that contains only valid CS2 commands
**Depends on**: Phase 1
**Requirements**: CFG-01, CFG-02, CFG-03, CFG-04, CFG-05, EXPO-01
**Success Criteria** (what must be TRUE):
  1. User can set mouse sensitivity and DPI and sees the computed eDPI update as they type
  2. User can configure key binds for the top 15 actions and see them reflected in a live .cfg preview
  3. User can set audio settings and select launch options with descriptions — no deprecated flags are ever shown
  4. User can click one button and download an autoexec.cfg file that loads without errors in CS2 and contains no deprecated commands (no cl_updaterate, cl_cmdrate, cl_interp, -tickrate 128, etc.)
**Plans**: TBD

### Phase 4: App Shell and Deployment
**Goal**: The app is live on Vercel, navigable across sections, responsive on mobile and desktop, supports dark/light mode, and users can share their full setup via URL
**Depends on**: Phase 2, Phase 3
**Requirements**: UI-01, UI-02, EXPO-03, EXPO-04
**Success Criteria** (what must be TRUE):
  1. The app is reachable at a live Vercel URL and direct-URL access to any route returns the app (not a 404)
  2. The app is usable on a 375px mobile screen — controls are tappable and no content overflows
  3. User can toggle dark/light mode and the preference is visible across all sections
  4. User sees the exact cfg folder path for Windows and Mac with a copy button
  5. User can copy a share URL and opening it in a new browser tab restores their exact crosshair and config settings
**Plans**: TBD

### Phase 5: Monetization and Content
**Goal**: The app has AdSense ad slots integrated and meets Google's eligibility requirements, and users can load pro player presets as a starting point
**Depends on**: Phase 4
**Requirements**: UI-03, UI-04, UI-05
**Success Criteria** (what must be TRUE):
  1. AdSense ad unit slots are present in the layout and the AdSense script is in index.html — the site is ready to submit for AdSense approval
  2. ads.txt is served at the root domain (required for AdSense approval)
  3. User can select from at least 5 pro player presets and have their crosshair settings instantly populate from the selection
  4. The app has an About page and a Privacy Policy page accessible from the main navigation
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/4 | In progress | - |
| 2. Crosshair Feature | 0/? | Not started | - |
| 3. Config Builder | 0/? | Not started | - |
| 4. App Shell and Deployment | 0/? | Not started | - |
| 5. Monetization and Content | 0/? | Not started | - |
