# Feature Research

**Domain:** CS2 crosshair generator + config/autoexec builder web tool
**Researched:** 2026-03-31
**Confidence:** MEDIUM-HIGH (tool feature sets verified via direct page inspection of csdb.gg, cs2config.com, totalcsgo.com, dathost.net, mobbi.dev; crosshair parameter list verified against official CS2 console command reference)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Real-time crosshair preview | Every major tool has it; users won't accept editing blind | MEDIUM | Render on HTML canvas or SVG; must update on every slider change with zero perceptible lag |
| All core crosshair parameters | Users know the console commands; if a param is missing, trust is lost | LOW | Full list: style, size, gap, thickness, outline (draw + thickness), alpha (use + value), dot, T-style, color (preset + RGB) — see parameter list below |
| CS2 import code generation | The whole point — output `CSGO-XXXXX-...` format for in-game import | HIGH | Requires implementing the share code encoding algorithm (see akiver/csgo-sharecode on GitHub); this is the most technically demanding table-stakes feature |
| Copy-to-clipboard button | Users expect one-click copy, not manual selection | LOW | Standard browser Clipboard API; show visual confirmation ("Copied!") |
| Autoexec.cfg download | Users expect a file they can drop in their cfg folder | LOW | Build config string server-side or client-side, then `Blob` + `URL.createObjectURL` for download |
| Sensitivity field in config builder | Every config tool covers this; it's the first thing players set | LOW | Input for `sensitivity` value (float, typically 0.1–5.0) |
| Network rate settings | Competitive players know `rate 786432`; missing it feels incomplete | LOW | Dropdown or locked preset for `rate` (786432 = max), `cl_interp_ratio` (1 or 2) |
| Key bind configuration | Grenade binds and jump binds are the most-requested config items | MEDIUM | At minimum: jump, buy menu, grenade cycle, individual grenades (smoke/flash/HE/molotov/incendiary), console toggle |
| Instructions for file placement | New players don't know the cfg folder path | LOW | Static text: `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\` plus copy button |
| Launch options builder | Players always ask "what launch options should I use?" | LOW | Simple checklist or toggles for: `-novid`, `-console`, `-high`, `+fps_max 0`, `-freq`, `+exec autoexec.cfg` |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Combined crosshair + config in one tool | No major competitor does this well in one place; most are siloed | LOW | Primary differentiator per PROJECT.md; just layout/UX work since both features exist separately already |
| Multiple map background previews | Profilerr and cs2config.com do this; tests crosshair visibility on different map colors | MEDIUM | Need several static CS2 map screenshot backgrounds; cycle through with navigation arrows or selector; most competitors offer only 1-2 backgrounds |
| Crosshair import code parsing | Let users paste an existing `CSGO-XXXXX-...` code to pre-populate the generator | HIGH | Requires implementing the share code decode path (same library as encode); dathost and cs2config.com have this; totalcsgo.com does too |
| Shareable URL for crosshair | Encode crosshair settings in URL params; paste link to share with teammates | LOW | Encode as query string or hash; zero backend needed; csdb.gg and totalcsgo.com have this |
| Viewmodel settings section | Frequently requested; viewmodel_fov, x/y/z offsets, left/right hand | LOW | 5 numeric inputs with sliders; range validation (fov: 54-68, x: -2.5 to 2.5, y/z: -2 to 2) |
| eDPI calculator / sensitivity helper | Shows eDPI (sens × DPI) and cm/360 alongside sensitivity input | LOW | Pure math; no API needed; helps players understand what their sensitivity means physically |
| Preset config templates | "Max FPS", "Competitive", "Beginner" presets one-click populate all fields | LOW | Just hardcoded JSON objects mapped to named buttons; csdb.gg's autoexec tool does this well |
| Pro player crosshair presets | s1mple, ZywOo, NiKo, donk, ropz presets — players search for these constantly | LOW | Hardcoded crosshair data (all public information); totalcsgo.com has 995 pro crosshairs; start with top 10-20 most searched |
| Inline command explanations | Tooltip or inline text explaining what each command does (e.g., "rate: max bandwidth to server") | LOW | Pure content; reduces user confusion and trust gap for less experienced players |
| Crosshair color preview with actual CS2 palette names | Show preset name labels (Green, Yellow, Blue, Cyan, Red) alongside the color picker | LOW | Small UX polish detail; reduces confusion for players who recognize preset names from in-game |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts / saved configs | "I want my config saved for next time" | Adds backend, auth, database, and privacy compliance (GDPR/COPPA risk for gaming audience); v2 complexity with no validation that users actually return | Use URL-encoded sharing so configs are shareable without accounts; use localStorage to persist last session silently |
| Automated cfg file placement | "I want it to install automatically" | Browsers cannot write to arbitrary filesystem paths; any approach requires a native app or browser extension — out of scope entirely | Show explicit copy-paste instructions with exact path + copy button; good instructions solve 95% of this need |
| Crosshair animation / recoil simulation | "Show how it looks while spraying" | High complexity (simulating recoil patterns accurately), low accuracy (client-side simulation diverges from real game), maintenance burden when Valve updates patterns | Show crosshair on multiple static backgrounds instead; animated preview adds complexity without proportional value |
| "Import from game files" | "Detect my current settings automatically" | Browsers have no filesystem access to `userdata/` or `cfg/`; requires Electron or native app | Provide manual import via paste-your-share-code for crosshair; for config, ask users to enter values manually |
| Full bind editor with every possible action | Bind for every single game action (200+ commands) | The long tail of obscure binds confuses most users and bloats the UI massively | Cover the 10-15 most common binds (jump, grenades, buy, voice, console); advanced users can edit the .cfg file directly |
| Sensitivity converter (game-to-game) | "Convert my Valorant sensitivity to CS2" | Legitimate feature but already done well by dedicated tools (mouse-sensitivity.com, gamingsmart.com); adds scope without differentiation | Show eDPI and cm/360 for the user's CS2 sensitivity as an informational display only |
| Video settings builder | "Set my resolution, refresh rate, etc." | These are not in autoexec.cfg — they live in a separate game settings file that users cannot easily override via config; misleading to include | Include only launch options that affect display (e.g., `-freq`) and note that resolution is set in-game |
| Real-time multiplayer "compare crosshairs" | "Show two crosshairs side by side" | Adds significant UX complexity, no competitor has it, and the use case is narrow | Pro player presets serve the same comparison need |

---

## CS2 Crosshair Parameter Reference

Complete list of CS2 crosshair console commands to implement in the generator (verified against totalcsgo.com/commands/categories/crosshair):

**Core visual parameters (all generators cover these):**
- `cl_crosshairstyle` — style: 0 (default dynamic), 1 (static default), 2 (classic static+dynamic dots), 3 (classic dynamic), 4 (classic static — most popular), 5 (mix)
- `cl_crosshairsize` — arm length; range approx -20 to 20, default 5
- `cl_crosshairthickness` — line width; default 1
- `cl_crosshairgap` — gap between arms; range approx -10 to 10
- `cl_crosshairdot` — center dot toggle (0/1)
- `cl_crosshairt` — T-style, removes top arm (0/1)
- `cl_crosshairalpha` — transparency value (0–255)
- `cl_crosshairusealpha` — whether alpha applies (0/1)
- `cl_crosshaircolor` — preset color (0=red, 1=green, 2=yellow, 3=dark blue, 4=light blue)
- `cl_crosshaircolor_r` / `_g` / `_b` — custom RGB (0–255 each); active when color=5
- `cl_crosshair_drawoutline` — outline toggle (0/1)
- `cl_crosshair_outlinethickness` — outline thickness (0–3)

**Advanced parameters (fewer tools cover these):**
- `cl_crosshairgap_useweaponvalue` — dynamic gap per weapon (0/1)
- `cl_fixedcrosshairgap` — gap override for fixed styles
- `cl_crosshair_dynamic_splitdist` — split distance for dynamic styles
- `cl_crosshair_dynamic_splitalpha_innermod` — inner alpha for dynamic
- `cl_crosshair_dynamic_splitalpha_outermod` — outer alpha for dynamic
- `cl_crosshair_dynamic_maxdist_splitratio` — ratio of inner to outer
- `cl_crosshair_sniper_width` — scoped crosshair line width
- `cl_crosshair_recoil` (alias `cl_crosshair_followrecoil`) — crosshair follows recoil (0/1)

**For MVP: implement core visual parameters. Advanced parameters are a v1.x enhancement.**

---

## Config Builder Parameter Reference

Settings to cover in the autoexec.cfg builder (drawn from csdb.gg, mobbi.dev, and totalcsgo.com research):

**Mouse / Sensitivity:**
- `sensitivity` — mouse sensitivity (float, 0.1–5.0)
- DPI field (informational only, for eDPI calculation — not written to cfg)
- `zoom_sensitivity_ratio_mouse` — zoom/scoped sensitivity multiplier

**Network / Rates:**
- `rate` — max bandwidth (786432 = competitive max, 524288 = balanced, 196608 = default)
- `cl_interp_ratio` — interpolation ratio (1 = competitive, 2 = default)

**FPS:**
- `fps_max` — FPS cap (0 = unlimited; common values: 0, 300, 400, 999)

**Audio:**
- `volume` — master volume (0.0–1.0)
- `snd_musicvolume` — music volume (0.0–1.0)
- `voice_enable` — voice chat (0/1)

**HUD:**
- `cl_hud_color` — HUD color index
- `cl_radar_scale` — radar zoom level
- `cl_showfps` — FPS counter (0/1)

**Viewmodel:**
- `viewmodel_fov` — weapon FOV (54–68)
- `viewmodel_offset_x` — left/right (-2.5 to 2.5)
- `viewmodel_offset_y` — forward/back (-2 to 2)
- `viewmodel_offset_z` — up/down (-2 to 2)
- `cl_prefer_lefthanded` — left hand (0/1)

**Key Binds (most common, highest value):**
- Jump: `bind SPACE "+jump"` (or scroll wheel jump: `bind mwheeldown "+jump"`)
- Console toggle: `bind "`toggle voice"` / `toggleconsole`
- Buy menu binds
- Grenade binds: smoke, flash, HE grenade, molotov/incendiary, decoy
- Scoreboard, voice, radio

**Launch Options (output to separate section with instructions):**
- `-novid` — skip intro video
- `-console` — open console on launch
- `+exec autoexec.cfg` — load autoexec (critical)
- `-freq [Hz]` — force monitor refresh rate
- `+fps_max 0` — uncap FPS from launch
- `-high` — high CPU priority
- `-tickrate 128` — 128 tick for offline servers

---

## Feature Dependencies

```
[Crosshair Parameter Controls]
    └──requires──> [Canvas/SVG Preview Renderer]
                       └──requires──> [Real-time State Management]

[CS2 Import Code Generation]
    └──requires──> [Share Code Encoder] (akiver/csgo-sharecode algorithm)
    └──requires──> [All Core Crosshair Parameters implemented]

[CS2 Import Code Parsing]
    └──requires──> [Share Code Decoder] (same library)
    └──enhances──> [Crosshair Parameter Controls] (pre-populates fields)

[Shareable URL]
    └──requires──> [Crosshair Parameter Controls]
    └──requires──> [URL encoding/decoding logic]
    └──enhances──> [CS2 Import Code Generation] (complements sharing)

[Pro Player Presets]
    └──requires──> [All Core Crosshair Parameters implemented]
    └──enhances──> [CS2 Import Code Generation]

[eDPI Calculator]
    └──requires──> [Sensitivity input field]
    └──enhances──> [Config Builder: sensitivity section]

[Autoexec.cfg Download]
    └──requires──> [All Config Builder fields]

[Config Builder: Viewmodel]
    └──enhances──> [Autoexec.cfg Download] (included in output)

[Launch Options Builder]
    └──enhances──> [Autoexec.cfg Download] (can include +exec or output separately)
```

### Dependency Notes

- **Import code generation requires share code encoder:** The `CSGO-XXXXX-...` format is not a simple concatenation — it uses a custom Base57 encoding scheme. The akiver/csgo-sharecode library (MIT license, JavaScript) implements this. Must be verified for CS2 compatibility before building custom implementation.
- **Preview renderer must come before parameters:** Render logic must exist before parameter controls are wired up; building parameters without a preview creates invisible work.
- **Crosshair import parsing enhances the generator:** A user pasting `CSGO-XXXXX-...` and seeing it pre-populate all sliders is a high-trust moment; this makes the generator feel authoritative.
- **Config sections are independent:** Sensitivity, rates, binds, viewmodel, and launch options have no hard dependencies on each other — they can be built and tested in any order.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Real-time crosshair preview (canvas rendering) — without this nothing works
- [ ] Core crosshair parameters: style, size, gap, thickness, dot, T-style, outline, alpha, color (presets + custom RGB) — the full parameter set makes the tool trustworthy
- [ ] CS2 import code generation (`CSGO-XXXXX-...`) — this is the primary output users need
- [ ] Copy-to-clipboard for crosshair code — removes friction at the final step
- [ ] Config builder: sensitivity, network rates, volume, basic binds (jump, grenades, console) — covers 80% of what an autoexec needs
- [ ] Autoexec.cfg download — the second primary output
- [ ] Instructions with cfg folder path + copy button — without this, many users won't know where to put the file
- [ ] Launch options section with `+exec autoexec.cfg` prominently noted — prevents "why doesn't my config load?" confusion

### Add After Validation (v1.x)

Features to add once core is working and there is some traffic.

- [ ] Crosshair import code parsing (paste `CSGO-...` to pre-populate) — high value, same library as generation; add when share code encoder is proven working
- [ ] Shareable URL for crosshair — low effort once state management exists; add as a follow-up to the crosshair feature
- [ ] Pro player presets (top 10–20) — high search intent; drives SEO and return visits
- [ ] Viewmodel settings section — rounds out the config builder; frequently searched
- [ ] Multiple map background previews — polish that improves trustworthiness
- [ ] eDPI calculator alongside sensitivity input — low effort, demonstrates competence

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Advanced crosshair parameters (dynamic split, sniper width, follow recoil, weapon-specific gap) — small audience, adds UI complexity
- [ ] Config presets ("Max FPS", "Beginner", "Competitive") — useful but not differentiating; add once basic config builder is stable
- [ ] Expanded bind editor (all grenade slots, buy binds, custom alias binds) — long tail feature; start with most common binds
- [ ] User accounts + saved configs — significant backend complexity; validate with localStorage first to see if users actually want persistence

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Real-time crosshair preview | HIGH | MEDIUM | P1 |
| Core crosshair parameters (all 12) | HIGH | LOW | P1 |
| CS2 import code generation | HIGH | HIGH | P1 |
| Copy-to-clipboard | HIGH | LOW | P1 |
| Config builder: sensitivity + rates | HIGH | LOW | P1 |
| Config builder: key binds | HIGH | MEDIUM | P1 |
| Autoexec.cfg download | HIGH | LOW | P1 |
| Cfg folder instructions | HIGH | LOW | P1 |
| Launch options section | MEDIUM | LOW | P1 |
| Crosshair import code parsing | HIGH | HIGH | P2 |
| Shareable URL | MEDIUM | LOW | P2 |
| Pro player presets | HIGH | LOW | P2 |
| Viewmodel settings | MEDIUM | LOW | P2 |
| Multiple map backgrounds | MEDIUM | MEDIUM | P2 |
| eDPI calculator | MEDIUM | LOW | P2 |
| Advanced crosshair params | LOW | MEDIUM | P3 |
| Config presets templates | MEDIUM | LOW | P3 |
| Full bind editor | LOW | HIGH | P3 |
| User accounts | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | totalcsgo.com | csdb.gg | cs2config.com | dathost.net | Our Approach |
|---------|--------------|---------|---------------|-------------|--------------|
| Real-time crosshair preview | Yes | Yes | Yes, rotating backgrounds | Yes, moveable | Yes — static map background(s), instant update |
| All core crosshair params | Yes (most complete) | Yes | Yes | Yes (partial) | Yes — full list including advanced |
| CS2 import code generation | Yes | Yes | Yes | No (outputs console commands only) | Yes — primary output format |
| Crosshair import code parsing | Yes | No | Yes | No | Yes (v1.x) |
| Shareable URL | Yes | No | Yes | No | Yes (v1.x) |
| Pro player presets | Yes (995 pros) | Yes (top players) | Yes (top players) | Yes (NiP players only) | Yes — top 10–20 most searched (v1.x) |
| Multiple map backgrounds | Yes | No | Yes | Yes | Yes (v1.x) |
| Autoexec builder | No | Yes (limited) | Separate tool | No | Yes — combined in same product |
| Viewmodel settings | No | Yes | No | No | Yes (v1.x) |
| Config download (.cfg file) | No | Yes | Yes | No | Yes — primary output |
| Launch options builder | No | Yes (basic) | Separate tool | No | Yes |
| eDPI calculator | No | No | No | No | Yes (v1.x) as inline display |
| Combined crosshair + config | No | Partial | Partial (separate pages) | No | **Yes — core differentiator** |
| Monetization (ads) | Yes | Yes | Unclear | Yes | Yes (AdSense) |

**Key insight:** No single tool combines a polished crosshair generator with a full autoexec config builder in one cohesive experience. The market is fragmented. The combined tool is a real gap.

---

## Sources

- [Total CS Crosshair Generator](https://totalcsgo.com/crosshairs/generator) — MEDIUM confidence (page inspected via WebFetch)
- [Total CS Crosshair Commands](https://totalcsgo.com/commands/categories/crosshair) — HIGH confidence (official CS2 command reference)
- [CSDB.gg Crosshair Generator](https://csdb.gg/crosshair-generator/) — MEDIUM confidence (page inspected)
- [CSDB.gg Autoexec Generator](https://csdb.gg/autoexec-generator/) — MEDIUM confidence (page inspected)
- [cs2config.com Crosshair Generator](https://cs2config.com/crosshair-generator/) — MEDIUM confidence (page inspected)
- [DatHost CS2 Crosshair Generator](https://dathost.net/tools/cs2-crosshair-generator) — MEDIUM confidence (page inspected)
- [mobbi.dev CS2 Autoexec Generator](https://mobbi.dev/cs2-autoexec-generator) — MEDIUM confidence (page inspected)
- [CSDB.gg Launch Options](https://csdb.gg/launch-options/) — MEDIUM confidence (page inspected)
- [akiver/csgo-sharecode on GitHub](https://github.com/akiver/csgo-sharecode) — HIGH confidence (source code inspected; documents exact share code fields)
- [ProSettings.net CS2 Crosshair Generator](https://prosettings.net/tools/cs2-crosshair-generator/) — LOW confidence (page fetch returned CSS only, not interactive content)
- [eloboss.net CS2 Launch Options](https://eloboss.net/blog/csgo-launch-options) — LOW confidence (WebSearch only)
- [WebSearch: CS2 crosshair generator tools comparison 2026](https://dathost.net/tools/cs2-crosshair-generator) — LOW confidence baseline, elevated by direct page inspections

---
*Feature research for: CS2 Setup Builder (crosshair generator + config builder web app)*
*Researched: 2026-03-31*
