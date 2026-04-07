// src/features/crosshair/SliderRow.tsx
import { useState, useEffect } from 'react';

interface SliderRowProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

export function SliderRow({ label, min, max, step, value, onChange }: SliderRowProps) {
  const [inputStr, setInputStr] = useState(String(value));

  // Keep input text in sync when value changes externally (e.g., from slider drag)
  useEffect(() => { setInputStr(String(value)); }, [value]);

  const commitInput = () => {
    const n = parseFloat(inputStr);
    const clamped = isNaN(n) ? value : Math.min(max, Math.max(min, Math.round(n * 10) / 10));
    setInputStr(String(clamped));
    onChange(clamped);
  };

  return (
    <div className="flex items-center gap-2 h-10">
      <span className="shrink-0 min-w-[120px] text-sm text-[#e5e5e5]">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.round(Number(e.target.value) * 10) / 10)}
        className="slider-range flex-1"
      />
      <input
        type="number"
        value={inputStr}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setInputStr(e.target.value)}
        onBlur={commitInput}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        className="number-input"
      />
    </div>
  );
}
