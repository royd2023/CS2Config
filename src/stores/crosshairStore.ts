// src/stores/crosshairStore.ts
import { create } from 'zustand';
import type { CrosshairState } from '@/types/crosshair';

interface CrosshairStore extends CrosshairState {
  setColor: (partial: Partial<CrosshairState['color']>) => void;
  setLine: (partial: Partial<CrosshairState['line']>) => void;
  setDot: (partial: Partial<CrosshairState['dot']>) => void;
  setOutline: (partial: Partial<CrosshairState['outline']>) => void;
  set: (partial: Partial<CrosshairState>) => void;
  reset: () => void;
}

export const DEFAULT_CROSSHAIR: CrosshairState = {
  style: 4,           // Classic static — most common CS2 competitive default
  color: { r: 0, g: 255, b: 0, a: 200 },
  line: { length: 4, thickness: 1, gap: -3 },
  dot: { enabled: false },
  outline: { enabled: false, thickness: 1 },
  tStyle: false,
  followRecoil: false,
};

export const useCrosshairStore = create<CrosshairStore>()((set) => ({
  ...DEFAULT_CROSSHAIR,
  // Fine-grained nested setters to avoid wiping sibling fields (Zustand merges top-level only)
  setColor: (partial) =>
    set((s) => ({ color: { ...s.color, ...partial } })),
  setLine: (partial) =>
    set((s) => ({ line: { ...s.line, ...partial } })),
  setDot: (partial) =>
    set((s) => ({ dot: { ...s.dot, ...partial } })),
  setOutline: (partial) =>
    set((s) => ({ outline: { ...s.outline, ...partial } })),
  set: (partial) => set((s) => ({ ...s, ...partial })),
  reset: () => set(DEFAULT_CROSSHAIR),
}));
