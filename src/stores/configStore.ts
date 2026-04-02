// src/stores/configStore.ts
import { create } from 'zustand';
import type { ConfigState } from '@/types/config';

interface ConfigStore extends ConfigState {
  setMouse: (partial: Partial<ConfigState['mouse']>) => void;
  setBind: (action: keyof ConfigState['binds'], key: string) => void;
  setAudio: (partial: Partial<ConfigState['audio']>) => void;
  setLaunch: (partial: Partial<ConfigState['launch']>) => void;
  reset: () => void;
}

export const DEFAULT_CONFIG: ConfigState = {
  mouse: {
    sensitivity: 1.0,
    dpi: 800,
  },
  binds: {
    jump: 'SPACE',
    duck: 'LCTRL',
    attack: 'MOUSE1',
    attack2: 'MOUSE2',
    use: 'e',
    reload: 'r',
    inspect: 'F',
    scoreboard: 'TAB',
    voiceChat: 'k',
    buyMenu: 'b',
    grenadeFlash: 'MOUSE4',
    grenadeMolotov: 'MOUSE5',
    grenadeSmoke: '4',
    grenadeHE: 'g',
    grenadeDecoy: '5',
  },
  audio: {
    masterVolume: 0.5,
    voiceVolume: 0.8,
    muteEnemyVoice: false,
  },
  launch: {
    novid: true,
    console: true,
    high: false,
    fullscreen: false,
    noborder: false,
  },
};

export const useConfigStore = create<ConfigStore>()((set) => ({
  ...DEFAULT_CONFIG,
  setMouse: (partial) => set((s) => ({ mouse: { ...s.mouse, ...partial } })),
  setBind: (action, key) =>
    set((s) => ({ binds: { ...s.binds, [action]: key } })),
  setAudio: (partial) => set((s) => ({ audio: { ...s.audio, ...partial } })),
  setLaunch: (partial) => set((s) => ({ launch: { ...s.launch, ...partial } })),
  reset: () => set(DEFAULT_CONFIG),
}));
