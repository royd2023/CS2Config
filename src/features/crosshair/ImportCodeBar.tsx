// src/features/crosshair/ImportCodeBar.tsx
import { useCrosshairStore } from '@/stores/crosshairStore';
import { crosshairCodeGen } from '@/lib/crosshairCodeGen';
import { CopyButton } from '@/components/ui/CopyButton';

export function ImportCodeBar() {
  const state = useCrosshairStore();
  const code = crosshairCodeGen(state);

  return (
    <div className="bg-[#262626] border border-[#3a3a3a] rounded-lg p-4">
      <p className="text-xs font-semibold text-[#737373] uppercase tracking-[0.05em] mb-2">
        CS2 Import Code
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <code className="flex-1 text-[13px] font-mono text-[#e5e5e5] break-all leading-[1.4]">
          {code}
        </code>
        <CopyButton
          value={code}
          label="Copy Code"
          className="bg-[#262626] border border-[#3a3a3a] text-[#e5e5e5] rounded-md px-3 py-2 text-sm hover:bg-[rgba(249,115,22,0.15)] hover:border-[#f97316] transition-colors"
        />
      </div>
    </div>
  );
}
