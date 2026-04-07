// src/features/crosshair/ToggleSwitch.tsx

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer h-11">
      <span className="text-sm text-[#e5e5e5]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative w-9 h-5 rounded-[10px] transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f97316] focus-visible:outline-offset-2',
          checked ? 'bg-[#f97316]' : 'bg-[#3a3a3a]',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-150',
            checked ? 'translate-x-4' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </label>
  );
}
