// src/features/crosshair/CrosshairPreview.tsx
import { useCrosshairStore } from '@/stores/crosshairStore';

export function CrosshairPreview() {
  const { color, line, dot, outline, tStyle } = useCrosshairStore();

  const armLength = line.length * 4;           // 1 CS2 unit = 4px
  const gap = line.gap;                        // 1:1 to px, can be negative
  const thickness = Math.max(1, line.thickness); // minimum 1px rendered
  const fill = `rgba(${color.r},${color.g},${color.b},${color.a / 255})`;
  const outlineFill = `rgba(0,0,0,${color.a / 255})`;
  const ot = outline.enabled ? outline.thickness : 0;
  const dotSize = thickness * 2;

  // Build arms array: [x, y, width, height]
  const arms: [number, number, number, number][] = [
    [gap, -thickness / 2, armLength, thickness],                         // Right
    [-(gap + armLength), -thickness / 2, armLength, thickness],           // Left
    [-thickness / 2, gap, thickness, armLength],                          // Bottom
  ];
  if (!tStyle) {
    arms.push([-thickness / 2, -(gap + armLength), thickness, armLength]); // Top
  }

  return (
    <div className="w-full min-h-[200px] bg-[#1a1a1a] flex items-center justify-center py-8">
      <svg
        width={200}
        height={200}
        viewBox="-100 -100 200 200"
        aria-label="Crosshair preview"
      >
        {/* Outline layer — rendered before arms */}
        {outline.enabled &&
          arms.map(([x, y, w, h], i) => (
            <rect
              key={`ol-${i}`}
              x={x - ot}
              y={y - ot}
              width={w + ot * 2}
              height={h + ot * 2}
              fill={outlineFill}
            />
          ))}
        {/* Dot outline */}
        {outline.enabled && dot.enabled && (
          <rect
            x={-dotSize / 2 - ot}
            y={-dotSize / 2 - ot}
            width={dotSize + ot * 2}
            height={dotSize + ot * 2}
            fill={outlineFill}
          />
        )}
        {/* Arms */}
        {arms.map(([x, y, w, h], i) => (
          <rect key={`arm-${i}`} x={x} y={y} width={w} height={h} fill={fill} />
        ))}
        {/* Center dot */}
        {dot.enabled && (
          <rect
            x={-dotSize / 2}
            y={-dotSize / 2}
            width={dotSize}
            height={dotSize}
            fill={fill}
          />
        )}
      </svg>
    </div>
  );
}
