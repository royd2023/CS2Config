// src/lib/constants/deprecatedCmds.ts
// Single source of truth for CS2 deprecated/removed commands.
// Both cfgGenerator.ts (to skip) and cfgGenerator.test.ts (to verify absence) import this.
// Source: Valve CS2 documentation, confirmed removed in CS2/Source 2
export const DEPRECATED_CS2_COMMANDS = [
  'cl_updaterate',   // Server-controlled in CS2, non-functional
  'cl_cmdrate',      // Server-controlled in CS2, non-functional
  'cl_interp',       // Removed by Valve, server handles interpolation
  'cl_interp_ratio', // Removed alongside cl_interp
  'rate',            // CS2 auto-detects optimal rate (treat as deprecated per research)
] as const;

export type DeprecatedCommand = typeof DEPRECATED_CS2_COMMANDS[number];
