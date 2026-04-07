// src/features/crosshair/__tests__/ToggleSwitch.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToggleSwitch } from '../ToggleSwitch';

describe('ToggleSwitch', () => {
  it('renders a label and a button with role=switch', () => {
    render(<ToggleSwitch label="Center Dot" checked={false} onChange={vi.fn()} />);
    expect(screen.getByText('Center Dot')).toBeTruthy();
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeTruthy();
  });

  it('calls onChange(true) when toggled on', () => {
    const onChange = vi.fn();
    render(<ToggleSwitch label="Center Dot" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange(false) when toggled off', () => {
    const onChange = vi.fn();
    render(<ToggleSwitch label="Center Dot" checked={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('shows accent color track when checked', () => {
    render(<ToggleSwitch label="Outline" checked={true} onChange={vi.fn()} />);
    const toggle = screen.getByRole('switch');
    expect(toggle.className).toContain('bg-[#f97316]');
  });

  it('clicking the label text also toggles the switch', () => {
    const onChange = vi.fn();
    render(<ToggleSwitch label="Follow Recoil" checked={false} onChange={onChange} />);
    // The label wraps both text and button, so clicking label fires onChange
    const label = screen.getByText('Follow Recoil');
    fireEvent.click(label);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
