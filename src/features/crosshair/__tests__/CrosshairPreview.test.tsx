// src/features/crosshair/__tests__/CrosshairPreview.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

describe('CrosshairPreview', () => {
  it.todo('renders an SVG element with viewBox="-100 -100 200 200"');
  it.todo('renders 4 rect arms when tStyle is false');
  it.todo('renders 3 rect arms when tStyle is true (top arm omitted)');
  it.todo('renders center dot rect when dot.enabled is true');
  it.todo('renders no center dot rect when dot.enabled is false');
  it.todo('renders outline rects when outline.enabled is true');
  it.todo('applies rgba fill from store color values');
  it.todo('wrapping div has bg-[#1a1a1a] class');
  it.todo('updates SVG when store state changes');
});
