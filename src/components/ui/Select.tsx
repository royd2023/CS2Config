// src/components/ui/Select.tsx
// Functional only — no custom styling per CONTEXT.md (deferred to Phase 4)
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Select({ label, options, value, onChange }: SelectProps) {
  return (
    <div>
      <label>
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
