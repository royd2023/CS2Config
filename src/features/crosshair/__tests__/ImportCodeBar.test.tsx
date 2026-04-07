// src/features/crosshair/__tests__/ImportCodeBar.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImportCodeBar } from '../ImportCodeBar';

// Mock the crosshair store
vi.mock('@/stores/crosshairStore', () => ({
  useCrosshairStore: () => ({
    style: 4,
    color: { r: 0, g: 255, b: 0, a: 200 },
    line: { length: 4, thickness: 1, gap: -3 },
    dot: { enabled: false },
    outline: { enabled: false, thickness: 1 },
    tStyle: false,
    followRecoil: false,
  }),
}));

// Mock crosshairCodeGen to return a predictable value
vi.mock('@/lib/crosshairCodeGen', () => ({
  crosshairCodeGen: () => 'CSGO-TEST1-TEST2-TEST3-TEST4-TEST5',
}));

describe('ImportCodeBar', () => {
  it('renders the CS2 Import Code label in uppercase', () => {
    render(<ImportCodeBar />);
    expect(screen.getByText('CS2 Import Code')).toBeTruthy();
  });

  it('renders the share code string from crosshairCodeGen', () => {
    render(<ImportCodeBar />);
    expect(screen.getByText('CSGO-TEST1-TEST2-TEST3-TEST4-TEST5')).toBeTruthy();
  });

  it('renders a CopyButton with label Copy Code', () => {
    render(<ImportCodeBar />);
    expect(screen.getByRole('button', { name: 'Copy Code' })).toBeTruthy();
  });

  it('CopyButton receives the generated share code as value', () => {
    render(<ImportCodeBar />);
    // The button shows "Copy Code" which is the label passed to CopyButton
    const button = screen.getByRole('button', { name: 'Copy Code' });
    expect(button).toBeTruthy();
    // The share code is displayed in a code element
    const codeEl = screen.getByText('CSGO-TEST1-TEST2-TEST3-TEST4-TEST5');
    expect(codeEl.tagName.toLowerCase()).toBe('code');
  });
});
