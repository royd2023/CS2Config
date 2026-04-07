// src/features/crosshair/ColorSection.tsx
import { SliderRow } from './SliderRow';
import { ColorSwatch } from './ColorSwatch';
import type { CrosshairColor } from '@/types/crosshair';

interface ColorSectionProps {
  color: CrosshairColor;
  onColorChange: (partial: Partial<CrosshairColor>) => void;
}

export function ColorSection({ color, onColorChange }: ColorSectionProps) {
  return (
    <div className="space-y-4">
      {/* Swatch + RGBA readout row */}
      <div className="flex items-center gap-2">
        <ColorSwatch r={color.r} g={color.g} b={color.b} a={color.a} />
        <span className="text-[13px] font-mono text-[#e5e5e5]">
          R: {color.r}{'  '}G: {color.g}{'  '}B: {color.b}{'  '}A: {color.a}
        </span>
      </div>
      {/* Channel sliders */}
      <SliderRow label="R" min={0} max={255} step={1} value={color.r} onChange={(v) => onColorChange({ r: v })} />
      <SliderRow label="G" min={0} max={255} step={1} value={color.g} onChange={(v) => onColorChange({ g: v })} />
      <SliderRow label="B" min={0} max={255} step={1} value={color.b} onChange={(v) => onColorChange({ b: v })} />
      <SliderRow label="Alpha" min={0} max={255} step={1} value={color.a} onChange={(v) => onColorChange({ a: v })} />
    </div>
  );
}
