// src/types/config.ts
export interface MouseSettings {
  sensitivity: number; // sensitivity command
  dpi: number;         // not a CS2 command — used only for eDPI display
}

// Top 15 CS2 actions for Phase 3 bind editor
export type BindAction =
  | 'jump'
  | 'duck'
  | 'attack'
  | 'attack2'
  | 'use'
  | 'reload'
  | 'inspect'
  | 'scoreboard'
  | 'voiceChat'
  | 'buyMenu'
  | 'grenadeFlash'
  | 'grenadeMolotov'
  | 'grenadeSmoke'
  | 'grenadeHE'
  | 'grenadeDecoy';

export type KeyBinds = Record<BindAction, string>;

export interface AudioSettings {
  masterVolume: number;    // volume (0.0–1.0)
  voiceVolume: number;     // voice_scale (0.0–1.0)
  muteEnemyVoice: boolean; // voice_enable 0/1
}

// Common CS2 launch options (safe presets only)
export interface LaunchOptions {
  novid: boolean;      // -novid: skip intro video
  console: boolean;    // -console: open console on start
  high: boolean;       // -high: high process priority
  fullscreen: boolean; // -fullscreen
  noborder: boolean;   // -noborder (windowed borderless)
}

export interface ConfigState {
  mouse: MouseSettings;
  binds: KeyBinds;
  audio: AudioSettings;
  launch: LaunchOptions;
}
