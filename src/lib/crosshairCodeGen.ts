// src/lib/crosshairCodeGen.ts
// Pure function — no React imports, no side effects
import { encodeCrosshair } from 'csgo-sharecode';
import type { CrosshairState } from '@/types/crosshair';

/**
 * Maps CrosshairState → CS2 share code string (CSGO-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX)
 * Uses akiver/csgo-sharecode encodeCrosshair internally.
 *
 * Crosshair.color is a CS2 color preset index:
 *   0=red, 1=green, 2=yellow, 3=blue, 4=cyan, 5=custom RGB
 * We always use 5 (custom) so the encoded red/green/blue values are respected.
 */
export function crosshairCodeGen(state: CrosshairState): string {
  const crosshair = {
    // Line dimensions
    length: state.line.length,
    thickness: state.line.thickness,
    gap: state.line.gap,

    // Color channels (0-255)
    red: state.color.r,
    green: state.color.g,
    blue: state.color.b,
    alpha: state.color.a,
    alphaEnabled: true,

    // color=5 means custom RGB — required to honour the r/g/b values above
    color: 5,

    // Dot
    centerDotEnabled: state.dot.enabled,

    // Outline
    outlineEnabled: state.outline.enabled,
    outline: state.outline.enabled ? state.outline.thickness : 0,

    // Style flags
    style: state.style,
    tStyleEnabled: state.tStyle,
    followRecoil: state.followRecoil,

    // CS2 split/gap defaults (not exposed in UI in Phase 1)
    splitDistance: 7,
    fixedCrosshairGap: 3.0,
    innerSplitAlpha: 1.0,
    outerSplitAlpha: 0.5,
    splitSizeRatio: 0.5,
    deployedWeaponGapEnabled: false,
  };

  return encodeCrosshair(crosshair);
}
