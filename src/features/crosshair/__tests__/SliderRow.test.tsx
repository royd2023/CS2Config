// src/features/crosshair/__tests__/SliderRow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SliderRow } from '../SliderRow';

describe('SliderRow', () => {
  it('renders a label, range input, and number input', () => {
    render(<SliderRow label="Length" min={0} max={100} step={1} value={50} onChange={vi.fn()} />);
    expect(screen.getByText('Length')).toBeTruthy();
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBe(1); // number input
    const rangeInput = screen.getByRole('slider');
    expect(rangeInput).toBeTruthy();
  });

  it('calls onChange when range slider value changes', () => {
    const onChange = vi.fn();
    render(<SliderRow label="Length" min={0} max={100} step={1} value={50} onChange={onChange} />);
    const rangeInput = screen.getByRole('slider');
    fireEvent.change(rangeInput, { target: { value: '75' } });
    expect(onChange).toHaveBeenCalledWith(75);
  });

  it('clamps number input to min/max on blur', () => {
    const onChange = vi.fn();
    render(<SliderRow label="Alpha" min={0} max={255} step={1} value={100} onChange={onChange} />);
    const numberInput = screen.getByRole('spinbutton');
    fireEvent.change(numberInput, { target: { value: '999' } });
    fireEvent.blur(numberInput);
    expect(onChange).toHaveBeenCalledWith(255);
  });

  it('syncs number input display when value prop changes', () => {
    const { rerender } = render(
      <SliderRow label="Thickness" min={0} max={10} step={1} value={3} onChange={vi.fn()} />
    );
    const numberInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(numberInput.value).toBe('3');
    rerender(<SliderRow label="Thickness" min={0} max={10} step={1} value={7} onChange={vi.fn()} />);
    expect(numberInput.value).toBe('7');
  });

  it('updates on Enter key press in number input', () => {
    const onChange = vi.fn();
    render(<SliderRow label="Gap" min={-5} max={5} step={1} value={0} onChange={onChange} />);
    const numberInput = screen.getByRole('spinbutton');
    fireEvent.change(numberInput, { target: { value: '3' } });
    // keyDown + blur simulates Enter -> blur behavior in jsdom
    fireEvent.keyDown(numberInput, { key: 'Enter' });
    fireEvent.blur(numberInput);
    expect(onChange).toHaveBeenCalledWith(3);
  });
});
