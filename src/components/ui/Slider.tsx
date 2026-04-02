// src/components/ui/Slider.tsx
// Functional only — no custom styling per CONTEXT.md (deferred to Phase 4)
interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ label, min, max, step = 1, value, onChange }: SliderProps) {
  return (
    <div>
      <label>
        {label}: {value}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
