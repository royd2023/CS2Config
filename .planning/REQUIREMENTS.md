# Requirements: CS2 Setup Builder

**Defined:** 2026-03-31
**Core Value:** A CS2 player can configure their crosshair and autoexec settings in one place and walk away with files they can drop straight into the game.

## v1 Requirements

### Crosshair Designer

- [ ] **XHAIR-01**: User sees a real-time SVG crosshair preview that updates as they change parameters
- [ ] **XHAIR-02**: User can adjust crosshair style (classic static, classic dynamic, classic, tee)
- [ ] **XHAIR-03**: User can adjust size, thickness, and gap
- [ ] **XHAIR-04**: User can set crosshair color (RGB + alpha)
- [ ] **XHAIR-05**: User can toggle center dot and configure dot size
- [ ] **XHAIR-06**: User can toggle T-style crosshair
- [ ] **XHAIR-07**: User can toggle outline and set outline thickness
- [ ] **XHAIR-08**: User can copy a CS2 crosshair import code (CSGO-XXXXX-...) to clipboard
- [ ] **XHAIR-09**: Crosshair preview renders on a dark in-game-like background

### Config Builder

- [ ] **CFG-01**: User can set mouse sensitivity and DPI, with computed eDPI displayed
- [ ] **CFG-02**: User can configure key binds for top 15 actions (jump, buy menu, grenade slots, inspect, voice, scoreboard, etc.)
- [ ] **CFG-03**: User can set audio settings (master volume, voice volume, mute enemy voice)
- [ ] **CFG-04**: User can set common launch options (with safe presets and descriptions for each flag)
- [ ] **CFG-05**: Generated config only uses valid CS2 commands (no deprecated CS:GO commands like cl_updaterate, cl_interp, etc.)

### Export & Instructions

- [ ] **EXPO-01**: User can download a ready-to-use autoexec.cfg file with one click
- [ ] **EXPO-02**: User can copy the CS2 crosshair import code from a dedicated copy button
- [ ] **EXPO-03**: User sees the exact cfg folder path (Windows and Mac) with a copy button
- [ ] **EXPO-04**: User can share their full setup via a URL that encodes all current settings

### UI & Design

- [ ] **UI-01**: App is responsive and usable on mobile and desktop
- [ ] **UI-02**: App has a dark/light mode toggle
- [ ] **UI-03**: App includes Google AdSense ad unit slots (ready for approval)
- [ ] **UI-04**: App ships with pro player crosshair and config presets (5+ pros)
- [ ] **UI-05**: App has required pages for AdSense eligibility (Privacy Policy, About)

## v2 Requirements

### Advanced Crosshair

- **XHAIR-V2-01**: User can import an existing CS2 crosshair share code to load settings
- **XHAIR-V2-02**: Advanced parameters: dynamic split, follow recoil, sniper width, deployed weapon gap

### Advanced Config

- **CFG-V2-01**: Viewmodel position settings (fov, offset_x/y/z, presets)
- **CFG-V2-02**: Full bind editor for all possible actions (not just top 15)
- **CFG-V2-03**: Network/rate settings if CS2 re-introduces them in a future update

### Platform

- **PLAT-V2-01**: Saved config profiles (requires backend/localStorage)
- **PLAT-V2-02**: User accounts
- **PLAT-V2-03**: Desktop app for direct file placement (Electron/Tauri)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Automated file placement into CS2 folder | Browser security prevents writing to arbitrary filesystem paths |
| Real-time game integration / overlay | No CS2 public API; requires unsafe game memory access |
| User accounts / cloud saves | Adds backend complexity; localStorage-based v2 is sufficient |
| CS:GO deprecated commands (cl_updaterate, cl_interp, cl_cmdrate) | Removed from CS2; must never appear in generated output |
| Desktop app (Electron/Tauri) | v2 — high complexity; web tool covers the core use case |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| XHAIR-01 | Phase 2 | Pending |
| XHAIR-02 | Phase 2 | Pending |
| XHAIR-03 | Phase 2 | Pending |
| XHAIR-04 | Phase 2 | Pending |
| XHAIR-05 | Phase 2 | Pending |
| XHAIR-06 | Phase 2 | Pending |
| XHAIR-07 | Phase 2 | Pending |
| XHAIR-08 | Phase 2 | Pending |
| XHAIR-09 | Phase 2 | Pending |
| CFG-01 | Phase 3 | Pending |
| CFG-02 | Phase 3 | Pending |
| CFG-03 | Phase 3 | Pending |
| CFG-04 | Phase 3 | Pending |
| CFG-05 | Phase 3 | Pending |
| EXPO-01 | Phase 3 | Pending |
| EXPO-02 | Phase 2 | Pending |
| EXPO-03 | Phase 4 | Pending |
| EXPO-04 | Phase 4 | Pending |
| UI-01 | Phase 4 | Pending |
| UI-02 | Phase 4 | Pending |
| UI-03 | Phase 5 | Pending |
| UI-04 | Phase 5 | Pending |
| UI-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-03-31 after roadmap creation*
