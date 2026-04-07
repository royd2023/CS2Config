// src/features/crosshair/CrosshairDesigner.tsx
import { useCrosshairStore } from '@/stores/crosshairStore';
import { STYLE_DEFAULTS, STYLE_VISIBILITY } from './defaults';
import { CrosshairPreview } from './CrosshairPreview';
import { SegmentedButtonGroup } from './SegmentedButtonGroup';
import { SectionCard } from './SectionCard';
import { SliderRow } from './SliderRow';
import { ToggleSwitch } from './ToggleSwitch';
import { ColorSection } from './ColorSection';
import { ImportCodeBar } from './ImportCodeBar';

export function CrosshairDesigner() {
  const { style, color, line, dot, outline, tStyle, followRecoil,
          setColor, setLine, setDot, setOutline, set } = useCrosshairStore();

  const visibility = STYLE_VISIBILITY[style] ?? STYLE_VISIBILITY[4];

  const handleStyleChange = (newStyle: number) => {
    const defaults = STYLE_DEFAULTS[newStyle];
    if (defaults) {
      set(defaults);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Preview Panel */}
      <CrosshairPreview />

      {/* Controls Area */}
      <div className="max-w-[640px] mx-auto px-4 py-6 space-y-6">

        {/* Style Selector */}
        <SegmentedButtonGroup activeValue={style} onChange={handleStyleChange} />

        {/* Size & Shape Section */}
        <SectionCard heading="Size & Shape">
          <div className="space-y-0">
            <SliderRow label="Line Length" min={0} max={10} step={0.5} value={line.length}
              onChange={(v) => setLine({ length: v })} />
            <SliderRow label="Line Thickness" min={0.5} max={5} step={0.5} value={line.thickness}
              onChange={(v) => setLine({ thickness: v })} />
            <SliderRow label="Gap" min={-5} max={5} step={0.5} value={line.gap}
              onChange={(v) => setLine({ gap: v })} />
          </div>
          {/* Center Dot toggle — hidden for Tee (style 5) */}
          <div className={visibility.centerDot ? '' : 'hidden'}>
            <ToggleSwitch label="Center Dot" checked={dot.enabled}
              onChange={(v) => setDot({ enabled: v })} />
          </div>
          {/* T-Style toggle — hidden for Tee (style 5) */}
          <div className={visibility.tStyle ? '' : 'hidden'}>
            <ToggleSwitch label="T-Style" checked={tStyle}
              onChange={(v) => set({ tStyle: v })} />
          </div>
          {/* Follow Recoil toggle — visible only for Classic Dynamic (style 3) */}
          <div className={visibility.followRecoil ? '' : 'hidden'}>
            <ToggleSwitch label="Follow Recoil" checked={followRecoil}
              onChange={(v) => set({ followRecoil: v })} />
          </div>
        </SectionCard>

        {/* Color Section */}
        <SectionCard heading="Color">
          <ColorSection color={color} onColorChange={setColor} />
        </SectionCard>

        {/* Outline Section */}
        <SectionCard heading="Outline">
          <ToggleSwitch label="Outline" checked={outline.enabled}
            onChange={(v) => setOutline({ enabled: v })} />
          <div className={outline.enabled ? '' : 'hidden'}>
            <SliderRow label="Outline Thickness" min={0.5} max={3} step={0.5}
              value={outline.thickness}
              onChange={(v) => setOutline({ thickness: v })} />
          </div>
        </SectionCard>

        {/* Import Code Bar — always visible */}
        <ImportCodeBar />
      </div>
    </div>
  );
}
