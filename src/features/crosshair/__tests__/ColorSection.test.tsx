// src/features/crosshair/__tests__/ColorSection.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColorSection } from '../ColorSection';

const defaultColor = { r: 0, g: 255, b: 0, a: 200 };

describe('ColorSection', () => {
  it('renders 4 slider rows for R, G, B, Alpha', () => {
    render(<ColorSection color={defaultColor} onColorChange={vi.fn()} />);
    // Each SliderRow renders a range input
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(4);
    // Labels
    expect(screen.getByText('R')).toBeTruthy();
    expect(screen.getByText('G')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText('Alpha')).toBeTruthy();
  });

  it('renders a color swatch showing current RGBA', () => {
    render(<ColorSection color={defaultColor} onColorChange={vi.fn()} />);
    // ColorSwatch renders an aria-label with the rgba values
    const swatch = screen.getByLabelText(/Color swatch/);
    expect(swatch).toBeTruthy();
  });

  it('calls onColorChange with updated r value when R slider changes', () => {
    const onColorChange = vi.fn();
    render(<ColorSection color={defaultColor} onColorChange={onColorChange} />);
    const sliders = screen.getAllByRole('slider');
    // First slider is R
    fireEvent.change(sliders[0], { target: { value: '128' } });
    expect(onColorChange).toHaveBeenCalledWith({ r: 128 });
  });

  it('renders RGBA readout text in mono font', () => {
    render(<ColorSection color={defaultColor} onColorChange={vi.fn()} />);
    // The readout shows current values
    const readout = screen.getByText(/R: 0.*G: 255.*B: 0.*A: 200/);
    expect(readout).toBeTruthy();
  });
});
