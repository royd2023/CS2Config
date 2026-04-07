// src/features/crosshair/SegmentedButtonGroup.tsx
import { STYLE_OPTIONS } from './defaults';

interface SegmentedButtonGroupProps {
  activeValue: number;
  onChange: (value: number) => void;
}

export function SegmentedButtonGroup({ activeValue, onChange }: SegmentedButtonGroupProps) {
  return (
    <div className="flex w-full">
      {STYLE_OPTIONS.map((opt, i) => {
        const isActive = opt.value === activeValue;
        const isFirst = i === 0;
        const isLast = i === STYLE_OPTIONS.length - 1;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'flex-1 h-10 text-sm font-semibold border border-[#3a3a3a]',
              isFirst ? 'rounded-l-md' : '',
              isLast ? 'rounded-r-md' : '',
              !isFirst ? '-ml-px' : '',
              isActive
                ? 'bg-[#f97316] text-[#1a1a1a] relative z-10'
                : 'bg-[#262626] text-[#e5e5e5] hover:bg-[#2e2e2e]',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
