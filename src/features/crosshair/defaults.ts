// src/features/crosshair/defaults.ts
import type { CrosshairState } from '@/types/crosshair';

export const STYLE_DEFAULTS: Record<number, CrosshairState> = {
  4: { style: 4, color: { r: 0, g: 255, b: 0, a: 200 }, line: { length: 4, thickness: 1, gap: -3 }, dot: { enabled: false }, outline: { enabled: false, thickness: 1 }, tStyle: false, followRecoil: false },
  3: { style: 3, color: { r: 0, g: 255, b: 0, a: 200 }, line: { length: 4, thickness: 1, gap: 0 }, dot: { enabled: false }, outline: { enabled: false, thickness: 1 }, tStyle: false, followRecoil: false },
  2: { style: 2, color: { r: 0, g: 255, b: 0, a: 200 }, line: { length: 4, thickness: 1, gap: 0 }, dot: { enabled: false }, outline: { enabled: false, thickness: 1 }, tStyle: false, followRecoil: false },
  5: { style: 5, color: { r: 0, g: 255, b: 0, a: 200 }, line: { length: 4, thickness: 1, gap: 0 }, dot: { enabled: false }, outline: { enabled: false, thickness: 1 }, tStyle: false, followRecoil: false },
};

export interface StyleVisibility {
  centerDot: boolean;
  tStyle: boolean;
  followRecoil: boolean;
}

export const STYLE_VISIBILITY: Record<number, StyleVisibility> = {
  4: { centerDot: true,  tStyle: true,  followRecoil: false }, // Classic Static
  3: { centerDot: true,  tStyle: true,  followRecoil: true  }, // Classic Dynamic
  2: { centerDot: true,  tStyle: true,  followRecoil: false }, // Classic
  5: { centerDot: false, tStyle: false, followRecoil: false }, // Tee
};

export const STYLE_OPTIONS = [
  { label: 'Classic Static', value: 4 },
  { label: 'Classic Dynamic', value: 3 },
  { label: 'Classic', value: 2 },
  { label: 'Tee', value: 5 },
] as const;
