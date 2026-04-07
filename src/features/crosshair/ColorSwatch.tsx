// src/features/crosshair/ColorSwatch.tsx

interface ColorSwatchProps {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function ColorSwatch({ r, g, b, a }: ColorSwatchProps) {
  return (
    <div
      className="w-6 h-6 rounded border border-[#3a3a3a] relative overflow-hidden"
      aria-label={`Color swatch: rgba(${r}, ${g}, ${b}, ${a})`}
    >
      {/* Checkerboard background to visualize alpha */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'linear-gradient(45deg, #555 25%, transparent 25%)',
            'linear-gradient(-45deg, #555 25%, transparent 25%)',
            'linear-gradient(45deg, transparent 75%, #555 75%)',
            'linear-gradient(-45deg, transparent 75%, #555 75%)',
          ].join(','),
          backgroundSize: '6px 6px',
          backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px',
        }}
      />
      {/* Color overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(${r},${g},${b},${a / 255})` }}
      />
    </div>
  );
}
