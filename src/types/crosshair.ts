// src/types/crosshair.ts
export interface CrosshairColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-255 (alpha)
}

export interface CrosshairLine {
  length: number;    // cl_crosshairsize
  thickness: number; // cl_crosshairthickness
  gap: number;       // cl_crosshairgap (can be negative)
}

export interface CrosshairDot {
  enabled: boolean; // cl_crosshairdot
}

export interface CrosshairOutline {
  enabled: boolean;  // cl_crosshair_drawoutline
  thickness: number; // cl_crosshair_outlinethickness
}

// cl_crosshairstyle values: 0=default, 1=default static, 2=classic, 3=classic dynamic, 4=classic static, 5=tee
export type CrosshairStyle = 0 | 1 | 2 | 3 | 4 | 5;

export interface CrosshairState {
  style: CrosshairStyle;
  color: CrosshairColor;
  line: CrosshairLine;
  dot: CrosshairDot;
  outline: CrosshairOutline;
  tStyle: boolean;       // cl_crosshair_t
  followRecoil: boolean; // cl_crosshair_recoil
}
