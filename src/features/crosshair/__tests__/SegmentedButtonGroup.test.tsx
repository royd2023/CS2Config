// src/features/crosshair/__tests__/SegmentedButtonGroup.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedButtonGroup } from '../SegmentedButtonGroup';

describe('SegmentedButtonGroup', () => {
  it('renders 4 buttons with labels Classic Static, Classic Dynamic, Classic, Tee', () => {
    render(<SegmentedButtonGroup activeValue={4} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Classic Static' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Classic Dynamic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Classic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tee' })).toBeInTheDocument();
  });

  it('highlights the active button with bg-[#f97316]', () => {
    render(<SegmentedButtonGroup activeValue={4} onChange={vi.fn()} />);
    const activeBtn = screen.getByRole('button', { name: 'Classic Static' });
    const inactiveBtn = screen.getByRole('button', { name: 'Classic Dynamic' });
    expect(activeBtn.className).toContain('bg-[#f97316]');
    expect(inactiveBtn.className).not.toContain('bg-[#f97316]');
    expect(inactiveBtn.className).toContain('bg-[#262626]');
  });

  it('calls onChange with style value when button clicked', () => {
    const onChange = vi.fn();
    render(<SegmentedButtonGroup activeValue={4} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tee' }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('maps button positions to style values: 4, 3, 2, 5', () => {
    const onChange = vi.fn();
    render(<SegmentedButtonGroup activeValue={4} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Classic Static' }));
    expect(onChange).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByRole('button', { name: 'Classic Dynamic' }));
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Classic' }));
    expect(onChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: 'Tee' }));
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
