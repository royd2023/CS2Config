// src/components/ui/Slider.tsx
interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({ label, min, max, step = 1, value, onChange, className }: SliderProps) {
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
          className={className}
        />
      </label>
    </div>
  );
}
