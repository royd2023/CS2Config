# CS2 Setup Builder

## What This Is

A web tool for CS2 players to design their crosshair visually and build their autoexec config, then export a ready-to-use `.cfg` file and crosshair import code. Built for CS2 players who want a clean, all-in-one setup tool without digging through Reddit threads or janky existing tools. Monetized passively via Google AdSense.

## Core Value

A CS2 player can configure their crosshair and autoexec settings in one place and walk away with files they can drop straight into the game.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Crosshair designer with real-time visual preview
- [ ] Crosshair settings: style, size, thickness, gap, color, dot, alpha
- [ ] Crosshair export as CS2 import code (`crosshair import CSGO-XXXXX-...`)
- [ ] Config builder: sensitivity, DPI, rates (cl_updaterate, cl_cmdrate), volume, launch options
- [ ] Config builder: key binds (jump, buy, grenades, etc.)
- [ ] Export autoexec.cfg as downloadable file
- [ ] Instructions showing exact cfg folder path with copy button
- [ ] Google AdSense integration for passive monetization
- [ ] Responsive, high-quality UI (must not look AI-generated)

### Out of Scope

- Desktop app (Electron/Tauri) — v2; adds complexity, web tool covers 90% of use case
- User accounts / saved configs — v2; adds backend complexity
- CS2 API integration / live game data — no public API available
- Automated file placement — browsers cannot write to arbitrary filesystem paths

## Context

- Built by a CS student at OSU who plays CS2, so domain knowledge is strong
- Passive income goal: deploy on Vercel (free), apply for Google AdSense after launch
- Target audience: CS2 players of all skill levels, particularly those setting up a new PC or tweaking their config
- Existing tools in this space are fragmented (crosshair tools separate from config tools) or poorly designed — opportunity to do it better with a combined, polished UI
- The crosshair designer outputs CS2's native crosshair import code format; no game files are modified directly
- The autoexec builder outputs a standard `.cfg` file players place in `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\`

## Constraints

- **Tech Stack**: React — better to maintain, good for resume/portfolio
- **Hosting**: Vercel free tier — zero cost to start
- **Monetization**: Google AdSense — lowest friction, apply after site is live with traffic
- **Design**: Use frontend-design skill — must NOT look AI-generated; should feel like a real product
- **Budget**: $0 — everything must use free tiers

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React over plain HTML/JS | Better to maintain, component reuse for crosshair preview, looks good on resume | — Pending |
| Combined crosshair + config tool | More useful than two separate tools, stronger SEO hook ("all-in-one CS2 config") | — Pending |
| Web app only (no desktop) | Desktop app is v2 — web covers the core use case with far less complexity | — Pending |
| Google AdSense monetization | Lowest friction passive income, handles advertiser matching automatically | — Pending |
| Vercel for hosting | Free tier, zero-config React deploy, custom domain support | — Pending |

---
*Last updated: 2026-03-31 after initial project initialization*
