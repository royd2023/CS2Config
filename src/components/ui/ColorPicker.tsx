// src/components/ui/ColorPicker.tsx
// Uses native HTML color input — locked decision per CONTEXT.md
// Note: native input type="color" uses hex string (#rrggbb), no alpha channel
// Alpha channel control deferred until Phase 2 needs it
interface ColorPickerProps {
  label: string;
  value: string;  // hex color string: "#rrggbb"
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label>
        {label}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
