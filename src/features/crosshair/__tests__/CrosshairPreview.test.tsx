// src/features/crosshair/__tests__/CrosshairPreview.test.tsx
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { CrosshairPreview } from '../CrosshairPreview';
import { useCrosshairStore } from '@/stores/crosshairStore';

beforeEach(() => {
  // Reset store to defaults before each test
  act(() => {
    useCrosshairStore.getState().reset();
  });
});

describe('CrosshairPreview', () => {
  it('renders an SVG element with viewBox="-100 -100 200 200"', () => {
    render(<CrosshairPreview />);
    const svg = screen.getByLabelText('Crosshair preview');
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg).toHaveAttribute('viewBox', '-100 -100 200 200');
  });

  it('renders 4 rect arms when tStyle is false', () => {
    act(() => {
      useCrosshairStore.getState().set({ tStyle: false });
    });
    const { container } = render(<CrosshairPreview />);
    // 4 arm rects (no outline, no dot by default)
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(4);
  });

  it('renders 3 rect arms when tStyle is true (top arm omitted)', () => {
    act(() => {
      useCrosshairStore.getState().set({ tStyle: true });
    });
    const { container } = render(<CrosshairPreview />);
    // 3 arm rects
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(3);
  });

  it('renders center dot rect when dot.enabled is true', () => {
    act(() => {
      useCrosshairStore.getState().setDot({ enabled: true });
    });
    const { container } = render(<CrosshairPreview />);
    // 4 arm rects + 1 dot = 5
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(5);
  });

  it('renders no center dot rect when dot.enabled is false', () => {
    act(() => {
      useCrosshairStore.getState().setDot({ enabled: false });
    });
    const { container } = render(<CrosshairPreview />);
    // 4 arm rects only
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(4);
  });

  it('renders outline rects when outline.enabled is true', () => {
    act(() => {
      useCrosshairStore.getState().setOutline({ enabled: true, thickness: 1 });
    });
    const { container } = render(<CrosshairPreview />);
    // 4 outline rects + 4 arm rects = 8
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(8);
  });

  it('applies rgba fill from store color values', () => {
    act(() => {
      useCrosshairStore.getState().setColor({ r: 255, g: 0, b: 0, a: 255 });
    });
    const { container } = render(<CrosshairPreview />);
    const armRects = Array.from(container.querySelectorAll('rect'));
    const fillValues = armRects.map((r) => r.getAttribute('fill'));
    expect(fillValues.some((f) => f !== null && f.startsWith('rgba('))).toBe(true);
    expect(fillValues.some((f) => f === 'rgba(255,0,0,1)')).toBe(true);
  });

  it('wrapping div has bg-[#1a1a1a] class', () => {
    const { container } = render(<CrosshairPreview />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('bg-[#1a1a1a]');
  });

  it('updates SVG when store state changes', () => {
    const { container } = render(<CrosshairPreview />);
    // Initially 4 arms (tStyle false)
    expect(container.querySelectorAll('rect').length).toBe(4);
    // Set tStyle true - component should re-render reactively
    act(() => {
      useCrosshairStore.getState().set({ tStyle: true });
    });
    expect(container.querySelectorAll('rect').length).toBe(3);
  });
});
