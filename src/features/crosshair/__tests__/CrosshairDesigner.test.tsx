// src/features/crosshair/__tests__/CrosshairDesigner.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrosshairDesigner } from '../CrosshairDesigner';

// Track the mocked store state so tests can mutate it
let mockState = {
  style: 4 as number,
  color: { r: 0, g: 255, b: 0, a: 200 },
  line: { length: 4, thickness: 1, gap: -3 },
  dot: { enabled: false },
  outline: { enabled: false, thickness: 1 },
  tStyle: false,
  followRecoil: false,
  setColor: vi.fn(),
  setLine: vi.fn(),
  setDot: vi.fn(),
  setOutline: vi.fn(),
  set: vi.fn((partial: Record<string, unknown>) => {
    Object.assign(mockState, partial);
  }),
  reset: vi.fn(),
};

vi.mock('@/stores/crosshairStore', () => ({
  useCrosshairStore: () => mockState,
}));

vi.mock('@/lib/crosshairCodeGen', () => ({
  crosshairCodeGen: () => 'CSGO-TEST1-TEST2-TEST3-TEST4-TEST5',
}));

beforeEach(() => {
  mockState = {
    style: 4,
    color: { r: 0, g: 255, b: 0, a: 200 },
    line: { length: 4, thickness: 1, gap: -3 },
    dot: { enabled: false },
    outline: { enabled: false, thickness: 1 },
    tStyle: false,
    followRecoil: false,
    setColor: vi.fn(),
    setLine: vi.fn(),
    setDot: vi.fn(),
    setOutline: vi.fn(),
    set: vi.fn((partial: Record<string, unknown>) => {
      Object.assign(mockState, partial);
    }),
    reset: vi.fn(),
  };
});

describe('CrosshairDesigner', () => {
  it('renders CrosshairPreview component (SVG element present)', () => {
    render(<CrosshairDesigner />);
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders SegmentedButtonGroup for style selection with 4 buttons', () => {
    render(<CrosshairDesigner />);
    expect(screen.getByRole('button', { name: 'Classic Static' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Classic Dynamic' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Classic' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tee' })).toBeTruthy();
  });

  it('renders Size and Shape section with 3 SliderRow controls', () => {
    render(<CrosshairDesigner />);
    expect(screen.getByText('Line Length')).toBeTruthy();
    expect(screen.getByText('Line Thickness')).toBeTruthy();
    expect(screen.getByText('Gap')).toBeTruthy();
  });

  it('renders Color section with ColorSection component (4 RGBA sliders)', () => {
    render(<CrosshairDesigner />);
    // R, G, B, Alpha labels come from ColorSection
    expect(screen.getByText('R')).toBeTruthy();
    expect(screen.getByText('G')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText('Alpha')).toBeTruthy();
  });

  it('renders Outline section with toggle switch', () => {
    render(<CrosshairDesigner />);
    // SectionCard heading "Outline" is present (multiple elements OK — just check at least one exists)
    const outlineTexts = screen.getAllByText('Outline');
    expect(outlineTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('hides Center Dot toggle when style is Tee (5)', () => {
    mockState.style = 5;
    render(<CrosshairDesigner />);
    // The container wrapping Center Dot should have class "hidden"
    const centerDotLabel = screen.getByText('Center Dot');
    const container = centerDotLabel.closest('.hidden');
    expect(container).toBeTruthy();
  });

  it('shows Follow Recoil toggle only for Classic Dynamic (3)', () => {
    // style 4 — Follow Recoil should be hidden
    render(<CrosshairDesigner />);
    const followRecoilLabel = screen.getByText('Follow Recoil');
    const hiddenContainer = followRecoilLabel.closest('.hidden');
    expect(hiddenContainer).toBeTruthy();
  });

  it('Follow Recoil is visible for Classic Dynamic (style 3)', () => {
    mockState.style = 3;
    render(<CrosshairDesigner />);
    const followRecoilLabel = screen.getByText('Follow Recoil');
    const hiddenContainer = followRecoilLabel.closest('.hidden');
    expect(hiddenContainer).toBeNull();
  });

  it('renders ImportCodeBar at the bottom (CS2 Import Code label visible)', () => {
    render(<CrosshairDesigner />);
    expect(screen.getByText('CS2 Import Code')).toBeTruthy();
  });

  it('style switch calls set with STYLE_DEFAULTS for the selected style', () => {
    render(<CrosshairDesigner />);
    fireEvent.click(screen.getByRole('button', { name: 'Tee' }));
    expect(mockState.set).toHaveBeenCalledWith(
      expect.objectContaining({ style: 5 })
    );
  });
});
