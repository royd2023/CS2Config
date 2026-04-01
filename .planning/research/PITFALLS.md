# Pitfalls Research

**Domain:** CS2 crosshair generator + autoexec config builder (React SPA)
**Researched:** 2026-03-31
**Confidence:** HIGH for CS2 domain (verified against official command references and community consensus); MEDIUM for React/AdSense patterns (multiple credible sources, no single authoritative spec)

---

## Critical Pitfalls

### Pitfall 1: Including Removed CS2 Networking Commands in autoexec Output

**What goes wrong:**
The generated autoexec.cfg includes `cl_updaterate`, `cl_cmdrate`, `cl_interp`, and/or `cl_interp_ratio`. These commands do not exist in CS2. Valve removed them in September 2023 (cl_updaterate, cl_cmdrate) and in a subsequent update (cl_interp, cl_interp_ratio). CS2 uses a sub-tick system where the server controls all netcode; clients cannot override it. Including these commands in the output produces a .cfg that appears broken to any player who checks their console — they'll see "Unknown command" errors — and destroys trust in the tool.

**Why it happens:**
Every CS:GO autoexec template on the internet includes these commands. They were valid for years. Without explicitly researching CS2-specific deprecations, any developer copying from CS:GO guides will include them.

**How to avoid:**
Do not include `cl_updaterate`, `cl_cmdrate`, `cl_interp`, or `cl_interp_ratio` in the config builder fields at all. The `rate` command remains valid (786432 for max bandwidth). If users enter values in a "network rates" section, output only `rate`. Add a visible note in the UI: "cl_updaterate and cl_interp_ratio were removed in CS2 — only `rate` applies."

**Warning signs:**
- Any source you reference that mentions "cl_updaterate" or "cl_interp_ratio" alongside CS2 is likely a CS:GO carry-over — verify the publication date
- Autoexec templates from Steam Community guides older than September 2023 will almost certainly include deprecated commands

**Phase to address:**
Config builder implementation phase. Create a canonical allowlist of valid CS2 commands before writing any output generation logic. Verify each command against totalcsgo.com/commands before including it.

---

### Pitfall 2: Using CS:GO Bind Syntax (Key Names) Instead of CS2 Scancode Format

**What goes wrong:**
Generated autoexec.cfg contains bind lines using key name strings, e.g. `bind "w" "+forward"` or `bind "mouse1" "+attack"`. As of the February 2024 CS2 update, CS2 switched to a scancode-based input system. Binds using the old key-name format may silently fail or produce unexpected behavior, particularly for keyboard layouts that are not US QWERTY (scancodes are position-based, not layout-based).

**Why it happens:**
Virtually every existing bind guide was written for CS:GO. The scancode change is a CS2-specific breaking change that postdates most reference material. The old format does not throw an error in all cases — it may appear to work on US QWERTY keyboards while breaking on others — making it easy to miss in testing.

**How to avoid:**
For any bind that maps to a physical key (WASD, number keys, F-keys), use the scancode format: `bind "scancode26" "+forward"` (26 = W on SDL2 layout). However, note that **special/named keys remain valid**: `bind "SPACE" "+jump"`, `bind "MOUSE1" "+attack"`, `bind "MWHEELDOWN" "+jump"` still work. The scancode requirement primarily affects alphabetic and numeric keys. Build a scancode lookup table for any bound keys and use it during output generation. Provide users with a note in the instructions explaining that the exported binds use scancodes for cross-layout compatibility.

**Warning signs:**
- Your bind output uses `bind "w"`, `bind "a"`, `bind "1"` etc. (letter/number key names without the "scancode" prefix)
- Testing only on a US QWERTY keyboard — non-QWERTY users will see broken binds

**Phase to address:**
Bind configuration phase. Before implementing bind output, establish the scancode table. Test the generated .cfg on a machine with a non-US keyboard layout if possible.

---

### Pitfall 3: Wrong crosshair share code encoding — building a custom encoder instead of using the verified library

**What goes wrong:**
Developer attempts to implement the `CSGO-XXXXX-...` share code encoding from scratch rather than using the `akiver/csgo-sharecode` library (MIT license). The encoding is a custom Base57-ish scheme operating on packed binary fields using BigInt arithmetic. A hand-rolled implementation will almost certainly produce invalid codes that either fail to import or silently produce wrong crosshair settings.

**Why it happens:**
The encoding is not publicly documented in a spec. The format looks simple from the outside ("just a share code"), but the internal byte packing is non-trivial. Developers who find no spec may assume they can infer it from examples. They cannot — not reliably.

**How to avoid:**
Use the `akiver/csgo-sharecode` npm package directly. It is MIT licensed, actively maintained (v4.0.0 released September 2024, added CS2 followRecoil support in v3.1.0), and is the de facto standard used by every serious CS2 tool. Do not reimplement what is already solved. Key integration notes:
- v4.0.0 is ESM-only — import with `import { decodeCrosshair, encodeCrosshair } from '@akiver/csgo-sharecode'`
- Requires BigInt support — fine for all modern browsers (Chrome 67+, Firefox 68+, Safari 14+), but explicitly verify this works in the Vite build before shipping
- The library's `Crosshair` object field names do not map 1:1 to CS2 console command names — build an explicit translation table between the library's fields (e.g. `length`, `thickness`, `gap`) and the console commands (`cl_crosshairsize`, `cl_crosshairthickness`, `cl_crosshairgap`)

**Warning signs:**
- You are writing bit-shift operations or Base57 character arrays by hand
- The generated code looks like valid `CSGO-` format but fails to import in-game
- Slight parameter changes produce codes that decode to wrong values

**Phase to address:**
Crosshair export implementation phase. Use the library from day one; do not defer this decision.

---

### Pitfall 4: Google AdSense double-push from React StrictMode

**What goes wrong:**
In development, React's StrictMode (enabled by default in Vite's react-ts template) intentionally invokes `useEffect` twice on mount. An AdUnit component with a `useEffect` that calls `(window.adsbygoogle = window.adsbygoogle || []).push({})` will call `push({})` twice per mount. In production this is harmless (StrictMode double-invoke only runs in development), but in development it fills the console with AdSense errors, makes it impossible to tell if the ad implementation is correct, and can cause unexpected behavior if there is any cleanup logic.

**Why it happens:**
This is a well-known React 18+ behaviour that surprises developers who are unfamiliar with StrictMode's intentional double-invocation. The AdSense push pattern was designed for non-React environments and has no built-in idempotency guard.

**How to avoid:**
Three mitigations in order of importance:
1. Wrap the push call in a try/catch — AdSense itself recommends this for SPA integrations: `try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}`
2. Accept that AdSense will not render ads in development at all (it only serves ads on approved production domains). Don't invest time debugging ad behavior in dev.
3. If you need to verify the push call is happening exactly once, use a `useRef` initialized to `false` as a guard: check `if (pushed.current) return; pushed.current = true;` before calling push.
Do not remove StrictMode to fix this — StrictMode catches real bugs and should remain on.

**Warning signs:**
- AdSense-related console errors only in development, not production
- Attempts to debug ad rendering on localhost

**Phase to address:**
AdSense integration phase. Apply the try/catch pattern when writing the AdUnit component; do not revisit this after the fact.

---

### Pitfall 5: Missing `vercel.json` rewrites for client-side routing — 404 on direct URL access

**What goes wrong:**
After deploying to Vercel, navigating directly to any non-root URL (e.g., `https://yoursite.com/config`) or refreshing any page other than `/` returns a Vercel 404 error. This happens because Vercel's CDN tries to serve a static file at that path, finds none, and returns 404 — it does not know the SPA handles routing client-side.

**Why it happens:**
This is a universal SPA deployment gotcha on any static host. Vercel does not automatically detect that the project uses client-side routing. Without a rewrite rule, every URL that isn't `/` fails on hard navigation.

**How to avoid:**
Add a `vercel.json` at the project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
This must be committed before the first non-root route is added. It is a one-time fix that should be part of the initial deployment checklist.

**Warning signs:**
- Works perfectly in local dev, breaks on Vercel immediately on any sub-route
- Users report "page not found" when sharing direct links

**Phase to address:**
Initial deployment/infrastructure phase. Add vercel.json on first Vercel deploy, before any routing is tested.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding the cfg folder path as a Windows-only path | Simple to display | Misleads Mac/Linux users who do have CS2 and need a different path; generates support questions | Only if you explicitly scope the tool as Windows-only with a visible disclaimer |
| Storing all crosshair state in a single flat Zustand slice with no selectors | Fast to write | Every slider drag re-renders all components subscribed to the store — crosshair preview, config builder, and ad units all re-render on every mouse move | Never — use selective subscriptions (`useStore(s => s.thickness)` not `useStore(s => s)`) from day one |
| Using `URL.createObjectURL` without `URL.revokeObjectURL` | .cfg download works | Blob URLs accumulate in memory; in a long session with many downloads this leaks; worse in React where components remount | Never for the download trigger itself — always call `URL.revokeObjectURL(url)` in a `setTimeout` immediately after the click is triggered |
| Using `cl_` commands from CS:GO guides without verifying they exist in CS2 | Fast authoring of command list | Config output contains commands that produce console errors or do nothing — destroys user trust | Never — verify every command against a current CS2 command reference |
| Skipping `ads.txt` in `/public` until after AdSense approval | Fewer files to manage | AdSense will flag the missing file during review and either delay approval or reject the application | Never — add `ads.txt` before submitting the AdSense application |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Google AdSense | Loading the AdSense script inside a React component via `useEffect` — causes it to load on every re-render | Put the `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXX">` tag directly in `index.html`; it loads once per page load |
| Google AdSense | Testing ad rendering on localhost and assuming it represents production behavior | AdSense only serves real ads on approved production domains. The `ins` element will be empty on localhost regardless of correct implementation. Deploy and test on the live URL. |
| Google AdSense | Placing ads inside React Router route components that unmount/remount on navigation | Each mount triggers a new `push({})`, which can cause AdSense to show multiple ad requests for the same slot. Use stable layout components outside the router outlet for ad placements, or key the AdUnit component on route to force clean remounts. |
| akiver/csgo-sharecode v4 | Importing with `require()` in a CommonJS context | v4 is ESM-only. Vite handles ESM natively, so this is not an issue in a Vite project — but if any tooling (Jest, scripts) runs in CJS, configure it for ESM or use `await import()`. |
| file-saver | Calling `saveAs(blob, filename)` and not verifying the MIME type | For `.cfg` files, use `text/plain` as the MIME type: `new Blob([content], { type: 'text/plain;charset=utf-8' })`. Some browsers treat unknown MIME types differently during download. |
| Clipboard API | Using `document.execCommand('copy')` (deprecated) | Use `navigator.clipboard.writeText(text)` — it's Promise-based and the modern standard. Note: requires a secure context (HTTPS or localhost), which Vercel provides. Handle the rejection case with a fallback UI message. |

---

## Performance Traps

Patterns that work at small scale but fail under real usage conditions.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Subscribing to the entire Zustand store (`useStore(s => s)`) in the crosshair preview component | Crosshair preview and unrelated components re-render on every slider change in the config builder | Select only the specific state slice each component needs: `useStore(s => s.crosshair.thickness)` | Immediately — performance degrades with every extra slider added to the UI |
| Creating inline arrow functions as Zustand selectors that return new object literals | React re-renders on every call even if state hasn't changed, because the selector returns a new object reference | Use `useShallow` hook from Zustand for selectors that return multiple values: `useStore(useShallow(s => ({ size: s.size, gap: s.gap })))` | Immediately in development (visible in React DevTools Profiler as constant re-renders) |
| Re-computing the share code string on every render instead of deriving it only when crosshair state changes | Share code string recomputed on every keystroke in config builder fields, wasting CPU | Memoize the share code with `useMemo` depending only on crosshair state slice | Not a user-visible problem at MVP scale, but becomes perceptible on slower devices |
| Rendering the SVG crosshair preview as a child of a component that owns unrelated state | Any config builder input change re-renders the crosshair preview even when crosshair params haven't changed | Isolate the CrosshairPreview into its own component that subscribes only to crosshair state | Visible immediately as a jank/flicker in the preview when typing in unrelated fields |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Injecting user-provided key bind strings directly into the .cfg output without sanitization | A user who enters a bind value containing newlines or semicolons could craft a .cfg that injects arbitrary commands — not a remote exploit risk for a static tool, but breaks the output format | Sanitize bind values: strip newlines, null bytes, and semicolons from all user-provided string fields before writing them into the config output |
| Treating the crosshair share code encoder as infallible | A malformed input to `encodeCrosshair()` may produce a code that crashes the import or corrupts settings in-game | Validate all crosshair parameter values against their legal ranges before passing to the encoder; clamp values at the UI layer (sliders already do this, but also validate in the encoding function) |
| Storing user config state in `localStorage` without a schema version | After a code update changes the state shape, deserializing old localStorage data produces type errors or undefined behavior | Add a schema version key to localStorage state; migrate or reset on version mismatch |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Generating a crosshair import code that starts with "CS2-" instead of "CSGO-" | The code will not be recognized by CS2's in-game import system; users report the tool as broken | The prefix is hardcoded as "CSGO-" even in CS2. The akiver library outputs this correctly — don't modify it |
| Providing only the Windows cfg path without any note for Mac/Linux users | Mac and Linux CS2 players (who do exist, especially on Steam Deck) get a path that doesn't match their system | Include the Mac path (`~/Library/Application Support/Steam/steamapps/common/Counter-Strike Global Offensive/game/csgo/cfg/`) as a secondary option with a selector or toggle |
| Not including `+exec autoexec.cfg` in the launch options section prominently | New users place the file correctly but the config never loads; they blame the tool | Make `+exec autoexec.cfg` the first item in the launch options output and add a callout: "This launch option is required for your autoexec to load" |
| Labeling the -novid launch option as useful | novid no longer works in CS2 as Valve removed the intro video — including it as a "recommended option" damages credibility with knowledgeable users | Do not include `-novid` in the launch options builder. Replace with a note explaining it was removed. |
| Showing crosshair alpha slider as 0–255 integers without also showing opacity percentage | Most users think in percentages; 255 is opaque by convention but unintuitive | Display both: the raw value (required for the console command) and the percentage equivalent |

---

## "Looks Done But Isn't" Checklist

Things that appear complete in a demo but are missing critical pieces.

- [ ] **Crosshair export:** Generates a `CSGO-` prefixed code visually — verify that the code actually imports correctly in-game (test with a real CS2 client, not just the decoder)
- [ ] **Bind output:** Binds look correct in the .cfg — verify that letter/number key binds use scancode format for cross-keyboard-layout compatibility
- [ ] **Config download:** The file downloads — verify it is UTF-8 encoded and has `\n` line endings, not `\r\n`; some CS2 config parsers are picky about CRLF
- [ ] **AdSense integration:** The `<ins>` element renders — verify `ads.txt` is accessible at `yourdomain.com/ads.txt` (not a 404) before submitting the AdSense application
- [ ] **Vercel routing:** Pages load from the homepage — verify direct URL access and page refresh on every route works in the deployed version, not just localhost
- [ ] **Launch options output:** `-novid`, `-tickrate 128`, `-disable_d3d9ex`, `-threads`, `cl_interp_ratio` are absent from all outputs — these are confirmed non-functional or removed in CS2
- [ ] **Networking section:** Does not include `cl_updaterate`, `cl_cmdrate`, or `cl_interp` — verify the generated .cfg is clean
- [ ] **Clipboard copy:** Copy button works — verify on HTTPS (Clipboard API requires secure context) and that rejection is handled gracefully

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Deprecated command in cfg output discovered post-launch | LOW | Remove the field from the config builder UI, update the output generator, and add an explanatory tooltip. No data migration needed (no stored configs). |
| Wrong bind syntax (key names instead of scancodes) shipped | LOW | Update the output generation function with the scancode table. Since no configs are persisted server-side, all new downloads will be correct immediately. |
| Custom share code encoder produces wrong codes | HIGH | Rewrite using the akiver library. This may require changing the internal state representation if it was designed around the custom encoder. Budget a full phase for the fix. |
| AdSense application rejected for policy violation | MEDIUM | Review Google's rejection reason (missing privacy policy, insufficient content, or ad placement policy). Add About, Privacy Policy, and Contact pages. Reapply — second applications are typically reviewed in 1-2 weeks. |
| Vercel 404 on sub-routes discovered post-launch | LOW | Add `vercel.json` with rewrite rules and redeploy. Fix takes under 5 minutes. |
| Zustand full-store subscription causing perf issues | MEDIUM | Refactor component subscriptions to use selective selectors. Requires touching every component that uses `useStore`. Testable with React DevTools Profiler before and after. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Deprecated CS2 networking commands in output | Config builder implementation | Test generated .cfg in a real CS2 client; no "Unknown command" errors in console |
| Wrong bind syntax (key names vs scancodes) | Bind configuration implementation | Test generated bind lines on a non-US keyboard layout; verify binds work as expected |
| Custom share code encoder (reimplementing akiver) | Crosshair export implementation | Import generated codes in CS2; verify all parameters match what the generator shows |
| AdSense double-push from StrictMode | AdSense integration | Verify no AdSense errors in dev console; check production deployment for correct ad rendering |
| Missing vercel.json rewrites | Initial Vercel deployment | Directly navigate to all routes and hit browser refresh on each; verify no 404s |
| Zustand full-store subscription re-renders | State management setup (Phase 1) | Use React DevTools Profiler; confirm CrosshairPreview does not re-render when config builder inputs change |
| Missing ads.txt | Pre-AdSense-application checklist | `curl https://yourdomain.com/ads.txt` returns 200 with correct content |
| -novid / defunct launch options in output | Launch options builder implementation | Manually audit every option in the builder output against the totalcsgo.com launch options guide |

---

## Sources

- [akiver/csgo-sharecode GitHub — releases](https://github.com/akiver/csgo-sharecode/releases) — v4.0.0 ESM-only, v3.1.0 CS2 followRecoil, BigInt requirement (HIGH confidence)
- [akiver/csgo-sharecode GitHub — README](https://github.com/akiver/csgo-sharecode) — Crosshair object field list, CS2 compatibility (HIGH confidence)
- [CS2 September 13 2023 update removes legacy convars — esports.gg](https://esports.gg/news/counter-strike-2/cs2-september-13-update/) — cl_updaterate, cl_cmdrate removal (MEDIUM confidence, multiple sources corroborate)
- [Valve removed cl_interp and cl_interp_ratio — bo3.gg](https://bo3.gg/news/valve-has-removed-the-clinterp-and-clinterpratio-commands-from-cs2-a-new-update-in-the-game) — cl_interp, cl_interp_ratio removal (MEDIUM confidence)
- [CS2 Launch Options — What Works and What Doesn't — totalcsgo.com](https://totalcsgo.com/launch-options) — -tickrate 128, -novid, -disable_d3d9ex, -threads confirmation (HIGH confidence, direct page inspection)
- [cl_crosshairstyle command — totalcsgo.com](https://totalcsgo.com/commands/clcrosshairstyle) — Valid style values 0-5 (HIGH confidence)
- [CS2 autoexec path guide — tradeit.gg](https://tradeit.gg/blog/cs2-autoexec-guide/) — Correct cfg folder path, common mistakes (MEDIUM confidence)
- [CS2 bind scancode format — Steam Community guide](https://steamcommunity.com/sharedfiles/filedetails/?l=german&id=3163205753) — February 2024 scancode change (MEDIUM confidence, corroborated by multiple sources)
- [React AdSense double-push — DEV Community](https://dev.to/deuos/how-to-implement-google-adsense-into-reactjs-2025-5g3h) — useEffect StrictMode double-invoke pattern (MEDIUM confidence)
- [Fix AdSense loading issues with React — Humanicus on Medium](https://humanicus.medium.com/fix-google-adsense-loading-issues-with-react-f338cbd61ac4) — SPA push() pattern (MEDIUM confidence)
- [Vercel SPA 404 routing fix — Vercel Community](https://community.vercel.com/t/404-on-refresh-direct-access-for-spa-subpaths-vercel-deployment/12593) — vercel.json rewrite requirement (HIGH confidence, official Vercel community)
- [URL.createObjectURL memory leak — MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static) — revokeObjectURL requirement (HIGH confidence)
- [Zustand preventing unnecessary re-renders — DEV Community](https://dev.to/eraywebdev/optimizing-zustand-how-to-prevent-unnecessary-re-renders-in-your-react-app-59do) — Selector patterns, useShallow (MEDIUM confidence)
- [AdSense eligibility requirements — Google AdSense Help](https://support.google.com/adsense/answer/9724) — Approval requirements, ads.txt (HIGH confidence, official source)

---
*Pitfalls research for: CS2 Setup Builder (crosshair generator + config builder React SPA)*
*Researched: 2026-03-31*
